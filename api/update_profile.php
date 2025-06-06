<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Unauthorized
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated.']);
        exit();
    }

    $userId = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);

    // Fields that can be updated
    $fullName = $data['fullName'] ?? null;
    $phone = $data['phone'] ?? null;
    $avatar = $data['avatar'] ?? null; // Assuming avatar is a URL string
    // Mechanic specific fields
    $specialty = $data['specialty'] ?? null;
    $location = $data['location'] ?? null;

    // Basic validation: At least one field must be provided for update
    if (empty($fullName) && empty($phone) && empty($avatar) && empty($specialty) && empty($location)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No data provided for update.']);
        exit();
    }

    $conn->begin_transaction();

    try {
        // Fetch user_type to determine if mechanic details need update
        $stmtGetType = $conn->prepare("SELECT user_type FROM users WHERE id = ?");
        if (!$stmtGetType) throw new Exception('Failed to prepare statement to get user type: ' . $conn->error);
        $stmtGetType->bind_param("i", $userId);
        $stmtGetType->execute();
        $resultType = $stmtGetType->get_result();
        $user = $resultType->fetch_assoc();
        $stmtGetType->close();

        if (!$user) {
            throw new Exception('User not found.');
        }
        $userType = $user['user_type'];

        // Update users table
        $updateUserFields = [];
        $updateUserParams = [];
        $updateUserTypes = "";

        if (!empty($fullName)) { $updateUserFields[] = "fullName = ?"; $updateUserParams[] = $fullName; $updateUserTypes .= "s"; }
        if (!empty($phone)) { $updateUserFields[] = "phone = ?"; $updateUserParams[] = $phone; $updateUserTypes .= "s"; }
        if (!empty($avatar)) { $updateUserFields[] = "avatar = ?"; $updateUserParams[] = $avatar; $updateUserTypes .= "s"; }

        if (count($updateUserFields) > 0) {
            $updateUserTypes .= "i"; // For user ID
            $updateUserParams[] = $userId;
            $sqlUser = "UPDATE users SET " . implode(", ", $updateUserFields) . " WHERE id = ?";
            $stmtUser = $conn->prepare($sqlUser);
            if (!$stmtUser) throw new Exception('Failed to prepare user update statement: ' . $conn->error);
            $stmtUser->bind_param($updateUserTypes, ...$updateUserParams);
            if (!$stmtUser->execute()) throw new Exception('Error updating user details: ' . $stmtUser->error);
            $stmtUser->close();
        }

        // Update mechanics table if user is a mechanic and relevant fields are provided
        if ($userType === 'mechanic') {
            $updateMechanicFields = [];
            $updateMechanicParams = [];
            $updateMechanicTypes = "";

            if (!empty($specialty)) { $updateMechanicFields[] = "specialty = ?"; $updateMechanicParams[] = $specialty; $updateMechanicTypes .= "s"; }
            if (!empty($location)) { $updateMechanicFields[] = "location = ?"; $updateMechanicParams[] = $location; $updateMechanicTypes .= "s"; }

            if (count($updateMechanicFields) > 0) {
                $updateMechanicTypes .= "i"; // For user ID
                $updateMechanicParams[] = $userId;
                $sqlMechanic = "UPDATE mechanics SET " . implode(", ", $updateMechanicFields) . " WHERE user_id = ?";
                $stmtMechanic = $conn->prepare($sqlMechanic);
                if (!$stmtMechanic) throw new Exception('Failed to prepare mechanic update statement: ' . $conn->error);
                $stmtMechanic->bind_param($updateMechanicTypes, ...$updateMechanicParams);
                if (!$stmtMechanic->execute()) {
                    // Check if mechanic entry exists, if not, could be an INSERT case (or error if update expected)
                    // For simplicity, we assume an entry exists if they are 'mechanic' type.
                    // More robust: check affected_rows or if an entry exists before attempting update.
                    throw new Exception('Error updating mechanic details: ' . $stmtMechanic->error);
                }
                $stmtMechanic->close();
            }
        }

        $conn->commit();
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully.']);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Profile update failed: ' . $e->getMessage()]);
    }

    $conn->close();

} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?>
