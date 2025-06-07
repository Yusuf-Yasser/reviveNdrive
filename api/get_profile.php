<?php
require_once 'config.php';

header('Content-Type: application/json');
// CORS headers are handled in config.php
// header('Access-Control-Allow-Origin: http://localhost:5173');
// header('Access-Control-Allow-Methods: GET, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type, Authorization');
// header('Access-Control-Allow-Credentials: true');

// session_start() is handled in config.php
// if (session_status() == PHP_SESSION_NONE) {
//     session_start();
// }

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated.']);
        exit();
    }

    $userId = $_SESSION['user_id'];
    
    // Release the session lock as we've got the user_id and won't write to the session
    session_write_close(); 

    $profileData = [];

    // Fetch common user data
    $stmtUser = $conn->prepare("SELECT id, fullName, email, phone, avatar, user_type, created_at FROM users WHERE id = ?");
    if (!$stmtUser) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare user statement: ' . $conn->error]);
        exit();
    }
    $stmtUser->bind_param("i", $userId);
    $stmtUser->execute();
    $resultUser = $stmtUser->get_result();

    if ($user = $resultUser->fetch_assoc()) {
        $profileData = [
            'id' => $user['id'],
            'fullName' => $user['fullName'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'avatar' => $user['avatar'],
            'userType' => $user['user_type'],
            'created_at' => $user['created_at']
        ];

        // If user is a mechanic, fetch mechanic-specific data
        if ($user['user_type'] === 'mechanic') {
            $stmtMechanic = $conn->prepare("SELECT specialty, location FROM mechanics WHERE user_id = ?");
            if (!$stmtMechanic) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Failed to prepare mechanic statement: ' . $conn->error]);
                $stmtUser->close(); // Close previous statement
                // $conn->close(); // Connection will be closed at script end
                exit();
            }
            $stmtMechanic->bind_param("i", $userId);
            $stmtMechanic->execute();
            $resultMechanic = $stmtMechanic->get_result();
            if ($mechanic = $resultMechanic->fetch_assoc()) {
                $profileData['specialty'] = $mechanic['specialty'];
                $profileData['location'] = $mechanic['location'];
            }
            $stmtMechanic->close();
        } else {
            // For non-mechanic users, fetch their cars
            $stmtCars = $conn->prepare("SELECT id, make, model, year, color, created_at FROM cars WHERE user_id = ? ORDER BY created_at DESC");
            if (!$stmtCars) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Failed to prepare cars statement: ' . $conn->error]);
                $stmtUser->close();
                exit();
            }
            
            $stmtCars->bind_param("i", $userId);
            $stmtCars->execute();
            $resultCars = $stmtCars->get_result();
            
            $cars = [];
            while ($car = $resultCars->fetch_assoc()) {
                $cars[] = $car;
            }
            
            $profileData['cars'] = $cars;
            $stmtCars->close();
        }

        http_response_code(200);
        echo json_encode(['status' => 'success', 'user' => $profileData]);
    } else {
        // This case should ideally not happen if session user_id is valid
        http_response_code(404); 
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
    }
    $stmtUser->close();
    // $conn->close(); // Connection will be closed automatically at script end

} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}
?>
