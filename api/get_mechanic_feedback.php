<?php
require_once 'config.php';
require_once 'check_auth.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

// Get mechanic ID from query parameters
$mechanicId = isset($_GET['mechanicId']) ? intval($_GET['mechanicId']) : null;

// If no mechanic ID provided, try to get the logged-in mechanic's ID
if (!$mechanicId && isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'mechanic') {
    $stmt = $conn->prepare("SELECT id FROM mechanics WHERE user_id = ?");
    $stmt->bind_param('i', $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $mechanicId = $row['id'];
    }
    $stmt->close();
}

if (!$mechanicId) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Mechanic ID is required']);
    exit();
}

try {
    // Get feedback with user details and order information
    $stmt = $conn->prepare("
        SELECT 
            f.id,
            f.rating,
            f.comment,
            f.created_at,
            u.fullName as user_name,
            po.id as order_id,
            sp.name as part_name
        FROM feedback f
        JOIN users u ON f.user_id = u.id
        JOIN part_orders po ON f.part_order_id = po.id
        JOIN spare_parts sp ON po.spare_part_id = sp.id
        WHERE f.mechanic_id = ?
        ORDER BY f.created_at DESC
    ");
    
    $stmt->bind_param('i', $mechanicId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $feedback = [];
    while ($row = $result->fetch_assoc()) {
        $feedback[] = [
            'id' => $row['id'],
            'rating' => intval($row['rating']),
            'comment' => $row['comment'],
            'userName' => $row['user_name'],
            'orderId' => $row['order_id'],
            'partName' => $row['part_name'],
            'createdAt' => $row['created_at']
        ];
    }
    
    // Calculate average rating
    $avgStmt = $conn->prepare("
        SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
        FROM feedback 
        WHERE mechanic_id = ?
    ");
    $avgStmt->bind_param('i', $mechanicId);
    $avgStmt->execute();
    $avgResult = $avgStmt->get_result()->fetch_assoc();
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'feedback' => $feedback,
            'averageRating' => round(floatval($avgResult['avg_rating']), 1),
            'totalReviews' => intval($avgResult['total_reviews'])
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch feedback']);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($avgStmt)) $avgStmt->close();
} 