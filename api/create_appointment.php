<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
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
    $requiredFields = [
        'serviceType', 'appointmentDate', 'appointmentTime', 
        'carMake', 'carModel', 'carYear', 'customerName', 
        'customerPhone', 'customerEmail', 'customerAddress', 
        'servicePrice', 'totalAmount'
    ];

    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => "Field '$field' is required."]);
            exit();
        }
    }

    // Extract data
    $serviceType = $data['serviceType'];
    $serviceDescription = $data['serviceDescription'] ?? '';
    $appointmentDate = $data['appointmentDate'];
    $appointmentTime = $data['appointmentTime'];
    $carMake = $data['carMake'];
    $carModel = $data['carModel'];
    $carYear = intval($data['carYear']);
    $customerName = $data['customerName'];
    $customerPhone = $data['customerPhone'];
    $customerEmail = $data['customerEmail'];
    $customerAddress = $data['customerAddress'];
    $servicePrice = floatval($data['servicePrice']);
    $serviceFee = floatval($data['serviceFee'] ?? 5.99);
    $totalAmount = floatval($data['totalAmount']);
    $notes = $data['notes'] ?? '';
    $mechanicId = isset($data['mechanicId']) ? intval($data['mechanicId']) : null;
    $paymentStatus = $data['paymentStatus'] ?? 'pending';

    try {
        // Validate appointment date (should be in the future)
        $appointmentDateTime = new DateTime($appointmentDate . ' ' . $appointmentTime);
        $now = new DateTime();
        
        if ($appointmentDateTime <= $now) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Appointment date and time must be in the future.']);
            exit();
        }

        // Check if there's already an appointment at the same time (optional business logic)
        $checkStmt = $conn->prepare("SELECT id FROM appointments WHERE appointment_date = ? AND appointment_time = ? AND status NOT IN ('cancelled', 'completed')");
        $checkStmt->bind_param("ss", $appointmentDate, $appointmentTime);
        $checkStmt->execute();
        $existingResult = $checkStmt->get_result();
        
        if ($existingResult->num_rows > 0) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'This time slot is already booked. Please choose a different time.']);
            $checkStmt->close();
            exit();
        }
        $checkStmt->close();

        // Insert appointment
        $stmt = $conn->prepare("
            INSERT INTO appointments (
                user_id, mechanic_id, service_type, service_description, 
                appointment_date, appointment_time, car_make, car_model, car_year,
                customer_name, customer_phone, customer_email, customer_address,
                service_price, service_fee, total_amount, notes, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "iissssssississsdds",
            $userId, $mechanicId, $serviceType, $serviceDescription,
            $appointmentDate, $appointmentTime, $carMake, $carModel, $carYear,
            $customerName, $customerPhone, $customerEmail, $customerAddress,
            $servicePrice, $serviceFee, $totalAmount, $notes, $paymentStatus
        );

        if ($stmt->execute()) {
            $appointmentId = $conn->insert_id;
            
            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'Appointment created successfully.',
                'appointment_id' => $appointmentId
            ]);
        } else {
            throw new Exception('Failed to create appointment: ' . $stmt->error);
        }

        $stmt->close();

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is allowed.']);
}

$conn->close();
?>
