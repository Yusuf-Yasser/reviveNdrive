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
    // Pagination parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $per_page = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;
    $offset = ($page - 1) * $per_page;
    
    // Search parameter
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    // Build query
    $query = "SELECT 
                m.id,
                u.fullName as name,
                m.specialty,
                m.location,
                u.created_at as joined
              FROM mechanics m
              JOIN users u ON m.user_id = u.id";
              
    $count_query = "SELECT COUNT(*) as total FROM mechanics m JOIN users u ON m.user_id = u.id";
    
    // Add search filter if provided
    if (!empty($search)) {
        $search_param = "%$search%";
        $query .= " WHERE u.fullName LIKE ? OR m.specialty LIKE ? OR m.location LIKE ?";
        $count_query .= " WHERE u.fullName LIKE ? OR m.specialty LIKE ? OR m.location LIKE ?";
    }
    
    // Add sorting and pagination
    $query .= " ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
    
    // Prepare and execute count query
    if (!empty($search)) {
        $count_stmt = $conn->prepare($count_query);
        if (!$count_stmt) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare count statement: ' . $conn->error]);
            exit();
        }
        $count_stmt->bind_param("sss", $search_param, $search_param, $search_param);
    } else {
        $count_stmt = $conn->prepare($count_query);
        if (!$count_stmt) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare count statement: ' . $conn->error]);
            exit();
        }
    }
    if (!$count_stmt->execute()) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to execute count statement: ' . $count_stmt->error]);
        exit();
    }
    $count_stmt->bind_result($total_mechanics);
    $count_stmt->fetch();
    $count_stmt->close();
    
    // Prepare and execute main query
    if (!empty($search)) {
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare main statement: ' . $conn->error]);
            exit();
        }
        $stmt->bind_param("sssii", $search_param, $search_param, $search_param, $per_page, $offset);
    } else {
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare main statement: ' . $conn->error]);
            exit();
        }
        $stmt->bind_param("ii", $per_page, $offset);
    }
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to execute main statement: ' . $stmt->error]);
        exit();
    }
    $stmt->bind_result($id, $name, $specialty, $location, $joined);
    
    // Get feedback ratings for mechanics
    $mechanics = [];
    while ($stmt->fetch()) {
        // Get average rating
        $rating_query = "SELECT AVG(rating) as avg_rating, COUNT(*) as rating_count FROM feedback WHERE mechanic_id = ?";
        $rating_stmt = $conn->prepare($rating_query);
        $avg_rating = 0;
        $rating_count = 0;
        if ($rating_stmt) {
            $rating_stmt->bind_param("i", $id);
            if ($rating_stmt->execute()) {
                $rating_stmt->bind_result($avg_rating, $rating_count);
                $rating_stmt->fetch();
            } 
            $rating_stmt->close();
        }
        
        // Use null coalescing operator to handle NULL values
        $avg_rating = $avg_rating ?? 0;
        $rating_count = $rating_count ?? 0;
        
        // Calculate years of experience (mock data for now based on join date)
        $join_date = new DateTime($joined);
        $now = new DateTime();
        $experience = $join_date->diff($now)->y;
        if ($experience < 1) $experience = 1; // Ensure at least 1 year of experience
        
        // Get mechanic status if available
        $status_query = "SELECT status FROM mechanic_status WHERE mechanic_id = ?";
        $status_stmt = $conn->prepare($status_query);
        $status = 'Available';
        if ($status_stmt) {
            $status_stmt->bind_param("i", $id);
            if ($status_stmt->execute()) {
                $status_stmt->bind_result($status_val);
                if ($status_stmt->fetch()) {
                    $status = $status_val;
                }
            }
            $status_stmt->close();
        }
        
        $mechanics[] = [
            'id' => (int)$id,
            'name' => $name,
            'specialty' => $specialty ?: 'General Repair',
            'rating' => $rating_count > 0 ? round((float)$avg_rating, 1) : 3.5, // Use actual rating if exists, otherwise default to 3.5
            'experience' => $experience . ' ' . ($experience == 1 ? 'year' : 'years'),
            'status' => $status
        ];
    }
    $stmt->close();
    
    $total_pages = ceil($total_mechanics / $per_page);
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'mechanics' => $mechanics,
        'pagination' => [
            'total' => (int)$total_mechanics,
            'per_page' => (int)$per_page,
            'current_page' => (int)$page,
            'last_page' => (int)$total_pages
        ]
    ]);
    
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}

$conn->close();
?> 