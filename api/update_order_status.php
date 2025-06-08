<?php
require_once 'config.php';
require_once 'check_auth.php';

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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Check if user is authenticated
    $auth_result = check_auth();
    if (!$auth_result['is_authenticated']) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'You must be logged in to update order status.'
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
            'message' => 'Only mechanics can update order status.'
        ]);
        exit();
    }
    
    $mechanic = $result->fetch_assoc();
    $mechanic_id = $mechanic['id'];
    
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Validate required fields
    if (!isset($data['orderId']) || empty($data['orderId']) || 
        !isset($data['status']) || empty($data['status'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Order ID and status are required.'
        ]);
        exit();
    }
    
    $order_id = $data['orderId'];
    $new_status = $data['status'];
    
    // Validate status
    $valid_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'];
    if (!in_array($new_status, $valid_statuses)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid status. Valid values are: ' . implode(', ', $valid_statuses)
        ]);
        exit();
    }
    
    // Check if the order exists and belongs to a spare part owned by this mechanic
    $stmt = $conn->prepare("
        SELECT po.id, po.order_status 
        FROM part_orders po
        JOIN spare_parts sp ON po.spare_part_id = sp.id
        WHERE po.id = ? AND sp.mechanic_id = ?
    ");
    $stmt->bind_param("ii", $order_id, $mechanic_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Order not found or does not belong to your spare parts.'
        ]);
        exit();
    }
    
    $order = $result->fetch_assoc();
    $current_status = $order['order_status'];
    
    // Handle special case: if order is already delivered or canceled, don't allow changes
    if ($current_status === 'delivered' || $current_status === 'canceled') {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => "Cannot update order status. Order is already $current_status."
        ]);
        exit();
    }
    
    // Update the order status
    $stmt = $conn->prepare("UPDATE part_orders SET order_status = ? WHERE id = ?");
    $stmt->bind_param("si", $new_status, $order_id);
    $result = $stmt->execute();
    
    if ($result) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Order status updated successfully.',
            'orderId' => $order_id,
            'newStatus' => $new_status
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update order status.'
        ]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?> 