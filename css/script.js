// Datos iniciales de comentarios de ejemplo
let comments = [
    {
        id: 1,
        name: "María González",
        comment: "Excelente información sobre este grave problema que afecta a nuestro país. Es importante que más personas conozcan estas consecuencias.",
        date: "2025-01-20",
        rating: 5,
        ratingCount: 8,
    },
    {
        id: 2,
        name: "Carlos Mendoza",
        comment: "Me parece muy completa la investigación. Los datos sobre la contaminación del agua son alarmantes.",
        date: "2025-01-19",
        rating: 4,
        ratingCount: 3,
    },
    {
        id: 3,
        name: "Ana Vargas",
        comment: "Como bióloga, confirmo que los impactos ambientales mencionados son devastadores para nuestros ecosistemas.",
        date: "2025-01-18",
        rating: 5,
        ratingCount: 12,
    },
];

// Función para renderizar estrellas
// `rating`: la calificación actual (1-5)
// `interactive`: booleano para determinar si las estrellas son interactivas para calificar
// `onRate`: el ID del comentario para el que se está calificando, si es interactivo
function renderStars(rating, interactive = false, onRate = null) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += `<span
            key="${i}"
            class="text-2xl ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''} ${i < rating ? 'text-yellow-500' : 'text-gray-300'}"
            ${interactive ? `onclick="rateComment(${onRate}, ${i + 1})"` : ''}
        >★</span>`;
    }
    return stars;
}

// Función para renderizar todos los comentarios en el contenedor
function renderComments() {
    const container = document.getElementById('comments-container');
    // Limpiar el contenedor antes de renderizar nuevos comentarios
    container.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        // Clases de Tailwind para un estilo de tarjeta bonito
        commentElement.className = 'bg-white rounded-lg shadow-lg p-8 border border-gray-200';
        commentElement.innerHTML = `
            <div class="flex items-start justify-between mb-6">
                <div class="flex items-center space-x-4">
                    <div class="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                        ${comment.name.charAt(0).toUpperCase()} <!-- Inicial del nombre -->
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-800 text-lg">${comment.name}</h4>
                        <p class="text-sm text-gray-500">${comment.date}</p>
                    </div>
                </div>
                <div class="text-right flex flex-col items-end">
                    <div class="flex items-center space-x-1 mb-1">
                        ${renderStars(comment.rating)} <!-- Estrellas de calificación actuales -->
                    </div>
                    <p class="text-xs text-gray-500">
                        (${comment.ratingCount} calificaciones)
                    </p>
                </div>
            </div>
            <p class="text-gray-700 leading-relaxed mb-6">
                ${comment.comment}
            </p>
            <div class="border-t border-gray-200 pt-6">
                <p class="text-sm text-gray-600 mb-3">
                    ¿Te pareció útil este comentario? Califícalo:
                </p>
                <div class="flex items-center space-x-1">
                    ${renderStars(0, true, comment.id)} <!-- Estrellas interactivas para calificar -->
                    <span class="ml-2 text-sm text-gray-500">
                        Haz clic en las estrellas
                    </span>
                </div>
            </div>
        `;
        container.appendChild(commentElement);
    });
}

// Función para calificar un comentario
// `commentId`: el ID del comentario a calificar
// `rating`: la calificación dada (1-5)
function rateComment(commentId, rating) {
    comments = comments.map(comment => {
        if (comment.id === commentId) {
            // Calcular nueva calificación promedio
            const totalRating = comment.rating * comment.ratingCount + rating;
            const newRatingCount = comment.ratingCount + 1;
            const newAverage = Math.round(totalRating / newRatingCount); // Redondear al entero más cercano

            return {
                ...comment,
                rating: newAverage,
                ratingCount: newRatingCount,
            };
        }
        return comment;
    });

    renderComments(); // Volver a renderizar los comentarios para mostrar la calificación actualizada
}

// Función para manejar el envío de un nuevo comentario
function handleSubmitComment(e) {
    e.preventDefault(); // Prevenir el envío de formulario por defecto

    const nameInput = document.getElementById('comment-name');
    const commentInput = document.getElementById('comment-text');

    const name = nameInput.value.trim();
    const commentText = commentInput.value.trim();

    // Validar que los campos no estén vacíos
    if (name && commentText) {
        const newComment = {
            id: comments.length + 1, // ID simple basado en la longitud actual de los comentarios
            name: name,
            comment: commentText,
            date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
            rating: 0, // Nueva calificación inicial
            ratingCount: 0, // Contador de calificaciones inicial
        };

        // Agregar el nuevo comentario al principio de la lista
        comments = [newComment, ...comments];
        renderComments(); // Volver a renderizar los comentarios

        // Limpiar el formulario
        nameInput.value = '';
        commentInput.value = '';

        // Desplazarse a la sección de comentarios para ver el nuevo comentario
        scrollToSection('comentarios');
    }
}

// Función para desplazarse a una sección específica de la página
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth', // Desplazamiento suave
            block: 'start',     // Alinear el elemento al inicio de la ventana
        });
    }
}

// Función para alternar la visibilidad del menú móvil
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden'); // Alternar la clase 'hidden'
}

// Función para desplazarse a una sección y luego ocultar el menú móvil
function scrollAndHideMenu(sectionId) {
    scrollToSection(sectionId);
    document.getElementById('mobile-menu').classList.add('hidden'); // Ocultar el menú
}

// Inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar los comentarios iniciales al cargar la página
    renderComments();

    // Configurar el evento de envío del formulario de comentarios
    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', handleSubmitComment);

    // Hacer que las funciones sean globales para que puedan ser llamadas desde los atributos onclick en el HTML
    window.rateComment = rateComment;
    window.scrollToSection = scrollToSection;
    window.toggleMobileMenu = toggleMobileMenu;
    window.scrollAndHideMenu = scrollAndHideMenu;
});
