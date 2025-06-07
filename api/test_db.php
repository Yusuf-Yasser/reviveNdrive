<?php
echo "<pre>";
echo "Attempting to include config.php...\n";
require_once 'config.php'; // This line will attempt the db connection
echo "config.php included.\n\n";

if (isset($conn)) {
    echo "Database connection object (\$conn) exists.\n";
    if ($conn->connect_error) {
        echo "Connection Error: " . $conn->connect_error . "\n";
    } else {
        echo "Successfully connected to database!\n";
        echo "Host info: " . $conn->host_info . "\n";
    }
    // Attempt a simple query
    $result = $conn->query("SELECT DATABASE()");
    if ($result) {
        $dbName = $result->fetch_row()[0];
        echo "Current database: " . $dbName . "\n";
        $result->free();
    } else {
        echo "Failed to execute simple query: " . $conn->error . "\n";
    }
    $conn->close();
    echo "Database connection closed.\n";
} else {
    echo "Database connection object (\$conn) does NOT exist after config.php included.\n";
    echo "This means config.php might have exited or failed before \$conn was fully established, or \$conn is not in global scope here.\n";
}
echo "</pre>";
?>