<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

if (!isset($_GET['category_id'])) {
    echo json_encode(['success' => false, 'message' => 'Category ID is required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$category_id = $_GET['category_id'];

// Verify that the category belongs to the user
$stmt = $conn->prepare("SELECT id FROM categories WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $category_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Category not found']);
    exit;
}

// Get tasks for the category
$stmt = $conn->prepare("SELECT id, task_name, description, due_date, is_done FROM tasks WHERE category_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $category_id);
$stmt->execute();
$result = $stmt->get_result();

$tasks = [];
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode(['success' => true, 'tasks' => $tasks]);

$stmt->close();
$conn->close();
?> 