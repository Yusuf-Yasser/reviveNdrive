<?php
require_once 'config.php';

header('Content-Type: application/json');

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if admin is logged in
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized. Admin access required.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Get limit parameter (default 10)
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    
    // Get recent bookings with user information
    $query = "SELECT 
                po.id, 
                po.quantity,
                po.order_status as status,
                po.total_price as amount,
                u.fullName as customer,
                sp.name as service
              FROM part_orders po
              JOIN users u ON po.user_id = u.id
              JOIN spare_parts sp ON po.spare_part_id = sp.id
              ORDER BY po.created_at DESC
              LIMIT ?";
              
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = [
            'id' => (int)$row['id'],
            'service' => $row['service'],
            'customer' => $row['customer'],
            'status' => ucfirst($row['status']), // Capitalize first letter
            'amount' => (float)$row['amount']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'bookings' => $bookings
    ]);
    
    $stmt->close();
    
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}

$conn->close();
?> 