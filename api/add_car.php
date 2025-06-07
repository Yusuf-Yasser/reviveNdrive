<?php
require_once 'config.php';

header('Content-Type: application/json');
// CORS headers are handled in config.php

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if user is authenticated
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated.']);
        exit();
    }

    $userId = $_SESSION['user_id'];
    
    // Get the request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($data['make']) || !isset($data['model']) || !isset($data['year'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields: make, model, year']);
        exit();
    }
    
    // Sanitize and prepare the data
    $make = trim($data['make']);
    $model = trim($data['model']);
    $year = (int)$data['year'];
    $color = isset($data['color']) ? trim($data['color']) : null;
    
    // Basic validation
    if (empty($make) || empty($model) || $year < 1900 || $year > date('Y') + 1) {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
        exit();
    }
    
    // Insert the car into the database
    $stmt = $conn->prepare("INSERT INTO cars (user_id, make, model, year, color) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->error]);
        exit();
    }
    
    $stmt->bind_param("issis", $userId, $make, $model, $year, $color);
    
    if ($stmt->execute()) {
        $carId = $stmt->insert_id;
        $stmt->close();
        
        // Fetch the newly added car for the response
        $stmtGet = $conn->prepare("SELECT id, make, model, year, color, created_at FROM cars WHERE id = ?");
        $stmtGet->bind_param("i", $carId);
        $stmtGet->execute();
        $result = $stmtGet->get_result();
        $car = $result->fetch_assoc();
        $stmtGet->close();
        
        http_response_code(201); // Created
        echo json_encode([
            'status' => 'success', 
            'message' => 'Car added successfully',
            'car' => $car
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to add car: ' . $stmt->error]);
        $stmt->close();
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?> 