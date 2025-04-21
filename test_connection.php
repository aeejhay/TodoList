<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config/database.php';

echo "Testing database connection...<br>";

if ($conn) {
    echo "Successfully connected to the database!<br>";
    echo "Server: " . DB_SERVER . "<br>";
    echo "Database: " . DB_NAME . "<br>";
    echo "Username: " . DB_USERNAME . "<br>";
    
    // Test query to show tables
    $result = $conn->query("SHOW TABLES");
    if ($result) {
        echo "<br>Tables in the database:<br>";
        while ($row = $result->fetch_array()) {
            echo "- " . $row[0] . "<br>";
        }
    } else {
        echo "Error executing query: " . $conn->error;
    }
} else {
    echo "Connection failed. Please check your database configuration.";
}

$conn->close();
?> 