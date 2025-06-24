// Inicializa EmailJS con tu User ID
(function () {
    emailjs.init("Je1mrEJl3tHDwhI1Q"); // Reemplaza con tu User ID
})();

// Función para enviar el correo
function sendEmail(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Cambia el texto del botón mientras se envía el correo
    const btn = document.querySelector('input[type="submit"]');
    btn.value = 'Enviando...';

    // Define los IDs del servicio y las plantillas
    const serviceID = 'service_u9y2ufi'; // Reemplaza con tu Service ID
    const templateID = 'template_en6uinp'; // Plantilla para tu correo
    const autoReplyTemplateID = 'template_963iv6m'; // Plantilla para la respuesta automática (reemplaza con el ID correcto)

    // Obtén los datos del formulario
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    // Envía el correo a tu bandeja de entrada
    emailjs.sendForm(serviceID, templateID, event.target)
        .then(() => {
            // Envía la respuesta automática al usuario
            return emailjs.send(serviceID, autoReplyTemplateID, {
                name: data.name,
                email: data.email
            });
        })
        .then(() => {
            btn.value = 'Enviar Mensaje'; // Restaura el texto del botón
            alert('Mensaje enviado con éxito. ¡Gracias por contactarnos!');
            event.target.reset(); // Limpia el formulario
        }, (error) => {
            btn.value = 'Enviar Mensaje'; // Restaura el texto del botón
            alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
            console.error(error);
        });
}