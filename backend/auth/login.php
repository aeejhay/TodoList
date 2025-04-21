<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/database.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

// Get user data
$stmt = $conn->prepare("SELECT id, name, password, verified FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

// Check if user is verified
if (!$user['verified']) {
    echo json_encode(['success' => false, 'message' => 'Please verify your email first']);
    exit;
}

// Set session variables
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_name'] = $user['name'];
$_SESSION['logged_in'] = true;

echo json_encode(['success' => true, 'message' => 'Login successful']);

$stmt->close();
$conn->close();
?> 