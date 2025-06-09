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

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate inputs
    $userId = $data['id'] ?? null;
    $fullName = $data['fullName'] ?? null;
    $email = $data['email'] ?? null;
    $phone = $data['phone'] ?? null;
    $user_type = $data['user_type'] ?? null;
    
    if (empty($userId)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'User ID is required.'
        ]);
        exit();
    }

    // Build update query based on provided fields
    $updateFields = [];
    $params = [];
    $types = "";

    if (!empty($fullName)) {
        $updateFields[] = "fullName = ?";
        $params[] = $fullName;
        $types .= "s";
    }

    if (!empty($email)) {
        // Check if email already exists for a different user
        $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $check_stmt->bind_param("si", $email, $userId);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();

        if ($check_result->num_rows > 0) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Email already in use by another account.'
            ]);
            $check_stmt->close();
            exit();
        }
        $check_stmt->close();

        $updateFields[] = "email = ?";
        $params[] = $email;
        $types .= "s";
    }

    if (isset($phone)) {
        $updateFields[] = "phone = ?";
        $params[] = $phone;
        $types .= "s";
    }

    if (!empty($user_type)) {
        if (!in_array($user_type, ['normal_user', 'mechanic', 'admin'])) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid user type. Must be normal_user, mechanic, or admin.'
            ]);
            exit();
        }
        $updateFields[] = "user_type = ?";
        $params[] = $user_type;
        $types .= "s";
    }

    // If no fields to update
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'No fields to update.'
        ]);
        exit();
    }

    // Prepare and execute the update query
    $query = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $params[] = $userId;
    $types .= "i";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        // Get the updated user data
        $select_stmt = $conn->prepare("SELECT id, fullName, email, phone, user_type FROM users WHERE id = ?");
        $select_stmt->bind_param("i", $userId);
        $select_stmt->execute();
        $result = $select_stmt->get_result();
        $user = $result->fetch_assoc();
        $select_stmt->close();

        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'User updated successfully.',
            'user' => $user
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update user: ' . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only PUT method is accepted.']);
}

$conn->close();
?> 