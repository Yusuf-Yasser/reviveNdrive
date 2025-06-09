<?php
require_once 'config.php';
require_once 'check_auth.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

// Get the JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($data['orderId']) || !isset($data['rating']) || !isset($data['comment'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit();
}

$orderId = $data['orderId'];
$rating = intval($data['rating']);
$comment = $data['comment'];
$userId = $_SESSION['user_id'];

// Validate rating range
if ($rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Rating must be between 1 and 5']);
    exit();
}

try {
    // Start transaction
    $conn->begin_transaction();

    // First, check if the order exists, belongs to the user, and is delivered
    $checkOrderStmt = $conn->prepare("
        SELECT po.spare_part_id, po.order_status, sp.mechanic_id 
        FROM part_orders po
        JOIN spare_parts sp ON po.spare_part_id = sp.id
        WHERE po.id = ? AND po.user_id = ? AND po.order_status = 'delivered'
    ");
    $checkOrderStmt->bind_param('ii', $orderId, $userId);
    $checkOrderStmt->execute();
    $result = $checkOrderStmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('Order not found, not delivered, or does not belong to you');
    }

    $orderData = $result->fetch_assoc();
    $mechanicId = $orderData['mechanic_id'];

    // Check if feedback already exists for this order
    $checkFeedbackStmt = $conn->prepare("SELECT id FROM feedback WHERE part_order_id = ?");
    $checkFeedbackStmt->bind_param('i', $orderId);
    $checkFeedbackStmt->execute();
    
    if ($checkFeedbackStmt->get_result()->num_rows > 0) {
        throw new Exception('Feedback already submitted for this order');
    }

    // Insert the feedback
    $insertStmt = $conn->prepare("
        INSERT INTO feedback (part_order_id, user_id, mechanic_id, rating, comment)
        VALUES (?, ?, ?, ?, ?)
    ");
    $insertStmt->bind_param('iiiis', $orderId, $userId, $mechanicId, $rating, $comment);
    $insertStmt->execute();

    // Commit transaction
    $conn->commit();

    // Return success response
    echo json_encode(['status' => 'success', 'message' => 'Feedback submitted successfully']);

} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($checkOrderStmt)) $checkOrderStmt->close();
    if (isset($checkFeedbackStmt)) $checkFeedbackStmt->close();
    if (isset($insertStmt)) $insertStmt->close();
} 