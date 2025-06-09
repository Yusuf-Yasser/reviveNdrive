<?php
// Prevent any output buffering issues
ob_start();

// Set JSON response content type immediately
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    ob_end_clean();
    echo json_encode(["success" => true]);
    exit;
}

// Error handling function to ensure only JSON is sent 
function sendErrorResponse($code, $message) {
    global $conn;
    http_response_code($code);
    
    // Close any open database connections
    if (isset($conn) && $conn) {
        $conn->close();
    }
    
    // Clear any previous output
    if (ob_get_level()) {
        ob_end_clean();
    }
    
    echo json_encode([
        "success" => false,
        "message" => $message
    ]);
    exit;
}

// Set error handler to catch PHP errors
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    sendErrorResponse(500, "Server error: " . $errstr);
}, E_ALL);

// Set exception handler
set_exception_handler(function($e) {
    sendErrorResponse(500, "Exception: " . $e->getMessage());
});

try {
    // Include database configuration
    require_once "config.php";
    require_once "check_auth.php";
    
    // Check if user is logged in
    $auth_result = check_auth();
    if (!$auth_result['is_authenticated']) {
        sendErrorResponse(401, "Authentication required");
    }
    $user = $auth_result['user_data'];
    
    // Check if POST request
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        sendErrorResponse(405, "Method not allowed");
    }
    
    // Get request body
    $data = [];
    if (isset($_POST['brand'])) {
        $data = $_POST;
    } else {
        $data = json_decode(file_get_contents("php://input"), true);
    }
    
    // Validate required fields
    $requiredFields = ["brand", "model", "year", "price", "km", "location", "email"];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            $missingFields[] = $field;
        }
    }
    
    if (!empty($missingFields)) {
        sendErrorResponse(400, "Missing required fields: " . implode(", ", $missingFields));
    }
    
    // Handle image upload
    $imageUrl = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $uploadDir = "../uploads/used_cars/";
        
        // Create directory if it doesn't exist
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                sendErrorResponse(500, "Failed to create uploads directory");
            }
        }
        
        $fileName = time() . '_' . basename($_FILES['image']['name']);
        $targetPath = $uploadDir . $fileName;
        $imageUrl = "uploads/used_cars/" . $fileName;
        
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
            sendErrorResponse(500, "Failed to upload image");
        }
    }
    
    // Use the existing connection from config.php
    if (!$conn || $conn->connect_error) {
        sendErrorResponse(500, "Database connection failed: " . ($conn ? $conn->connect_error : "Connection not established"));
    }
    
    // Insert used car into database using MySQLi directly to avoid complex binding
    $userId = intval($user["id"]);
    $brand = $conn->real_escape_string($data["brand"]);
    $model = $conn->real_escape_string($data["model"]);
    $year = intval($data["year"]);
    $color = $conn->real_escape_string(isset($data["color"]) ? $data["color"] : '');
    $price = floatval($data["price"]);
    $km = intval($data["km"]);
    $location = $conn->real_escape_string($data["location"]);
    $email = $conn->real_escape_string($data["email"]);
    $description = $conn->real_escape_string(isset($data["desc"]) ? $data["desc"] : '');
    $imageUrl = $conn->real_escape_string($imageUrl ?? '');
    
    // Use direct query without prepared statement to avoid binding issues
    $sql = "INSERT INTO used_cars 
            (user_id, brand, model, year, color, price, km, location, email, description, image_url) 
            VALUES 
            ('$userId', '$brand', '$model', '$year', '$color', '$price', '$km', '$location', '$email', '$description', '$imageUrl')";
            
    if (!$conn->query($sql)) {
        sendErrorResponse(500, "SQL Error: " . $conn->error);
    }
    
    $carId = $conn->insert_id;
    
    // Clear any output buffer before sending the response
    if (ob_get_level()) {
        ob_end_clean();
    }
    
    // Return success response
    echo json_encode([
        "success" => true, 
        "message" => "Used car added successfully",
        "carId" => $carId
    ]);
    
} catch (Exception $e) {
    sendErrorResponse(500, "Database error: " . $e->getMessage());
} 