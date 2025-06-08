<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit();
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated.']);
        exit();
    }

    $userId = $_SESSION['user_id'];

    // Check if the user is a mechanic
    $userStmt = $conn->prepare("SELECT user_type FROM users WHERE id = ?");
    $userStmt->bind_param("i", $userId);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    $user = $userResult->fetch_assoc();
    
    if (!$user || $user['user_type'] !== 'mechanic') {
        http_response_code(403); // Forbidden
        echo json_encode(['status' => 'error', 'message' => 'Only mechanics can view their spare parts.']);
        $userStmt->close();
        exit();
    }
    $userStmt->close();

    // Get mechanic_id from the mechanics table
    $mechanicStmt = $conn->prepare("SELECT id FROM mechanics WHERE user_id = ?");
    $mechanicStmt->bind_param("i", $userId);
    $mechanicStmt->execute();
    $mechanicResult = $mechanicStmt->get_result();
    $mechanic = $mechanicResult->fetch_assoc();
    
    if (!$mechanic) {
        http_response_code(404); // Not Found
        echo json_encode(['status' => 'error', 'message' => 'Mechanic profile not found.']);
        $mechanicStmt->close();
        exit();
    }
    
    $mechanicId = $mechanic['id'];
    $mechanicStmt->close();

    // Get all spare parts for this mechanic
    $sql = "SELECT * FROM spare_parts WHERE mechanic_id = ? ORDER BY created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $mechanicId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $spareParts = [];
    
    while ($row = $result->fetch_assoc()) {
        $spareParts[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'carMake' => $row['car_make'],
            'carModel' => $row['car_model'],
            'yearRange' => $row['year_range'],
            'condition' => $row['condition'],
            'price' => $row['price'],
            'quantity' => $row['quantity'],
            'imageUrl' => $row['image_url'],
            'createdAt' => $row['created_at']
        ];
    }
    
    $stmt->close();
    
    // Return the spare parts
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count' => count($spareParts),
        'spareParts' => $spareParts
    ]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}
?> 