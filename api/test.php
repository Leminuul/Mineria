<?php
// Incluye tu archivo Database.php
require_once 'database.php';

// Crea una instancia de Database
$database = new Database();

// Intenta conectar
$db = $database->connect();

// Verifica si la conexión se estableció correctamente
if($db) {
    echo "<h1 style='color: green;'>¡Conexión exitosa!</h1>";
    echo "<p>Base de datos: if0_39547760_mineria</p>";
    
    // Opcional: puedes listar algunas tablas para verificar
    try {
        $query = "SHOW TABLES";
        $stmt = $db->query($query);
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo "<h3>Tablas en la base de datos:</h3>";
        echo "<ul>";
        foreach($tables as $table) {
            echo "<li>$table</li>";
        }
        echo "</ul>";
    } catch(PDOException $e) {
        echo "<p style='color: orange;'>No se pudieron listar las tablas: " . $e->getMessage() . "</p>";
    }
} else {
    echo "<h1 style='color: red;'>Error en la conexión</h1>";
}
?>