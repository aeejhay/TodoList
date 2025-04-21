<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['category_name']) || empty(trim($data['category_name']))) {
    echo json_encode(['success' => false, 'message' => 'Category name is required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$category_name = trim($data['category_name']);

$stmt = $conn->prepare("INSERT INTO categories (user_id, category_name) VALUES (?, ?)");
$stmt->bind_param("is", $user_id, $category_name);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Category added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add category']);
}

$stmt->close();
$conn->close();
?> 