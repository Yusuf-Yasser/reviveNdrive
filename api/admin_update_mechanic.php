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
    $specialty = $data['specialty'] ?? null;
    $location = $data['location'] ?? null;
    
    // Update user info if provided
    $fullName = $data['fullName'] ?? null;
    $email = $data['email'] ?? null;
    $phone = $data['phone'] ?? null;
    
    if (empty($mechanic_id)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Mechanic ID is required.'
        ]);
        exit();
    }

    // Start transaction
    $conn->begin_transaction();

    try {
        // First, get the user_id associated with this mechanic
        $user_id_query = $conn->prepare("SELECT user_id FROM mechanics WHERE id = ?");
        $user_id_query->bind_param("i", $mechanic_id);
        $user_id_query->execute();
        $user_id_result = $user_id_query->get_result();
        
        if ($user_id_result->num_rows === 0) {
            throw new Exception('Mechanic not found.');
        }
        
        $user_id = $user_id_result->fetch_assoc()['user_id'];
        $user_id_query->close();
        
        // Update mechanic table
        $mechanic_updates = [];
        $mechanic_params = [];
        $mechanic_types = "";
        
        if (isset($specialty)) {
            $mechanic_updates[] = "specialty = ?";
            $mechanic_params[] = $specialty;
            $mechanic_types .= "s";
        }
        
        if (isset($location)) {
            $mechanic_updates[] = "location = ?";
            $mechanic_params[] = $location;
            $mechanic_types .= "s";
        }
        
        if (!empty($mechanic_updates)) {
            $mechanic_query = "UPDATE mechanics SET " . implode(", ", $mechanic_updates) . " WHERE id = ?";
            $mechanic_params[] = $mechanic_id;
            $mechanic_types .= "i";
            
            $mechanic_stmt = $conn->prepare($mechanic_query);
            $mechanic_stmt->bind_param($mechanic_types, ...$mechanic_params);
            $mechanic_stmt->execute();
            $mechanic_stmt->close();
        }
        
        // Update user table if user info is provided
        $user_updates = [];
        $user_params = [];
        $user_types = "";
        
        if (!empty($fullName)) {
            $user_updates[] = "fullName = ?";
            $user_params[] = $fullName;
            $user_types .= "s";
        }
        
        if (!empty($email)) {
            // Check if email already exists for a different user
            $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $check_stmt->bind_param("si", $email, $user_id);
            $check_stmt->execute();
            $check_result = $check_stmt->get_result();

            if ($check_result->num_rows > 0) {
                $check_stmt->close();
                throw new Exception('Email already in use by another account.');
            }
            $check_stmt->close();

            $user_updates[] = "email = ?";
            $user_params[] = $email;
            $user_types .= "s";
        }

        if (isset($phone)) {
            $user_updates[] = "phone = ?";
            $user_params[] = $phone;
            $user_types .= "s";
        }
        
        if (!empty($user_updates)) {
            $user_query = "UPDATE users SET " . implode(", ", $user_updates) . " WHERE id = ?";
            $user_params[] = $user_id;
            $user_types .= "i";
            
            $user_stmt = $conn->prepare($user_query);
            $user_stmt->bind_param($user_types, ...$user_params);
            $user_stmt->execute();
            $user_stmt->close();
        }
        
        // Get updated mechanic data
        $select_query = "SELECT m.id, m.specialty, m.location, u.fullName, u.email, u.phone 
                         FROM mechanics m 
                         JOIN users u ON m.user_id = u.id 
                         WHERE m.id = ?";
        $select_stmt = $conn->prepare($select_query);
        $select_stmt->bind_param("i", $mechanic_id);
        $select_stmt->execute();
        $result = $select_stmt->get_result();
        $mechanic_data = $result->fetch_assoc();
        $select_stmt->close();
        
        // Commit transaction
        $conn->commit();
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Mechanic updated successfully.',
            'mechanic' => $mechanic_data
        ]);
        
    } catch (Exception $e) {
        // Roll back transaction on error
        $conn->rollback();
        
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only PUT method is accepted.']);
}

$conn->close();
?> 