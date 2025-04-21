<?php
session_start();
header('Content-Type: application/json');
require_once '../../config/database.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['task_id'])) {
    echo json_encode(['success' => false, 'message' => 'Task ID is required']);
    exit;
}

$user_id = $_SESSION['user_id'];
$task_id = $data['task_id'];

// Verify that the task belongs to the user
$stmt = $conn->prepare("
    SELECT t.id 
    FROM tasks t 
    JOIN categories c ON t.category_id = c.id 
    WHERE t.id = ? AND c.user_id = ?
");
$stmt->bind_param("ii", $task_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Task not found']);
    exit;
}

// Delete the task
$stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
$stmt->bind_param("i", $task_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete task']);
}

$stmt->close();
$conn->close();
?> 