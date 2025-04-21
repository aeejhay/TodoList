<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['category_id']) || !isset($data['task_name']) || empty(trim($data['task_name']))) {
    echo json_encode(['success' => false, 'message' => 'Task name and category are required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$category_id = $data['category_id'];
$task_name = trim($data['task_name']);
$description = isset($data['description']) ? trim($data['description']) : null;
$due_date = isset($data['due_date']) && !empty($data['due_date']) ? $data['due_date'] : null;

// Verify that the category belongs to the user
$stmt = $conn->prepare("SELECT id FROM categories WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $category_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Category not found']);
    exit;
}

// Add the task
$stmt = $conn->prepare("INSERT INTO tasks (category_id, task_name, description, due_date) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $category_id, $task_name, $description, $due_date);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Task added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add task']);
}

$stmt->close();
$conn->close();
?> 