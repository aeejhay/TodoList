<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_name']) || !isset($_SESSION['logged_in'])) {
    echo json_encode(['logged_in' => false]);
    exit;
}

echo json_encode([
    'logged_in' => true,
    'user_id' => $_SESSION['user_id'],
    'user_name' => $_SESSION['user_name']
]);
?> 