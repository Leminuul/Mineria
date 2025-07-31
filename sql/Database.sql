CREATE DATABASE IF NOT EXISTS if0_39547760_mineria;
USE if0_39547760_mineria;

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    comentario TEXT NOT NULL,
    calificacion TINYINT UNSIGNED,
    total_calificaciones INT UNSIGNED DEFAULT 0,
    utilidad_promedio DECIMAL(3,2) DEFAULT 0.0
);

CREATE TABLE utilidad_comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_comentario INT NOT NULL,
    puntuacion_utilidad TINYINT UNSIGNED,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_comentario) REFERENCES comentarios(id) ON DELETE CASCADE
);