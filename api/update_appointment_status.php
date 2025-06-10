<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated.']);
        exit();
    }

    $userId = $_SESSION['user_id'];

    // Get the JSON data from request body
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (!isset($data['appointmentId']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Appointment ID and status are required.']);
        exit();
    }

    $appointmentId = intval($data['appointmentId']);
    $newStatus = $data['status'];
    $paymentStatus = $data['paymentStatus'] ?? null;

    // Validate status values
    $validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
    if (!in_array($newStatus, $validStatuses)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid status value.']);
        exit();
    }

    $validPaymentStatuses = ['pending', 'paid', 'refunded'];
    if ($paymentStatus && !in_array($paymentStatus, $validPaymentStatuses)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid payment status value.']);
        exit();
    }

    try {
        // Check if appointment exists and user owns it
        $checkStmt = $conn->prepare("SELECT user_id, status FROM appointments WHERE id = ?");
        $checkStmt->bind_param("i", $appointmentId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Appointment not found.']);
            $checkStmt->close();
            exit();
        }

        $appointment = $result->fetch_assoc();
        
        // Only appointment owner can update (or add admin check here if needed)
        if ($appointment['user_id'] != $userId) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'You can only update your own appointments.']);
            $checkStmt->close();
            exit();
        }

        $checkStmt->close();

        // Build update query dynamically
        $updateFields = [];
        $updateValues = [];
        $updateTypes = "";

        $updateFields[] = "status = ?";
        $updateValues[] = $newStatus;
        $updateTypes .= "s";

        if ($paymentStatus) {
            $updateFields[] = "payment_status = ?";
            $updateValues[] = $paymentStatus;
            $updateTypes .= "s";
        }

        $updateFields[] = "updated_at = CURRENT_TIMESTAMP";

        // Add appointment ID for WHERE clause
        $updateValues[] = $appointmentId;
        $updateTypes .= "i";

        $updateQuery = "UPDATE appointments SET " . implode(", ", $updateFields) . " WHERE id = ?";
        
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param($updateTypes, ...$updateValues);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Appointment updated successfully.'
            ]);
        } else {
            throw new Exception('Failed to update appointment: ' . $stmt->error);
        }

        $stmt->close();

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Only PUT method is allowed.']);
}

$conn->close();
?>
