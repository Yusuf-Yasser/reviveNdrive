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

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate inputs
    $mechanic_id = $data['id'] ?? null;
    $status = $data['status'] ?? null;
    
    if (empty($mechanic_id)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Mechanic ID is required.'
        ]);
        exit();
    }
    
    if (empty($status)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Status is required.'
        ]);
        exit();
    }
    
    // Validate status
    $valid_statuses = ['Available', 'Busy', 'On Leave'];
    if (!in_array($status, $valid_statuses)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid status. Must be one of: ' . implode(', ', $valid_statuses)
        ]);
        exit();
    }
    
    // First check if mechanic exists
    $check_stmt = $conn->prepare("SELECT id FROM mechanics WHERE id = ?");
    $check_stmt->bind_param("i", $mechanic_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Mechanic not found.'
        ]);
        $check_stmt->close();
        exit();
    }
    $check_stmt->close();
    
    // Create mechanic_status table if it doesn't exist
    $create_table_query = "CREATE TABLE IF NOT EXISTS mechanic_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mechanic_id INT NOT NULL UNIQUE,
        status VARCHAR(50) NOT NULL DEFAULT 'Available',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (mechanic_id) REFERENCES mechanics(id) ON DELETE CASCADE
    )";
    
    if (!$conn->query($create_table_query)) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create status table: ' . $conn->error
        ]);
        exit();
    }
    
    // Update or insert mechanic status
    $upsert_query = "INSERT INTO mechanic_status (mechanic_id, status) VALUES (?, ?)
                     ON DUPLICATE KEY UPDATE status = ?";
    $upsert_stmt = $conn->prepare($upsert_query);
    $upsert_stmt->bind_param("iss", $mechanic_id, $status, $status);
    
    if ($upsert_stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Mechanic status updated successfully.',
            'data' => [
                'mechanic_id' => $mechanic_id,
                'status' => $status
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update mechanic status: ' . $upsert_stmt->error
        ]);
    }
    
    $upsert_stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only PUT method is accepted.']);
}

$conn->close();
?> 