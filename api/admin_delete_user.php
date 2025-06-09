<?php
require_once 'config.php';

header('Content-Type: application/json');

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if admin is logged in
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized. Admin access required.']);
    exit();
}

// Support both DELETE method and POST method with delete action
if ($_SERVER['REQUEST_METHOD'] == 'DELETE' || ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'DELETE')) {
    // Get user ID from URL parameter or request body
    $userId = null;
    
    if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
        // Parse DELETE request body
        parse_str(file_get_contents('php://input'), $data);
        $userId = $data['id'] ?? null;
        
        // If not in body, check for URL parameter
        if (empty($userId) && isset($_GET['id'])) {
            $userId = $_GET['id'];
        }
    } else {
        // POST with _method=DELETE
        $userId = $_POST['id'] ?? null;
    }

    if (empty($userId)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'User ID is required.'
        ]);
        exit();
    }
    
    // Prevent deleting the current admin
    if ($userId == $_SESSION['admin_id']) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Cannot delete the currently logged-in admin account.'
        ]);
        exit();
    }

    // Check if user exists
    $check_stmt = $conn->prepare("SELECT id, user_type FROM users WHERE id = ?");
    $check_stmt->bind_param("i", $userId);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'User not found.'
        ]);
        $check_stmt->close();
        exit();
    }
    
    $user = $check_result->fetch_assoc();
    $check_stmt->close();

    // Delete the user
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'User deleted successfully.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to delete user: ' . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only DELETE method (or POST with _method=DELETE) is accepted.']);
}

$conn->close();
?> 