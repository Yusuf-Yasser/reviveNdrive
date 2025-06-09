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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate inputs
    $fullName = $data['fullName'] ?? null;
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;
    $phone = $data['phone'] ?? null;

    if (empty($fullName) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Full name, email and password are required.'
        ]);
        exit();
    }

    // Check if email already exists
    $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email already registered.'
        ]);
        $check_stmt->close();
        exit();
    }
    $check_stmt->close();

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Create new admin user
    $stmt = $conn->prepare("INSERT INTO users (fullName, email, password, phone, user_type) VALUES (?, ?, ?, ?, 'admin')");
    $stmt->bind_param("ssss", $fullName, $email, $hashed_password, $phone);

    if ($stmt->execute()) {
        $user_id = $conn->insert_id;
        
        http_response_code(201); // Created
        echo json_encode([
            'status' => 'success',
            'message' => 'Admin user created successfully.',
            'user' => [
                'id' => $user_id,
                'name' => $fullName,
                'email' => $email
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create admin user: ' . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}

$conn->close();
?> 