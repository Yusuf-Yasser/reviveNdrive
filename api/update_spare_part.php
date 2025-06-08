<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
    http_response_code(200);
    exit();
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
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
        echo json_encode(['status' => 'error', 'message' => 'Only mechanics can update spare parts.']);
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

    // Process form data
    $data = json_decode(file_get_contents('php://input'), true);
    
    $sparePartId = $data['id'] ?? null;
    $name = $data['name'] ?? null;
    $description = $data['description'] ?? null;
    $carMake = $data['carMake'] ?? null;
    $carModel = $data['carModel'] ?? null;
    $yearRange = $data['yearRange'] ?? null;
    $condition = $data['condition'] ?? null;
    $price = $data['price'] ?? null;
    $quantity = $data['quantity'] ?? 1;
    $imageUrl = $data['imageUrl'] ?? null;

    // Validate required fields
    if (empty($sparePartId) || empty($name) || empty($condition) || empty($price)) {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'ID, name, condition, and price are required.']);
        exit();
    }

    // Check if the spare part belongs to this mechanic
    $checkStmt = $conn->prepare("SELECT id FROM spare_parts WHERE id = ? AND mechanic_id = ?");
    $checkStmt->bind_param("ii", $sparePartId, $mechanicId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows === 0) {
        http_response_code(403); // Forbidden
        echo json_encode(['status' => 'error', 'message' => 'You do not have permission to update this spare part.']);
        $checkStmt->close();
        exit();
    }
    $checkStmt->close();

    // Update the spare part
    $updateStmt = $conn->prepare("
        UPDATE spare_parts 
        SET name = ?, description = ?, car_make = ?, car_model = ?, 
            year_range = ?, `condition` = ?, price = ?, quantity = ?, image_url = ?
        WHERE id = ?
    ");
    $updateStmt->bind_param("ssssssdisi", $name, $description, $carMake, $carModel, $yearRange, $condition, $price, $quantity, $imageUrl, $sparePartId);
    
    if ($updateStmt->execute()) {
        $updateStmt->close();
        
        // Return success response with the updated spare part
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Spare part updated successfully.',
            'sparePart' => [
                'id' => $sparePartId,
                'name' => $name,
                'description' => $description,
                'carMake' => $carMake,
                'carModel' => $carModel,
                'yearRange' => $yearRange,
                'condition' => $condition,
                'price' => $price,
                'quantity' => $quantity,
                'imageUrl' => $imageUrl,
                'mechanicId' => $mechanicId
            ]
        ]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Failed to update spare part: ' . $updateStmt->error]);
        $updateStmt->close();
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?> 