<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
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
require_once "check_auth.php";

// Check if user is logged in
$user = checkAuth();
if (!$user) {
    echo json_encode(["success" => false, "message" => "Authentication required"]);
    exit;
}

// Check if POST or DELETE request
if ($_SERVER["REQUEST_METHOD"] !== "POST" && $_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

// Get data from request
$data = [];
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    // Parse query string for DELETE requests
    parse_str(file_get_contents("php://input"), $data);
} else {
    // For POST request
    if (isset($_POST['car_id'])) {
        $data = $_POST;
    } else {
        $data = json_decode(file_get_contents("php://input"), true);
    }
}

// Check if car ID is provided
if (!isset($data['car_id']) && !isset($_GET['car_id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Car ID is required"]);
    exit;
}

// Get car ID from either the request body or query parameters
$carId = isset($data['car_id']) ? intval($data['car_id']) : intval($_GET['car_id']);

try {
    // Use the existing connection from config.php
    if (!$conn || $conn->connect_error) {
        throw new Exception("Database connection failed");
    }
    
    // Check if the car belongs to the current user
    $stmt = $conn->prepare("
        SELECT * FROM used_cars 
        WHERE id = ? AND user_id = ?
    ");
    
    $userId = $user["id"];
    $stmt->bind_param("ii", $carId, $userId);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $car = $result->fetch_assoc();
    $stmt->close();
    
    if (!$car) {
        http_response_code(404);
        echo json_encode([
            "success" => false, 
            "message" => "Used car not found or you don't have permission to delete it"
        ]);
        exit;
    }
    
    // Get image path to delete it
    $imagePath = null;
    if ($car['image_url'] && strpos($car['image_url'], '/') !== false) {
        $imagePath = "../" . $car['image_url'];
    }
    
    // Delete the car from database
    $stmt = $conn->prepare("DELETE FROM used_cars WHERE id = ?");
    $stmt->bind_param("i", $carId);
    $stmt->execute();
    $stmt->close();
    
    // Delete image file if it exists
    if ($imagePath && file_exists($imagePath)) {
        unlink($imagePath);
    }
    
    // Return success response
    echo json_encode([
        "success" => true, 
        "message" => "Used car deleted successfully"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Database error: " . $e->getMessage()
    ]);
} 