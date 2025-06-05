<?php
// No need to include config.php if we are only dealing with sessions and not DB
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // Specific origin for credentials
header('Access-Control-Allow-Methods: POST, OPTIONS'); // Typically logout is a POST or GET
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: POST, OPTIONS'); // Adjusted for logout (primarily POST)
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') { // Or GET, depending on how you call it from frontend
    // Unset all of the session variables.
    $_SESSION = array();

    // If it's desired to kill the session, also delete the session cookie.
    // Note: This will destroy the session, and not just the session data!
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Finally, destroy the session.
    session_destroy();

    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Logout successful.']);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted for logout.']);
}
?>
