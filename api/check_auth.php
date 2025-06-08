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
 * @return array|false User data array or false if not authenticated
 */
function checkAuth() {
    global $conn;
    
    debugLog("Session data:", $_SESSION);
    
    if (!isset($_SESSION['user_id'])) {
        debugLog("No user_id in session");
        return false;
    }
    
    $userId = $_SESSION['user_id'];
    debugLog("Found user_id in session: " . $userId);
    
    try {
        $stmt = $conn->prepare("SELECT id, fullName, email, avatar, phone, user_type FROM users WHERE id = ?");
        if (!$stmt) {
            debugLog("Failed to prepare statement: " . $conn->error);
            return false;
        }
        
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($user = $result->fetch_assoc()) {
            $stmt->close();
            debugLog("User found in database", $user);
            
            // For testing, create a simpler user structure
            $userData = [
                'id' => $user['id'],
                'name' => $user['fullName'],
                'email' => $user['email'],
                'avatar' => $user['avatar'],
                'phone' => $user['phone'],
                'userType' => $user['user_type']
            ];
            
            return $userData;
        } else {
            // User ID in session but not in DB (should not happen ideally)
            debugLog("User not found in database with ID: " . $userId);
            session_destroy(); // Clear invalid session
            $stmt->close();
            return false;
        }
    } catch (Exception $e) {
        debugLog("Exception in checkAuth: " . $e->getMessage());
        return false;
    }
}

// Force a temporary user for testing if none exists
// REMOVE THIS IN PRODUCTION
if (!isset($_SESSION['user_id'])) {
    debugLog("Setting temporary test user for development");
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
        $user = checkAuth();
        
        if ($user) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'loggedIn' => true,
                'user' => $user
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
