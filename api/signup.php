<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173'); // Specific origin for credentials
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle OPTIONS request (pre-flight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: POST, OPTIONS'); // Signup uses POST
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); 
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $fullName = $data['fullName'] ?? null;
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;
    $phone = $data['phone'] ?? null;
    $userType = $data['userType'] ?? 'normal_user'; // Default from frontend if not set
    $specialty = $data['specialty'] ?? null;
    $location = $data['location'] ?? null;

    // Basic validation
    if (empty($fullName) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Full name, email, and password are required.']);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
        exit();
    }

    // User Type validation
    if (!in_array($userType, ['normal_user', 'mechanic'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid user type specified.']);
        exit();
    }

    // Conditional validation for mechanic fields (backend check)
    if ($userType === 'mechanic') {
        if (empty($specialty)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Specialty is required for mechanic accounts.']);
            exit();
        }
        if (empty($location)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Location is required for mechanic accounts.']);
            exit();
        }
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['status' => 'error', 'message' => 'Email already registered.']);
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close();

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Default avatar (optional)
    $defaultAvatar = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

    // Start transaction
    $conn->begin_transaction();

    try {
        // Insert user into users table
        $stmtUser = $conn->prepare("INSERT INTO users (fullName, email, password, phone, avatar, user_type) VALUES (?, ?, ?, ?, ?, ?)");
        $stmtUser->bind_param("ssssss", $fullName, $email, $hashedPassword, $phone, $defaultAvatar, $userType);

        if (!$stmtUser->execute()) {
            throw new Exception("Error inserting user data: " . $stmtUser->error);
        }
        $userId = $stmtUser->insert_id;
        $stmtUser->close();

        // If user is a mechanic, insert into mechanics table
        if ($userType === 'mechanic') {
            $stmtMechanic = $conn->prepare("INSERT INTO mechanics (user_id, specialty, location) VALUES (?, ?, ?)");
            $stmtMechanic->bind_param("iss", $userId, $specialty, $location);
            if (!$stmtMechanic->execute()) {
                throw new Exception("Error inserting mechanic details: " . $stmtMechanic->error);
            }
            $stmtMechanic->close();
        }

        // Commit transaction
        $conn->commit();

        // Session handling is commented out as per no-auto-login requirement (Memory d1e170a6...)
        /*
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_fullName'] = $fullName;
        */

        http_response_code(201); // Created
        header_remove('Access-Control-Allow-Credentials');
        header('Access-Control-Allow-Origin: http://localhost:5173', true);
        header('Access-Control-Allow-Credentials: true', true);
        header('Content-Type: application/json', true);
        if (ob_get_level() > 0) {
            ob_end_flush();
        }
        
        $userDataResponse = [
            'id' => $userId,
            'fullName' => $fullName, // Changed from 'name' for consistency
            'email' => $email,
            'phone' => $phone,
            'avatar' => $defaultAvatar,
            'userType' => $userType
        ];
        if ($userType === 'mechanic') {
            $userDataResponse['specialty'] = $specialty;
            $userDataResponse['location'] = $location;
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'User registered successfully.',
            'user' => $userDataResponse
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        // Ensure statements are closed on error if they were prepared before exception
        if (isset($stmtUser) && $stmtUser instanceof mysqli_stmt) $stmtUser->close();
        if (isset($stmtMechanic) && $stmtMechanic instanceof mysqli_stmt) $stmtMechanic->close();
        
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $e->getMessage()]);
    }
    // Note: $conn->close() is handled at the end of the POST block in the original structure
    $conn->close();

} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?>
