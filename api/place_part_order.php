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
            'message' => 'You must be logged in to place an order.'
        ]);
        exit();
    }
    
    $user_id = $auth_result['user_id'];
    
    // Get JSON data from request body
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Validate required fields
    $required_fields = ['sparePartId', 'quantity', 'shippingAddress', 'contactPhone'];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => "Missing required field: $field"
            ]);
            exit();
        }
    }
    
    $spare_part_id = $data['sparePartId'];
    $quantity = intval($data['quantity']);
    $shipping_address = $data['shippingAddress'];
    $contact_phone = $data['contactPhone'];
    $notes = isset($data['notes']) ? $data['notes'] : null;
    
    // Validate quantity
    if ($quantity <= 0) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Quantity must be greater than 0'
        ]);
        exit();
    }
    
    // Check if spare part exists and has sufficient quantity
    $stmt = $conn->prepare("SELECT price, quantity FROM spare_parts WHERE id = ?");
    $stmt->bind_param("i", $spare_part_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Spare part not found'
        ]);
        exit();
    }
    
    $part = $result->fetch_assoc();
    if ($part['quantity'] < $quantity) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Not enough items in stock'
        ]);
        exit();
    }
    
    // Calculate total price
    $total_price = $part['price'] * $quantity;
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert order
        $stmt = $conn->prepare("INSERT INTO part_orders (user_id, spare_part_id, quantity, shipping_address, contact_phone, total_price, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iiissds", $user_id, $spare_part_id, $quantity, $shipping_address, $contact_phone, $total_price, $notes);
        $stmt->execute();
        $order_id = $conn->insert_id;
        
        // Update spare part quantity
        $new_quantity = $part['quantity'] - $quantity;
        $stmt = $conn->prepare("UPDATE spare_parts SET quantity = ? WHERE id = ?");
        $stmt->bind_param("ii", $new_quantity, $spare_part_id);
        $stmt->execute();
        
        // Commit transaction
        $conn->commit();
        
        // Return success
        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'message' => 'Order placed successfully',
            'orderId' => $order_id
        ]);
    } catch (Exception $e) {
        // Rollback transaction on error
        $conn->rollback();
        
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to place order: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?> 