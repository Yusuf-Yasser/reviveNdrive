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

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $mechanic_id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    if (empty($mechanic_id)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Mechanic ID is required.']);
        exit();
    }
    
    // Get the user_id associated with the mechanic
    $stmt = $conn->prepare("SELECT user_id FROM mechanics WHERE id = ?");
    $stmt->bind_param("i", $mechanic_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Mechanic not found.']);
        $stmt->close();
        exit();
    }
    
    $mechanic = $result->fetch_assoc();
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'user_id' => (int)$mechanic['user_id']
    ]);
    
    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}

$conn->close();
?> 