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

try {
    // Use the existing connection from config.php
    if (!$conn || $conn->connect_error) {
        throw new Exception("Database connection failed");
    }
    
    // Initialize query parts
    $query = "SELECT uc.*, u.fullName as seller_name FROM used_cars uc
              JOIN users u ON uc.user_id = u.id
              WHERE 1=1";
    $params = [];
    $types = "";
    $bindParams = [];
    
    // Apply filters if provided
    if (isset($_GET['brand']) && !empty($_GET['brand'])) {
        $query .= " AND uc.brand LIKE ?";
        $types .= "s";
        $brandParam = "%" . $_GET['brand'] . "%";
        $bindParams[] = &$brandParam;
    }
    
    if (isset($_GET['model']) && !empty($_GET['model'])) {
        $query .= " AND uc.model LIKE ?";
        $types .= "s";
        $modelParam = "%" . $_GET['model'] . "%";
        $bindParams[] = &$modelParam;
    }
    
    if (isset($_GET['min_year']) && !empty($_GET['min_year'])) {
        $query .= " AND uc.year >= ?";
        $types .= "i";
        $minYearParam = (int)$_GET['min_year'];
        $bindParams[] = &$minYearParam;
    }
    
    if (isset($_GET['max_year']) && !empty($_GET['max_year'])) {
        $query .= " AND uc.year <= ?";
        $types .= "i";
        $maxYearParam = (int)$_GET['max_year'];
        $bindParams[] = &$maxYearParam;
    }
    
    if (isset($_GET['min_price']) && !empty($_GET['min_price'])) {
        $query .= " AND uc.price >= ?";
        $types .= "d";
        $minPriceParam = (float)$_GET['min_price'];
        $bindParams[] = &$minPriceParam;
    }
    
    if (isset($_GET['max_price']) && !empty($_GET['max_price'])) {
        $query .= " AND uc.price <= ?";
        $types .= "d";
        $maxPriceParam = (float)$_GET['max_price'];
        $bindParams[] = &$maxPriceParam;
    }
    
    if (isset($_GET['location']) && !empty($_GET['location'])) {
        $query .= " AND uc.location LIKE ?";
        $types .= "s";
        $locationParam = "%" . $_GET['location'] . "%";
        $bindParams[] = &$locationParam;
    }
    
    // Add sorting order
    $query .= " ORDER BY uc.created_at DESC";
    
    // Prepare and execute query
    $stmt = $conn->prepare($query);
    
    // Bind parameters if there are any
    if (!empty($bindParams)) {
        // Create array with $stmt and $types as first elements
        $bindParamsArray = array_merge([&$stmt, &$types], $bindParams);
        
        // Call bind_param with the constructed array
        call_user_func_array('mysqli_stmt_bind_param', $bindParamsArray);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $usedCars = [];
    
    // Fetch all used cars
    while ($row = $result->fetch_assoc()) {
        $usedCars[] = $row;
    }
    
    // Format response data
    foreach ($usedCars as &$car) {
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
    }
    
    // Return success response
    echo json_encode([
        "success" => true,
        "usedCars" => $usedCars
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} 