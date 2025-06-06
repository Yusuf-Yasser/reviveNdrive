<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['userId'], $data['currentPassword'], $data['newPassword'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields.']);
    exit;
}

$userId = $data['userId'];
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] != $userId) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized.']);
    exit;
}

if (empty($currentPassword) || empty($newPassword)) {
    echo json_encode(['status' => 'error', 'message' => 'Passwords cannot be empty.']);
    exit;
}

// Consider adding password strength validation for $newPassword here

$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
    exit;
}
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'User not found.']);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
$stmt->close();

if (!password_verify($currentPassword, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Incorrect current password.']);
    exit;
}

$hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

$updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
if (!$updateStmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
    exit;
}
$updateStmt->bind_param("si", $hashedNewPassword, $userId);

if ($updateStmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Password changed successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update password: ' . $updateStmt->error]);
}

$updateStmt->close();
$conn->close();
?>
