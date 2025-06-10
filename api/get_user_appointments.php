<?php
require_once 'config.php';
require_once 'check_auth.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Check if user is authenticated
    $auth_result = check_auth();    if (!$auth_result['is_authenticated']) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'You must be logged in to view appointments.'
        ]);
        exit();
    }

    $userId = $auth_result['user_id'];

    // Optional status filter
    $statusFilter = "";
    $statusParam = "";
    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $statusFilter = " AND a.status = ?";
        $statusParam = $_GET['status'];
    }

    try {
        // Get user appointments with mechanic details
        $query = "
            SELECT 
                a.id,
                a.service_type,
                a.service_description,
                a.appointment_date,
                a.appointment_time,
                a.car_make,
                a.car_model,
                a.car_year,
                a.customer_name,
                a.customer_phone,
                a.customer_email,
                a.customer_address,
                a.service_price,
                a.service_fee,
                a.total_amount,
                a.status,
                a.payment_status,
                a.notes,
                a.created_at,
                a.updated_at,
                m.id as mechanic_id,
                u.fullName as mechanic_name,
                u.phone as mechanic_phone,
                u.email as mechanic_email,
                m.specialty as mechanic_specialty,
                m.location as mechanic_location
            FROM 
                appointments a
            LEFT JOIN 
                mechanics m ON a.mechanic_id = m.id
            LEFT JOIN 
                users u ON m.user_id = u.id
            WHERE 
                a.user_id = ? 
                $statusFilter
            ORDER BY 
                a.appointment_date DESC, a.appointment_time DESC
        ";

        if (!empty($statusFilter)) {
            $stmt = $conn->prepare($query);
            $stmt->bind_param("is", $userId, $statusParam);
        } else {
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $userId);
        }

        $stmt->execute();
        $result = $stmt->get_result();        $appointments = [];
        while ($row = $result->fetch_assoc()) {
            // Combine date and time for scheduled_date
            $scheduledDateTime = $row['appointment_date'] . ' ' . $row['appointment_time'];
            
            $appointments[] = [
                'id' => $row['id'],
                'service_type' => $row['service_type'],
                'description' => $row['service_description'],
                'scheduled_date' => $scheduledDateTime,
                'car_make' => $row['car_make'],
                'car_model' => $row['car_model'],
                'car_year' => $row['car_year'],
                'customer_name' => $row['customer_name'],
                'customer_phone' => $row['customer_phone'],
                'customer_email' => $row['customer_email'],
                'customer_address' => $row['customer_address'],
                'estimated_price' => (float)$row['total_amount'],
                'status' => $row['status'],
                'payment_status' => $row['payment_status'],
                'notes' => $row['notes'],
                'mechanic_name' => $row['mechanic_name'],
                'mechanic_phone' => $row['mechanic_phone'],
                'mechanic_email' => $row['mechanic_email'],
                'mechanic_specialty' => $row['mechanic_specialty'],
                'mechanic_location' => $row['mechanic_location'],
                'created_at' => $row['created_at'],
                'updated_at' => $row['updated_at']
            ];
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'appointments' => $appointments,
            'count' => count($appointments)
        ]);

        $stmt->close();    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only GET method is allowed.']);
}

$conn->close();
?>
