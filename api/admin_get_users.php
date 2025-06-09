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
    $query = "SELECT id, fullName as name, email, phone, created_at as joined, user_type as status 
              FROM users 
              WHERE user_type != 'admin'";
              
    $count_query = "SELECT COUNT(*) as total FROM users WHERE user_type != 'admin'";
    
    // Add search filter if provided
    if (!empty($search)) {
        $search_param = "%$search%";
        $query .= " AND (fullName LIKE ? OR email LIKE ? OR phone LIKE ?)";
        $count_query .= " AND (fullName LIKE ? OR email LIKE ? OR phone LIKE ?)";
    }
    
    // Add sorting and pagination
    $query .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    
    // Prepare and execute count query
    if (!empty($search)) {
        $count_stmt = $conn->prepare($count_query);
        $count_stmt->bind_param("sss", $search_param, $search_param, $search_param);
    } else {
        $count_stmt = $conn->prepare($count_query);
    }
    
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $total_users = $count_result->fetch_assoc()['total'];
    $count_stmt->close();
    
    // Prepare and execute main query
    if (!empty($search)) {
        $stmt = $conn->prepare($query);
        $stmt->bind_param("sssii", $search_param, $search_param, $search_param, $per_page, $offset);
    } else {
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $per_page, $offset);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'joined' => date('Y-m-d', strtotime($row['joined'])),
            'status' => $row['status'] === 'mechanic' ? 'Mechanic' : 'User'
        ];
    }
    
    $total_pages = ceil($total_users / $per_page);
    
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'users' => $users,
        'pagination' => [
            'total' => (int)$total_users,
            'per_page' => (int)$per_page,
            'current_page' => (int)$page,
            'last_page' => (int)$total_pages
        ]
    ]);
    
    $stmt->close();
    
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only GET method is accepted.']);
}

$conn->close();
?> 