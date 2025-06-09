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
    // Get dashboard stats
    
    // 1. Total users count
    $users_query = "SELECT COUNT(*) as total FROM users WHERE user_type != 'admin'";
    $users_result = $conn->query($users_query);
    $users_count = $users_result->fetch_assoc()['total'];
    
    // 2. Total mechanics count
    $mechanics_query = "SELECT COUNT(*) as total FROM mechanics";
    $mechanics_result = $conn->query($mechanics_query);
    $mechanics_count = $mechanics_result->fetch_assoc()['total'];
    
    // 3. Total bookings/orders count
    $bookings_query = "SELECT COUNT(*) as total FROM part_orders";
    $bookings_result = $conn->query($bookings_query);
    $bookings_count = $bookings_result->fetch_assoc()['total'];
    
    // 4. Total revenue
    $revenue_query = "SELECT SUM(total_price) as total FROM part_orders WHERE order_status != 'canceled'";
    $revenue_result = $conn->query($revenue_query);
    $revenue = $revenue_result->fetch_assoc()['total'] ?? 0;
    
    // 5. Total tow trucks (arbitrary for now, as we don't have the actual data)
    $tow_trucks = 25; // Default value or placeholder
    
    // 6. Total inspections
    $inspections = 120; // Default value or placeholder
    
    $stats = [
        'users' => (int)$users_count,
        'mechanics' => (int)$mechanics_count,
        'bookings' => (int)$bookings_count,
        'revenue' => (float)$revenue,
        'towTrucks' => (int)$tow_trucks,
        'inspections' => (int)$inspections,
    ];
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'stats' => $stats
    ]);
    
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}

$conn->close();
?> 