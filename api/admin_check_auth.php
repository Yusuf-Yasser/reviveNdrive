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

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Check if admin session exists
    if (isset($_SESSION['admin_id']) && isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
        // Admin is logged in
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Admin is authenticated.',
            'admin' => [
                'id' => $_SESSION['admin_id'],
                'name' => $_SESSION['admin_name'], 
                'email' => $_SESSION['admin_email']
            ],
            'isAdmin' => true
        ]);
    } else {
        // Not authenticated as admin
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Not authenticated as admin.',
            'isAdmin' => false
        ]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}
?> 