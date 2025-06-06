<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['userId'], $data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields (userId, password).']);
    exit;
}

$userId = $data['userId'];
$password = $data['password'];

if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] != $userId) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized.']);
    exit;
}

if (empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'Password is required for account deletion.']);
    exit;
}

$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database error (prepare select): ' . $conn->error]);
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

if (!password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Incorrect password. Account deletion failed.']);
    exit;
}

// Before deleting, consider if there are related records in other tables (e.g., profiles, appointments)
// that need to be handled (e.g., cascade delete in DB, or manual deletion here).
// For simplicity, this example only deletes from the 'users' table.

$deleteStmt = $conn->prepare("DELETE FROM users WHERE id = ?");
if (!$deleteStmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database error (prepare delete): ' . $conn->error]);
    exit;
}
$deleteStmt->bind_param("i", $userId);

if ($deleteStmt->execute()) {
    // Destroy the session as the user is now deleted
    session_unset(); // Remove all session variables
    session_destroy(); // Destroy the session itself
    echo json_encode(['status' => 'success', 'message' => 'Account deleted successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to delete account: ' . $deleteStmt->error]);
}

$deleteStmt->close();
$conn->close();
?>
