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
    if (!isset($data['carId'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Missing required field: carId']);
        exit();
    }
    
    $carId = (int)$data['carId'];
    
    // Delete the car but make sure it belongs to the current user
    $stmt = $conn->prepare("DELETE FROM cars WHERE id = ? AND user_id = ?");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->error]);
        exit();
    }
    
    $stmt->bind_param("ii", $carId, $userId);
    
    if ($stmt->execute()) {
        // Check if any rows were affected
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success', 
                'message' => 'Car deleted successfully'
            ]);
        } else {
            // If no rows were affected, either the car doesn't exist or doesn't belong to the user
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Car not found or not owned by user']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete car: ' . $stmt->error]);
    }
    
    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?> 