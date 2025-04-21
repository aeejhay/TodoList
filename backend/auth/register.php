<?php
header('Content-Type: application/json');
require_once '../../config/database.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = $data['password'];

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

// Hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Generate verification token
$verification_token = bin2hex(random_bytes(32));

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (name, email, password, verification_token) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $hashed_password, $verification_token);

if ($stmt->execute()) {
    // Send verification email (to be implemented)
    // For now, we'll just set verified to true
    $update_stmt = $conn->prepare("UPDATE users SET verified = TRUE WHERE email = ?");
    $update_stmt->bind_param("s", $email);
    $update_stmt->execute();
    
    echo json_encode(['success' => true, 'message' => 'Registration successful']);
} else {
    echo json_encode(['success' => false, 'message' => 'Registration failed']);
}

$stmt->close();
$conn->close();
?> 