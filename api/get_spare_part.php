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

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Check if id parameter is provided
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Spare part ID is required.']);
        exit();
    }
    
    $sparePartId = intval($_GET['id']);
    
    // Query to get the spare part with mechanic details
    $sql = "
        SELECT
            sp.*,
            u.fullName AS mechanic_name,
            u.email AS mechanic_email,
            u.phone AS mechanic_phone,
            m.location AS mechanic_location,
            m.specialty AS mechanic_specialty
        FROM
            spare_parts sp
        JOIN
            mechanics m ON sp.mechanic_id = m.id
        JOIN
            users u ON m.user_id = u.id
        WHERE
            sp.id = ?
    ";
    
    // Prepare and execute the query
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $sparePartId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404); // Not Found
        echo json_encode(['status' => 'error', 'message' => 'Spare part not found.']);
        $stmt->close();
        exit();
    }
    
    $row = $result->fetch_assoc();
    $sparePart = [
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
        'createdAt' => $row['created_at'],
        'mechanic' => [
            'id' => $row['mechanic_id'],
            'name' => $row['mechanic_name'],
            'email' => $row['mechanic_email'],
            'phone' => $row['mechanic_phone'],
            'location' => $row['mechanic_location'],
            'specialty' => $row['mechanic_specialty']
        ]
    ];
    
    $stmt->close();
    
    // Return the spare part
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'sparePart' => $sparePart
    ]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}
?> 