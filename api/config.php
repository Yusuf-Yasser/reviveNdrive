<?php
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

// Start session if not already started
// It's better to start sessions only in scripts that need them (e.g., login, signup, check_auth)
// to avoid unnecessary session overhead.
// if (session_status() == PHP_SESSION_NONE) {
//     session_start();
// }

// It's generally good practice to set the charset for the connection
$conn->set_charset('utf8mb4');

?>
