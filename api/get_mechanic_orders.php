<?php
require_once 'config.php';
require_once 'check_auth.php';

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
    // Check if user is authenticated
    $auth_result = check_auth();
    if (!$auth_result['is_authenticated']) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'You must be logged in to view orders.'
        ]);
        exit();
    }
    
    $user_id = $auth_result['user_id'];
    
    // Check if user is a mechanic
    $stmt = $conn->prepare("SELECT id FROM mechanics WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(403);
        echo json_encode([
            'status' => 'error',
            'message' => 'Only mechanics can view orders.'
        ]);
        exit();
    }
    
    $mechanic = $result->fetch_assoc();
    $mechanic_id = $mechanic['id'];
    
    // Optional status filter
    $status_filter = "";
    $status_param = "";
    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $status_filter = "AND po.order_status = ?";
        $status_param = $_GET['status'];
    }
    
    // Query to get all orders for spare parts owned by this mechanic
    $query = "
        SELECT 
            po.id, 
            po.quantity, 
            po.order_status, 
            po.shipping_address, 
            po.contact_phone, 
            po.total_price, 
            po.notes, 
            po.created_at, 
            po.updated_at,
            sp.id as spare_part_id,
            sp.name as part_name,
            sp.price as unit_price,
            u.id as user_id,
            u.fullName as user_name,
            u.email as user_email,
            u.phone as user_phone
        FROM 
            part_orders po
        JOIN 
            spare_parts sp ON po.spare_part_id = sp.id
        JOIN 
            users u ON po.user_id = u.id
        WHERE 
            sp.mechanic_id = ? 
            $status_filter
        ORDER BY 
            po.created_at DESC
    ";
    
    if (!empty($status_filter)) {
        $stmt = $conn->prepare($query);
        $stmt->bind_param("is", $mechanic_id, $status_param);
    } else {
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $mechanic_id);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = [
            'id' => $row['id'],
            'quantity' => $row['quantity'],
            'orderStatus' => $row['order_status'],
            'shippingAddress' => $row['shipping_address'],
            'contactPhone' => $row['contact_phone'],
            'totalPrice' => $row['total_price'],
            'notes' => $row['notes'],
            'createdAt' => $row['created_at'],
            'updatedAt' => $row['updated_at'],
            'sparePart' => [
                'id' => $row['spare_part_id'],
                'name' => $row['part_name'],
                'unitPrice' => $row['unit_price']
            ],
            'customer' => [
                'id' => $row['user_id'],
                'name' => $row['user_name'],
                'email' => $row['user_email'],
                'phone' => $row['user_phone']
            ]
        ];
    }
    
    // Return the orders
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count' => count($orders),
        'orders' => $orders
    ]);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}
?> 