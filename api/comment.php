<?php
class Comment {
    private $conn;
    private $table = 'comentarios';

    public $id;
    public $nombre_usuario;
    public $fecha;
    public $comentario;
    public $calificacion;
    public $total_calificaciones;
    public $utilidad_promedio;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Crear un nuevo comentario
    public function create() {
        $query = 'INSERT INTO ' . $this->table . ' 
                  SET 
                    nombre_usuario = :nombre_usuario,
                    comentario = :comentario,
                    calificacion = 0,
                    total_calificaciones = 0,
                    utilidad_promedio = 0.0';

        $stmt = $this->conn->prepare($query);

        // Limpiar datos
        $this->nombre_usuario = htmlspecialchars(strip_tags($this->nombre_usuario));
        $this->comentario = htmlspecialchars(strip_tags($this->comentario));

        // Vincular parámetros
        $stmt->bindParam(':nombre_usuario', $this->nombre_usuario);
        $stmt->bindParam(':comentario', $this->comentario);

        if($stmt->execute()) {
            return true;
        }

        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // Obtener todos los comentarios
    public function read() {
        $query = 'SELECT * FROM ' . $this->table . ' ORDER BY fecha DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Calificar un comentario
    public function rate($puntuacion) {
        // Primero insertamos la calificación en la tabla utilidad_comentario
        $query = 'INSERT INTO utilidad_comentario 
                  SET id_comentario = :id_comentario, 
                      puntuacion_utilidad = :puntuacion';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_comentario', $this->id);
        $stmt->bindParam(':puntuacion', $puntuacion);
        $stmt->execute();

        // Luego actualizamos las estadísticas en la tabla comentarios
        $query = 'UPDATE ' . $this->table . ' 
                  SET 
                    total_calificaciones = total_calificaciones + 1,
                    utilidad_promedio = (
                        SELECT AVG(puntuacion_utilidad) 
                        FROM utilidad_comentario 
                        WHERE id_comentario = :id_comentario
                    )
                  WHERE id = :id_comentario';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_comentario', $this->id);
        
        if($stmt->execute()) {
            return true;
        }

        return false;
    }
}
?>