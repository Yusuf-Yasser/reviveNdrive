<?php
require_once 'config.php'; // We need this for database access if we want to refresh user data

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // Specific origin for credentials
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // These headers are crucial for the preflight request to succeed when credentials are involved.
    header('Access-Control-Allow-Origin: http://localhost:5173'); // Must match the requesting origin
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Specify allowed methods
    header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Specify allowed headers
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // Optional: caches preflight response for 1 day
    http_response_code(200); // Or 204 No Content is also common for OPTIONS
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_SESSION['user_id'])) {
        // User is logged in, fetch their details from DB to ensure data is fresh
        // (or just return session data if that's sufficient and DB hit is not needed every time)
        $userId = $_SESSION['user_id'];

        $stmt = $conn->prepare("SELECT id, fullName, email, avatar, phone, user_type FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($user = $result->fetch_assoc()) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'loggedIn' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['fullName'],
                    'email' => $user['email'],
                    'avatar' => $user['avatar'],
                    'phone' => $user['phone'],
                    'userType' => $user['user_type']
                ]
            ]);
        } else {
            // User ID in session but not in DB (should not happen ideally)
            session_destroy(); // Clear invalid session
            http_response_code(401);
            echo json_encode(['status' => 'error', 'loggedIn' => false, 'message' => 'User not found in database.']);
        }
        $stmt->close();
    } else {
        // User is not logged in
        http_response_code(200); // Or 401 if you prefer to signal not authenticated directly
        echo json_encode(['status' => 'success', 'loggedIn' => false]);
    }
    $conn->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}
?>
