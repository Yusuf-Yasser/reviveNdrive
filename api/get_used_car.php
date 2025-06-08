<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Set JSON response content type
header("Content-Type: application/json");

// Include database configuration
require_once "config.php";

// Check if GET request
if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Check if car ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Car ID is required"]);
    exit;
}

$carId = intval($_GET['id']);

try {
    // Use the existing connection from config.php
    if (!$conn || $conn->connect_error) {
        throw new Exception("Database connection failed");
    }
    
    // Prepare query to get car with seller info
    $stmt = $conn->prepare("
        SELECT uc.*, u.fullName as seller_name, u.phone as seller_phone
        FROM used_cars uc
        JOIN users u ON uc.user_id = u.id
        WHERE uc.id = ?
    ");
    
    $stmt->bind_param("i", $carId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $car = $result->fetch_assoc();
    
    if (!$car) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Used car not found"]);
        exit;
    }
    
    // Format price to 2 decimal places
    $car['price'] = number_format((float)$car['price'], 2, '.', '');
    
    // Add full image URL if an image exists
    if ($car['image_url']) {
        // Check if image_url already has the domain
        if (strpos($car['image_url'], 'http') !== 0) {
            $httpHost = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'localhost';
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
            $baseUrl = $protocol . '://' . $httpHost . '/CarService-master/';
            $car['image_url'] = $baseUrl . $car['image_url'];
        }
    }
    
    // Return success response
    echo json_encode([
        "success" => true,
        "usedCar" => $car
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} 