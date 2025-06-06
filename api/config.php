<?php
// --- START CORS CONFIGURATION ---
$allowed_origins = ['http://localhost:5173', 'http://localhost:5174']; // Add other ports if Vite uses them

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true'); // Important for cookies, authorization headers with HTTPS
}
// If origin is not in the list, no ACAO header is sent, which is correct for blocking unknown origins.

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');

// Handle preflight requests (OPTIONS method)
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Return 200 OK status for preflight requests
    http_response_code(200);
    exit;
}
// --- END CORS CONFIGURATION ---

// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Enable error reporting for debugging (remove or comment out in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root'); // Default XAMPP username
define('DB_PASSWORD', '');     // Default XAMPP password
define('DB_NAME', 'carservice'); // << YOU WILL NEED TO CREATE THIS DATABASE IN PHPMYADMIN

// Attempt to connect to MySQL database
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    header('Content-Type: application/json');
    http_response_code(500);
    // Provide a more structured error for the client
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit(); // Terminate script execution if connection fails
}

// Session start is now handled above, after CORS configuration.

// It's generally good practice to set the charset for the connection
$conn->set_charset('utf8mb4');

?>
