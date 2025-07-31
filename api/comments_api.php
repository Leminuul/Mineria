<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once 'database.php';
include_once 'comment.php';

$database = new Database();
$db = $database->connect();

$comment = new Comment($db);

// Obtener comentarios
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $comment->read();
    $num = $stmt->rowCount();

    if($num > 0) {
        $comments_arr = array();
        $comments_arr["data"] = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $comment_item = array(
                "id" => $id,
                "name" => $nombre_usuario,
                "comment" => $comentario,
                "date" => $fecha,
                "rating" => round($utilidad_promedio), // Redondeamos el promedio
                "ratingCount" => $total_calificaciones
            );

            array_push($comments_arr["data"], $comment_item);
        }

        http_response_code(200);
        echo json_encode($comments_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No se encontraron comentarios."));
    }
}

// Crear nuevo comentario
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_comment') {
    $data = json_decode(file_get_contents("php://input"));

    $comment->nombre_usuario = $_POST['name'];
    $comment->comentario = $_POST['comment'];

    if($comment->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Comentario creado."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo crear el comentario."));
    }
}

// Calificar comentario
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'rate_comment') {
    $data = json_decode(file_get_contents("php://input"));

    $comment->id = $_POST['commentId'];
    $puntuacion = $_POST['rating'];

    if($comment->rate($puntuacion)) {
        http_response_code(200);
        echo json_encode(array("message" => "Comentario calificado."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "No se pudo calificar el comentario."));
    }
}
?>