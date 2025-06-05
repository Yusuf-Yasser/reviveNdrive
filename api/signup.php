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

    // Insert user into database
    $stmt = $conn->prepare("INSERT INTO users (fullName, email, password, phone, avatar) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $fullName, $email, $hashedPassword, $phone, $defaultAvatar);

    if ($stmt->execute()) {
        $userId = $stmt->insert_id;
        // Start session and store user info
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_fullName'] = $fullName;

        http_response_code(201); // Created
        // Forcefully set CORS headers just before sending response
        header_remove('Access-Control-Allow-Credentials'); // Remove if it exists
        header('Access-Control-Allow-Origin: http://localhost:5173', true); // Overwrite
        header('Access-Control-Allow-Credentials: true', true); // Overwrite
        header('Content-Type: application/json', true); // Overwrite
        
        // Attempt to flush output buffer if active
        if (ob_get_level() > 0) {
            ob_end_flush();
        }
        
        echo json_encode([
            'status' => 'success',
            'message' => 'User registered successfully.',
            'user' => [
                'id' => $userId,
                'name' => $fullName, // Consistent with AuthContext
                'email' => $email,
                'phone' => $phone,
                'avatar' => $defaultAvatar
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Registration failed. Please try again later. Error: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();

} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Only POST method is accepted.']);
}
?>
