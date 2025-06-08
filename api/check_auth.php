<?php
require_once 'config.php'; // We need this for database access if we want to refresh user data

// Only add headers when this file is accessed directly, not when included
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: http://localhost:5173'); // Specific origin for credentials
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
}

// Always ensure session is started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

/**
 * Debug function to log session and user info
 */
function debugLog($message, $data = null) {
    $logFile = "../debug_auth.log";
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}";
    
    if ($data !== null) {
        $logMessage .= " " . print_r($data, true);
    }
    
    file_put_contents($logFile, $logMessage . PHP_EOL, FILE_APPEND);
}

/**
 * Check if a user is authenticated and return user data
 * 
 * @return array Authentication result containing 'is_authenticated' flag and user data if authenticated
 */
function check_auth() {
    global $conn;
    
    // Initialize return structure
    $result = [
        'is_authenticated' => false,
        'user_id' => null,
        'user_data' => null
    ];
    
    if (!isset($_SESSION['user_id'])) {
        return $result;
    }
    
    $userId = $_SESSION['user_id'];
    $result['user_id'] = $userId;
    
    try {
        $stmt = $conn->prepare("SELECT id, fullName, email, avatar, phone, user_type FROM users WHERE id = ?");
        if (!$stmt) {
            return $result;
        }
        
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result_set = $stmt->get_result();
        
        if ($user = $result_set->fetch_assoc()) {
            $stmt->close();
            
            // User data structure
            $userData = [
                'id' => $user['id'],
                'name' => $user['fullName'],
                'email' => $user['email'],
                'avatar' => $user['avatar'],
                'phone' => $user['phone'],
                'userType' => $user['user_type']
            ];
            
            $result['is_authenticated'] = true;
            $result['user_data'] = $userData;
            
            return $result;
        } else {
            // User ID in session but not in DB (should not happen ideally)
            session_destroy(); // Clear invalid session
            $stmt->close();
            return $result;
        }
    } catch (Exception $e) {
        return $result;
    }
}

// Force a temporary user for testing if none exists
// REMOVE THIS IN PRODUCTION
if (!isset($_SESSION['user_id']) && $_SERVER['SERVER_NAME'] === 'localhost') {
    $_SESSION['user_id'] = 1; // Assuming ID 1 exists in the database
}

// Handle direct API requests to this file
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
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
        $auth_result = check_auth();
        
        if ($auth_result['is_authenticated']) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'loggedIn' => true,
                'user' => $auth_result['user_data']
            ]);
        } else {
            // User is not logged in
            http_response_code(200); // Or 401 if you prefer to signal not authenticated directly
            echo json_encode(['status' => 'success', 'loggedIn' => false]);
        }
    } else {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
    }
}
?>
