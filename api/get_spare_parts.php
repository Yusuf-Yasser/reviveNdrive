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
    // Optional filters
    $filters = [];
    $bindTypes = "";
    $bindValues = [];
    
    // Parse filters from query parameters
    if (isset($_GET['make']) && !empty($_GET['make'])) {
        $filters[] = "car_make = ?";
        $bindTypes .= "s";
        $bindValues[] = $_GET['make'];
    }
    
    if (isset($_GET['model']) && !empty($_GET['model'])) {
        $filters[] = "car_model = ?";
        $bindTypes .= "s";
        $bindValues[] = $_GET['model'];
    }
    
    if (isset($_GET['condition']) && !empty($_GET['condition'])) {
        $filters[] = "`condition` = ?";
        $bindTypes .= "s";
        $bindValues[] = $_GET['condition'];
    }
    
    // Build the query
    $sql = "
        SELECT
            sp.*,
            u.fullName AS mechanic_name,
            u.email AS mechanic_email,
            u.phone AS mechanic_phone,
            m.location AS mechanic_location
        FROM
            spare_parts sp
        JOIN
            mechanics m ON sp.mechanic_id = m.id
        JOIN
            users u ON m.user_id = u.id
    ";
    
    if (!empty($filters)) {
        $sql .= " WHERE " . implode(" AND ", $filters);
    }
    
    $sql .= " ORDER BY sp.created_at DESC";
    
    // Prepare and execute the query
    $stmt = $conn->prepare($sql);
    
    if (!empty($bindValues)) {
        // Create an array of references to bind_param
        $bindParams = array();
        $bindParams[] = &$bindTypes;
        
        for ($i = 0; $i < count($bindValues); $i++) {
            $bindParams[] = &$bindValues[$i];
        }
        
        call_user_func_array(array($stmt, 'bind_param'), $bindParams);
    }
    
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
            'createdAt' => $row['created_at'],
            'mechanic' => [
                'id' => $row['mechanic_id'],
                'name' => $row['mechanic_name'],
                'email' => $row['mechanic_email'],
                'phone' => $row['mechanic_phone'],
                'location' => $row['mechanic_location']
            ]
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