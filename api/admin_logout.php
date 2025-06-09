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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Clear admin session
    unset($_SESSION['admin_id']);
    unset($_SESSION['admin_email']);
    unset($_SESSION['admin_name']);
    unset($_SESSION['is_admin']);
    
    // Optional: session_destroy() if you want to clear all session data
    // session_destroy();
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Admin logout successful.'
    ]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?> 