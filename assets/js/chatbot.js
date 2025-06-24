// ==================== CHATBOT CODECLOUD MEJORADO ====================

// Variables globales
let conversationHistory = [];
let isTyping = false;
let currentSession = Date.now();

// Mostrar u ocultar chatbot con animación
function toggleChatbot() {
  const chatbot = document.getElementById("chatbotWindow");
  const isVisible = chatbot.style.display === "flex";
  
  if (isVisible) {
    chatbot.style.animation = "slideDown 0.3s ease-out";
    setTimeout(() => {
      chatbot.style.display = "none";
    }, 300);
  } else {
    chatbot.style.display = "flex";
    chatbot.style.animation = "slideUp 0.3s ease-out";
    
    // Mensaje de bienvenida si es la primera vez
    if (conversationHistory.length === 0) {
      setTimeout(() => {
        appendMessage("bot", getWelcomeMessage());
        showQuickActions();
      }, 500);
    }
  }
}

// Mensaje de bienvenida personalizado
function getWelcomeMessage() {
  const hora = new Date().getHours();
  let saludo = "";
  
  if (hora < 12) saludo = "¡Buenos días!";
  else if (hora < 18) saludo = "¡Buenas tardes!";
  else saludo = "¡Buenas noches!";
  
  return `${saludo} 👋 Soy <strong>Alex</strong>, tu asistente virtual de <strong>CodeCloud</strong>.<br><br>
🚀 Estoy aquí para ayudarte con información sobre nuestros servicios de desarrollo de software.<br><br>
¿En qué puedo ayudarte hoy?`;
}

// Añadir mensaje a la ventana con mejoras
function appendMessage(sender, text, options = {}) {
  const container = document.getElementById("chatbotMessages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  
  // Timestamp
  const timestamp = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message-wrapper");
  
  const content = document.createElement("div");
  content.classList.add("message-content");
  content.innerHTML = text;
  
  const timeSpan = document.createElement("span");
  timeSpan.classList.add("message-time");
  timeSpan.textContent = timestamp;
  
  messageWrapper.appendChild(content);
  messageWrapper.appendChild(timeSpan);
  messageDiv.appendChild(messageWrapper);
  
  container.appendChild(messageDiv);
  
  // Guardar en historial
  conversationHistory.push({
    sender,
    text,
    timestamp: Date.now()
  });
  
  // Auto-scroll con animación suave
  smoothScrollToBottom();
  
  // Efecto de aparición
  setTimeout(() => {
    messageDiv.classList.add("message-appear");
  }, 100);
}

// Scroll suave al final
function smoothScrollToBottom() {
  const container = document.getElementById("chatbotMessages");
  container.scrollTo({
    top: container.scrollHeight,
    behavior: 'smooth'
  });
}

// Enviar mensaje mejorado
function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  
  if (!message || isTyping) return;
  
  // Validar longitud del mensaje
  if (message.length > 500) {
    appendMessage("bot", "⚠️ Por favor, escribe un mensaje más corto (máximo 500 caracteres).");
    return;
  }
  
  appendMessage("user", escapeHtml(message));
  input.value = "";
  hideQuickActions();
  
  // Simular tiempo de respuesta más realista
  const typingTime = Math.min(Math.max(message.length * 50, 1000), 3000);
  
  showTyping();
  
  setTimeout(() => {
    hideTyping();
    const response = generateResponse(message);
    appendMessage("bot", response);
    
    // Mostrar acciones rápidas después de ciertas respuestas
    if (shouldShowQuickActions(message)) {
      setTimeout(showQuickActions, 1000);
    }
  }, typingTime);
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Determinar si mostrar acciones rápidas
function shouldShowQuickActions(message) {
  const triggers = ['gracias', 'más información', 'ayuda', 'qué más'];
  return triggers.some(trigger => message.toLowerCase().includes(trigger));
}

// Manejar tecla Enter y otras teclas
function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  } else if (event.key === "Escape") {
    toggleChatbot();
  }
}

// Indicador de escritura mejorado
function showTyping() {
  isTyping = true;
  const indicator = document.getElementById("typingIndicator");
  indicator.style.display = "block";
  indicator.innerHTML = `
    <div class="typing-dots">
      <span></span><span></span><span></span>
    </div>
    <span class="typing-text">Alex está escribiendo...</span>
  `;
}

function hideTyping() {
  isTyping = false;
  document.getElementById("typingIndicator").style.display = "none";
}

// Mostrar/ocultar acciones rápidas
function showQuickActions() {
  const quickActions = document.getElementById("quickActions");
  if (quickActions) {
    quickActions.style.display = "flex";
    quickActions.style.animation = "fadeIn 0.5s ease-out";
  }
}

function hideQuickActions() {
  const quickActions = document.getElementById("quickActions");
  if (quickActions) {
    quickActions.style.display = "none";
  }
}

// Preguntas rápidas mejoradas
function askQuestion(tipo) {
  const preguntas = {
    servicios: "¿Qué servicios ofrecen?",
    contacto: "¿Cómo puedo contactarlos?",
    empresa: "¿Quiénes son ustedes?",
    proyectos: "¿Qué tipo de proyectos desarrollan?",
    precios: "¿Cuáles son sus precios?",
    tiempo: "¿Cuánto tiempo toman sus proyectos?",
    calidad: "¿Qué garantías de calidad ofrecen?",
    ubicacion: "¿Dónde están ubicados?"
  };
  
  const pregunta = preguntas[tipo];
  if (pregunta) {
    document.getElementById("chatInput").value = pregunta;
    sendMessage();
  }
}

// Generador de respuestas mejorado con más inteligencia
function generateResponse(message) {
  const lowerMessage = message.toLowerCase();
  const palabrasComunes = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las'];
  
  // Limpiar mensaje de palabras comunes para mejor matching
  const messageLimpio = lowerMessage.split(' ')
    .filter(palabra => !palabrasComunes.includes(palabra) && palabra.length > 2)
    .join(' ');

  // === 1. Saludos y bienvenida ===
  if (/(hola|buenas|qué tal|hey|saludos|buenos días|buenas tardes|buenas noches)/.test(lowerMessage)) {
    const respuestasSaludo = [
      `¡Hola! 👋 Bienvenido a <strong>CodeCloud</strong>. Soy <strong>Alex</strong>, tu asistente virtual especializado en desarrollo de software.`,
      `¡Qué tal! 😊 Gracias por contactar <strong>CodeCloud</strong>. Estoy aquí para resolver todas tus dudas sobre nuestros servicios.`,
      `¡Saludos! 🚀 Me da mucho gusto poder ayudarte. En <strong>CodeCloud</strong> creamos soluciones de software innovadoras.`
    ];
    const saludo = respuestasSaludo[Math.floor(Math.random() * respuestasSaludo.length)];
    
    return `${saludo}<br><br>
💡 <strong>¿Te interesa conocer sobre:</strong><br>
🔹 Nuestros servicios y soluciones<br>
🔹 Proyectos que hemos desarrollado<br>
🔹 Precios y cotizaciones<br>
🔹 Nuestra metodología de trabajo<br><br>
¡Pregúntame lo que necesites! 🤝`;
  }

  // === 2. Información general de la empresa ===
  if (/(quiénes son|qué es codecloud|empresa|sobre ustedes|nosotros|conocer empresa|información|presentación)/.test(lowerMessage)) {
    return `🏢 <strong>CodeCloud</strong> - Tu socio en transformación digital<br><br>
🌟 Somos una empresa boliviana especializada en desarrollo de software de alta calidad para empresas medianas que buscan innovar y crecer.<br><br>
🎯 <strong>Lo que nos diferencia:</strong><br>
✅ Metodología <strong>MIXED</strong> (Modern Innovation & eXperience-Driven Development)<br>
✅ Tecnologías modernas: Python, React, Node.js, Cloud Computing<br>
✅ Enfoque en UX/UI y experiencia del usuario<br>
✅ Estándares internacionales de calidad (IEEE 730)<br><br>
🚀 <strong>Nuestra filosofía:</strong> Crear soluciones que realmente resuelvan problemas y generen valor a tu negocio.`;
  }

  // === 3. Misión, visión y valores ===
  if (/(misión|vision|valores|propósito|objetivo|meta|filosofía|cultura)/.test(lowerMessage)) {
    return `🎯 <strong>Nuestra Misión</strong><br>
Diseñar, desarrollar e implementar soluciones de software innovadoras y de alta calidad que impulsen el crecimiento y la eficiencia de nuestros clientes.<br><br>
🚀 <strong>Nuestra Visión</strong><br>
Ser reconocidos como la empresa líder en desarrollo de software en Bolivia, estableciendo nuevos estándares de calidad, innovación y servicio al cliente.<br><br>
💎 <strong>Nuestros Valores</strong><br>
🔹 <strong>Calidad:</strong> Excelencia en cada línea de código<br>
🔹 <strong>Innovación:</strong> Soluciones creativas y modernas<br>
🔹 <strong>Transparencia:</strong> Comunicación clara y honesta<br>
🔹 <strong>Compromiso:</strong> Cumplimiento y dedicación total<br>
🔹 <strong>Crecimiento:</strong> Mejora continua en todo lo que hacemos`;
  }

  // === 4. Servicios ofrecidos (mejorado) ===
  if (/(servicio|ofrecen|solución|software|sistema|aplicación|desarrollo|qué hacen)/.test(lowerMessage)) {
    return `🛠️ <strong>Servicios de CodeCloud</strong><br><br>
📱 <strong>Desarrollo de Aplicaciones</strong><br>
• Apps móviles nativas e híbridas<br>
• Aplicaciones web progresivas (PWA)<br>
• Sistemas web responsive<br><br>
🏢 <strong>Sistemas Empresariales</strong><br>
• ERP (Planificación de Recursos)<br>
• CRM (Gestión de Clientes)<br>
• Sistemas de inventarios<br>
• Gestión de RRHH<br><br>
🤖 <strong>Automatización e IA</strong><br>
• Automatización de procesos<br>
• Chatbots inteligentes<br>
• Análisis de datos<br>
• Integración con APIs<br><br>
☁️ <strong>Soluciones en la Nube</strong><br>
• Migración a cloud<br>
• Infraestructura escalable<br>
• Backup y seguridad<br><br>
¿Qué tipo de solución necesitas para tu empresa?`;
  }

  // === 5. Tipos de proyectos con ejemplos específicos ===
  if (/(tipo.*proyecto|qué desarrollan|ejemplos.*proyecto|proyectos|casos.*éxito|portfolio)/.test(lowerMessage)) {
    return `💼 <strong>Proyectos que hemos desarrollado</strong><br><br>
🏪 <strong>Retail y Comercio</strong><br>
• Sistema de punto de venta con inventarios<br>
• E-commerce con pasarelas de pago<br>
• Gestión de cadenas de tiendas<br><br>
🏥 <strong>Salud y Servicios</strong><br>
• Gestión de citas médicas<br>
• Historiales clínicos digitales<br>
• Sistemas de laboratorio<br><br>
🏭 <strong>Industria y Logística</strong><br>
• Control de producción<br>
• Seguimiento de envíos<br>
• Gestión de almacenes<br><br>
📚 <strong>Educación y Capacitación</strong><br>
• Plataformas de e-learning<br>
• Gestión académica<br>
• Sistemas de evaluación<br><br>
🌟 Cada proyecto se adapta 100% a las necesidades específicas del cliente.`;
  }

  // === 6. Estructura organizacional y proceso ===
  if (/(organización|estructura|roles|equipo|quién trabaja|proceso|metodología|como trabajan)/.test(lowerMessage)) {
    return `👥 <strong>Nuestro Equipo y Metodología</strong><br><br>
🎖️ <strong>Estructura Organizacional</strong><br>
• <strong>Dirección General:</strong> Estrategia y visión<br>
• <strong>Gerencia de Proyectos:</strong> Control de calidad<br>
• <strong>QA Lead:</strong> Auditorías y testing<br>
• <strong>Desarrolladores Senior:</strong> Arquitectura y código<br>
• <strong>Equipo de Testing:</strong> Pruebas exhaustivas<br><br>
⚡ <strong>Metodología MIXED</strong><br>
1️⃣ <strong>Análisis:</strong> Entendemos tu negocio<br>
2️⃣ <strong>Diseño:</strong> UX/UI centrado en el usuario<br>
3️⃣ <strong>Desarrollo:</strong> Código limpio y escalable<br>
4️⃣ <strong>Testing:</strong> Pruebas rigurosas<br>
5️⃣ <strong>Implementación:</strong> Deploy y capacitación<br>
6️⃣ <strong>Soporte:</strong> Mantenimiento continuo<br><br>
📊 Reportes semanales de progreso garantizados.`;
  }

  // === 7. Calidad y certificaciones (expandido) ===
  if (/(calidad|certificación|ieee|estándar|metodología|mixed|garantía|testing|pruebas)/.test(lowerMessage)) {
    return `🔍 <strong>Garantía de Calidad CodeCloud</strong><br><br>
📜 <strong>Estándares y Certificaciones</strong><br>
✅ IEEE 730 - Estándar de aseguramiento de calidad<br>
✅ Metodología ágil con controles de calidad<br>
✅ Code review en cada commit<br>
✅ Testing automatizado y manual<br><br>
🛡️ <strong>Proceso de QA</strong><br>
• Revisiones de código por pares<br>
• Testing funcional y de rendimiento<br>
• Auditorías de seguridad<br>
• Pruebas de usabilidad<br>
• Testing en múltiples dispositivos<br><br>
📊 <strong>Métricas de Calidad</strong><br>
• Cobertura de pruebas > 80%<br>
• Tiempo de respuesta optimizado<br>
• Código limpio y documentado<br>
• Zero critical bugs en producción<br><br>
💎 <strong>Garantía:</strong> 3 meses de soporte gratuito post-entrega.`;
  }

  // === 8. Tiempo de desarrollo (más detallado) ===
  if (/(tiempo|plazo|cuánto tardan|duración|fecha.*entrega|cronograma|calendario)/.test(lowerMessage)) {
    return `⏱️ <strong>Tiempos de Desarrollo</strong><br><br>
🚀 <strong>Proyectos Express (2-4 semanas)</strong><br>
• Landing pages corporativas<br>
• Sitios web informativos<br>
• Apps móviles básicas<br>
• Automatizaciones simples<br><br>
⚡ <strong>Proyectos Estándar (1-3 meses)</strong><br>
• Sistemas de gestión<br>
• E-commerce completo<br>
• Apps móviles avanzadas<br>
• Integraciones con APIs<br><br>
🏗️ <strong>Proyectos Enterprise (3-6 meses)</strong><br>
• ERP/CRM personalizados<br>
• Plataformas complejas<br>
• Sistemas de múltiples módulos<br>
• Soluciones con IA<br><br>
📅 <strong>Factores que influyen en el tiempo:</strong><br>
• Complejidad de funcionalidades<br>
• Integraciones requeridas<br>
• Diseño personalizado<br>
• Feedback y cambios del cliente<br><br>
💡 <strong>¡Análisis gratuito!</strong> Te damos un cronograma detallado sin compromiso.`;
  }

  // === 9. Precios y cotizaciones (más específico) ===
  if (/(precio|costo|cotización|cuánto cuesta|tarifa|presupuesto|inversión)/.test(lowerMessage)) {
    return `💰 <strong>Inversión en tu Proyecto</strong><br><br>
📊 <strong>Factores que determinan el precio:</strong><br>
🔹 Complejidad y número de funcionalidades<br>
🔹 Diseño personalizado vs. plantillas<br>
🔹 Integraciones con sistemas externos<br>
🔹 Tiempo de desarrollo estimado<br>
🔹 Nivel de personalización requerido<br><br>
💡 <strong>Rangos aproximados:</strong><br>
• Sitios web: Desde $800<br>
• Apps móviles: Desde $1,500<br>
• Sistemas de gestión: Desde $2,500<br>
• Soluciones Enterprise: Consultar<br><br>
🎁 <strong>Incluimos GRATIS:</strong><br>
✅ Análisis de requerimientos<br>
✅ Diseño UX/UI<br>
✅ Testing completo<br>
✅ Capacitación del equipo<br>
✅ 3 meses de soporte<br><br>
📱 ¡Solicita tu cotización personalizada! <a href="https://wa.link/5ic612" target="_blank">WhatsApp</a>`;
  }

  // === 10. Contacto y ubicación (mejorado) ===
  if (/(contacto|ubicación|correo|whatsapp|teléfono|dónde están|dirección|oficina|visita)/.test(lowerMessage)) {
    return `📞 <strong>Contacta con CodeCloud</strong><br><br>
📍 <strong>Nuestra Oficina</strong><br>
🏢 Santa Cruz de la Sierra, Bolivia<br>
🗺️ <a href="https://maps.app.goo.gl/YRpACso4TjHMGFAg7" target="_blank" style="color: #007bff; font-weight: bold;">📍 Ver ubicación en Google Maps</a><br><br>
📱 <strong>Canales de Comunicación</strong><br>
💬 WhatsApp: <a href="https://wa.link/5ic612" target="_blank" style="color: #25d366; font-weight: bold;">Chatear ahora</a><br>
✉️ Email: <a href="mailto:info@website.com" style="color: #007bff;">info@website.com</a><br><br>
🕒 <strong>Horarios de Atención</strong><br>
• Lunes a Viernes: 8:00 AM - 6:00 PM<br>
• Sábados: 9:00 AM - 1:00 PM<br>
• WhatsApp: Disponible 24/7<br><br>
☕ <strong>¿Prefieres una reunión presencial?</strong><br>
¡Agenda tu cita y conversemos sobre tu proyecto con un café!`;
  }

  // === 11. Tecnologías y herramientas ===
  if (/(tecnología|herramienta|lenguaje|framework|stack|python|react|node)/.test(lowerMessage)) {
    return `🔧 <strong>Tecnologías que Dominamos</strong><br><br>
💻 <strong>Frontend</strong><br>
• React.js, Vue.js, Angular<br>
• HTML5, CSS3, JavaScript ES6+<br>
• Bootstrap, Tailwind CSS<br>
• Progressive Web Apps<br><br>
⚙️ <strong>Backend</strong><br>
• Python (Django, Flask, FastAPI)<br>
• Node.js (Express, NestJS)<br>
• PHP (Laravel, CodeIgniter)<br>
• Java (Spring Boot)<br><br>
📱 <strong>Móvil</strong><br>
• React Native<br>
• Flutter<br>
• Ionic<br>
• Desarrollo nativo iOS/Android<br><br>
🗄️ <strong>Bases de Datos</strong><br>
• MySQL, PostgreSQL<br>
• MongoDB, Firebase<br>
• Redis para caché<br><br>
☁️ <strong>Cloud y DevOps</strong><br>
• AWS, Google Cloud, Azure<br>
• Docker, Kubernetes<br>
• CI/CD con GitHub Actions<br><br>
🚀 Siempre utilizamos las tecnologías más adecuadas para cada proyecto.`;
  }

  // === 12. Soporte y mantenimiento ===
  if (/(soporte|mantenimiento|ayuda|problema|error|actualización|bug)/.test(lowerMessage)) {
    return `🛠️ <strong>Soporte y Mantenimiento</strong><br><br>
🆘 <strong>Soporte Técnico Incluido</strong><br>
✅ 3 meses de soporte gratuito post-entrega<br>
✅ Corrección de bugs sin costo adicional<br>
✅ Actualizaciones menores incluidas<br>
✅ Capacitación para tu equipo<br><br>
⚡ <strong>Tiempos de Respuesta</strong><br>
• Crítico: Máximo 2 horas<br>
• Alto: Máximo 8 horas<br>
• Medio: Máximo 24 horas<br>
• Bajo: Máximo 72 horas<br><br>
🔄 <strong>Planes de Mantenimiento Extendido</strong><br>
• Monitoreo 24/7<br>
• Actualizaciones de seguridad<br>
• Nuevas funcionalidades<br>
• Backup automático<br>
• Reportes mensuales<br><br>
📞 ¿Tienes algún problema técnico? <a href="https://wa.link/5ic612" target="_blank">Contáctanos ahora</a>`;
  }

  // === 13. Proceso de trabajo y fases ===
  if (/(proceso|fase|etapa|cómo trabajan|metodología|pasos|workflow)/.test(lowerMessage)) {
    return `📋 <strong>Nuestro Proceso de Trabajo</strong><br><br>
🎯 <strong>Fase 1: Discovery (Semana 1)</strong><br>
• Reunión inicial para entender tu negocio<br>
• Análisis de requerimientos detallado<br>
• Propuesta técnica y comercial<br>
• Definición de cronograma<br><br>
🎨 <strong>Fase 2: Diseño (Semana 2-3)</strong><br>
• Wireframes y mockups<br>
• Diseño UX/UI personalizado<br>
• Prototipo interactivo<br>
• Validación con el cliente<br><br>
⚙️ <strong>Fase 3: Desarrollo (70% del tiempo)</strong><br>
• Arquitectura del sistema<br>
• Desarrollo iterativo con demos semanales<br>
• Testing continuo<br>
• Feedback constante<br><br>
🧪 <strong>Fase 4: Testing y QA (2 semanas)</strong><br>
• Pruebas funcionales exhaustivas<br>
• Testing de rendimiento<br>
• Pruebas de seguridad<br>
• UAT con el cliente<br><br>
🚀 <strong>Fase 5: Deploy y Lanzamiento</strong><br>
• Configuración del servidor<br>
• Migración de datos<br>
• Capacitación del equipo<br>
• Go-live asistido<br><br>
📊 Recibes reportes semanales de progreso con capturas y demos.`;
  }

  // === 14. Despedida mejorada ===
  if (/(gracias|adiós|hasta luego|nos vemos|chau|bye|muchas gracias)/.test(lowerMessage)) {
    const despedidas = [
      `😊 ¡Ha sido un placer ayudarte! En <strong>CodeCloud</strong> estamos listos para hacer realidad tu proyecto.`,
      `🚀 ¡Gracias por considerar <strong>CodeCloud</strong>! Esperamos ser parte de tu éxito digital.`,
      `💫 ¡Excelente! No dudes en volver cuando necesites más información sobre desarrollo de software.`
    ];
    const despedida = despedidas[Math.floor(Math.random() * despedidas.length)];
    
    return `${despedida}<br><br>
📱 <strong>Próximos pasos:</strong><br>
1️⃣ <a href="https://wa.link/5ic612" target="_blank">Escríbenos por WhatsApp</a><br>
2️⃣ Cuéntanos sobre tu proyecto<br>
3️⃣ Recibe tu cotización gratuita<br><br>
🏢 <strong>CodeCloud</strong> - Transformando ideas en soluciones digitales<br>
✉️ info@website.com | 🗺️ <a href="https://maps.app.goo.gl/YRpACso4TjHMGFAg7" target="_blank">Santa Cruz, Bolivia</a><br><br>
¡Hasta pronto! 🎯`;
  }

  // === 15. Preguntas sobre competencia o comparación ===
  if (/(competencia|otros|mejor|por qué elegir|ventaja|diferencia|comparar)/.test(lowerMessage)) {
    return `🌟 <strong>¿Por qué elegir CodeCloud?</strong><br><br>
🏆 <strong>Nuestras Ventajas Competitivas</strong><br>
✅ <strong>Experiencia Local:</strong> Entendemos el mercado boliviano<br>
✅ <strong>Calidad Internacional:</strong> Estándares IEEE 730<br>
✅ <strong>Metodología Propia:</strong> MIXED para mejores resultados<br>
✅ <strong>Comunicación Clara:</strong> Reportes semanales detallados<br>
✅ <strong>Soporte Real:</strong> 3 meses incluidos + disponibilidad 24/7<br><br>
💎 <strong>Lo que nos hace únicos:</strong><br>
🔹 Enfoque en UX/UI que realmente funciona<br>
🔹 Código limpio, escalable y documentado<br>
🔹 Testing exhaustivo antes de cada entrega<br>
🔹 Precios justos sin comprometer calidad<br>
🔹 Relación personal, no eres solo un número<br><br>
🤝 <strong>Garantía de satisfacción:</strong> Si no cumplimos lo prometido, devolvemos tu inversión.<br><br>
¿Te gustaría conocer testimonios de nuestros clientes?`;
  }

  // === 16. Testimonios y casos de éxito ===
  if (/(testimonio|referencia|cliente|caso.*éxito|experiencia|opinión)/.test(lowerMessage)) {
    return `⭐ <strong>Lo que dicen nuestros clientes</strong><br><br>
🗣️ <strong>"El mejor equipo de desarrollo en Santa Cruz"</strong><br>
<em>"CodeCloud transformó completamente nuestro negocio. El sistema que desarrollaron aumentó nuestra eficiencia en un 40%."</em><br>
- María González, Directora Comercial<br><br>
💼 <strong>"Profesionalismo y calidad excepcional"</strong><br>
<em>"Entregaron exactamente lo que prometieron, en tiempo y forma. Su soporte post-venta es impecable."</em><br>
- Carlos Mendoza, Gerente de Operaciones<br><br>
🚀 <strong>"Superaron nuestras expectativas"</strong><br>
<em>"No solo crearon nuestra app, sino que nos ayudaron a entender mejor nuestro negocio digital."</em><br>
- Ana Rodríguez, Emprendedora<br><br>
📊 <strong>Nuestros Números</strong><br>
• 50+ proyectos exitosos<br>
• 95% de clientes satisfechos<br>
• 0% de proyectos abandonados<br>
• Tiempo promedio de respuesta: 2 horas<br><br>
¿Te gustaría hablar con alguno de nuestros clientes actuales?`;
  }

  // === 17. Seguridad y privacidad ===
  if (/(seguridad|privacidad|protección|datos|información|confidencial|gdpr)/.test(lowerMessage)) {
    return `🔒 <strong>Seguridad y Privacidad</strong><br><br>
🛡️ <strong>Protección de Datos</strong><br>
✅ Encriptación de datos sensibles<br>
✅ Comunicación segura (SSL/TLS)<br>
✅ Respaldos automáticos cifrados<br>
✅ Acceso controlado por roles<br>
✅ Auditorías de seguridad regulares<br><br>
📜 <strong>Cumplimiento Legal</strong><br>
• Acuerdos de confidencialidad (NDA)<br>
• Cumplimiento de normativas locales<br>
• Políticas de privacidad claras<br>
• Derecho al olvido implementado<br><br>
🔐 <strong>Mejores Prácticas</strong><br>
• Autenticación multifactor<br>
• Logs de auditoría completos<br>
• Pruebas de penetración<br>
• Actualizaciones de seguridad automáticas<br><br>
💡 Tu información y la de tus clientes están 100% protegidas con nosotros.`;
  }

  // === 18. Capacitación y documentación ===
  if (/(capacitación|entrenamiento|documentación|manual|curso|enseñanza|aprender)/.test(lowerMessage)) {
    return `📚 <strong>Capacitación y Documentación</strong><br><br>
🎓 <strong>Capacitación Incluida</strong><br>
✅ Sesiones de entrenamiento para tu equipo<br>
✅ Manuales de usuario detallados<br>
✅ Videos tutoriales paso a paso<br>
✅ Guías de administración<br>
✅ Sesión de preguntas y respuestas<br><br>
📖 <strong>Documentación Completa</strong><br>
• Manual de usuario final<br>
• Guía de administrador<br>
• Documentación técnica<br>
• Diagramas de flujo<br>
• Casos de uso y ejemplos<br><br>
🎯 <strong>Modalidades de Capacitación</strong><br>
• Presencial en tu oficina<br>
• Virtual por videollamada<br>
• Grabaciones para consulta posterior<br>
• Soporte por chat durante la adaptación<br><br>
📞 ¿Necesitas capacitación especializada adicional? ¡Consultanos!`;
  }

  // === 19. Escalabilidad y futuro ===
  if (/(escalabilidad|crecimiento|futuro|expansión|actualización|evolución)/.test(lowerMessage)) {
    return `📈 <strong>Escalabilidad y Crecimiento</strong><br><br>
🚀 <strong>Pensamos en tu Futuro</strong><br>
✅ Arquitectura escalable desde el inicio<br>
✅ Código modular y extensible<br>
✅ Base de datos optimizada para crecimiento<br>
✅ Infraestructura cloud elástica<br><br>
🔄 <strong>Evolución Continua</strong><br>
• Nuevas funcionalidades por fases<br>
• Integración con nuevas tecnologías<br>
• Optimización de rendimiento<br>
• Migración a nuevas plataformas<br><br>
📊 <strong>Ejemplos de Escalabilidad</strong><br>
• De 100 a 10,000 usuarios<br>
• Nuevos módulos sin afectar existentes<br>
• Integración con sistemas empresariales<br>
• Expansión a nuevos mercados<br><br>
💡 Tu inversión está protegida: el sistema crece contigo.`;
  }

  // === 20. Urgencias y proyectos express ===
  if (/(urgente|rápido|express|ya|inmediato|pronto|rush|emergency)/.test(lowerMessage)) {
    return `⚡ <strong>Proyectos Express y Urgentes</strong><br><br>
🚨 <strong>¿Necesitas algo urgente?</strong><br>
¡Entendemos que a veces los proyectos no pueden esperar!<br><br>
⏰ <strong>Servicios Express Disponibles</strong><br>
• Landing pages: 2-3 días<br>
• Sitios web básicos: 1 semana<br>
• Apps móviles simples: 2 semanas<br>
• Automatizaciones: 3-5 días<br><br>
🎯 <strong>Modalidad Rush</strong><br>
✅ Equipo dedicado exclusivamente<br>
✅ Trabajo en horarios extendidos<br>
✅ Comunicación diaria de avances<br>
✅ Entrega garantizada en fecha<br><br>
💰 <strong>Inversión adicional por urgencia:</strong> +30% del precio base<br><br>
📱 <strong>¿Es realmente urgente?</strong><br>
<a href="https://wa.link/5ic612" target="_blank">Contáctanos ahora</a> y evaluamos tu caso específico.`;
  }

  // === 21. Integración con sistemas existentes ===
  if (/(integración|conectar|sistema.*existente|api|erp|crm|base.*datos)/.test(lowerMessage)) {
    return `🔗 <strong>Integración con Sistemas Existentes</strong><br><br>
🏢 <strong>Conectamos con lo que ya tienes</strong><br>
No necesitas cambiar todo, ¡integramos con tu infraestructura actual!<br><br>
⚙️ <strong>Sistemas que Integramos</strong><br>
• ERP (SAP, Oracle, Microsoft Dynamics)<br>
• CRM (Salesforce, HubSpot, Zoho)<br>
• Contabilidad (ContaPlus, Siigo, QuickBooks)<br>
• E-commerce (WooCommerce, Shopify, Magento)<br>
• Bases de datos legacy<br><br>
🔌 <strong>Tipos de Integración</strong><br>
• APIs REST y GraphQL<br>
• Webhooks en tiempo real<br>
• Sincronización de datos<br>
• Importación/Exportación automática<br>
• Integración por archivos<br><br>
✅ <strong>Beneficios</strong><br>
• Datos unificados<br>
• Procesos automatizados<br>
• Eliminación de duplicados<br>
• Reportes consolidados<br><br>
¿Qué sistemas necesitas integrar?`;
  }

  // === 22. Respuesta por defecto mejorada ===
  return `🤔 <strong>Hmm, parece que necesitas información más específica</strong><br><br>
💡 <strong>Puedo ayudarte con:</strong><br>
🚀 <strong>Servicios:</strong> Desarrollo web, móvil, sistemas<br>
🏢 <strong>Empresa:</strong> Quiénes somos, experiencia, metodología<br>
💰 <strong>Precios:</strong> Cotizaciones y presupuestos<br>
⏰ <strong>Tiempos:</strong> Plazos de entrega y cronogramas<br>
📞 <strong>Contacto:</strong> Ubicación, teléfonos, emails<br>
🔧 <strong>Tecnologías:</strong> Herramientas que usamos<br>
⭐ <strong>Calidad:</strong> Certificaciones y garantías<br><br>
💬 <strong>También puedes preguntarme:</strong><br>
• "¿Cuánto cuesta una app móvil?"<br>
• "¿Dónde están ubicados?"<br>
• "¿Qué garantías ofrecen?"<br>
• "¿Pueden integrar con mi sistema actual?"<br><br>
📱 <strong>¿Prefieres hablar directamente?</strong><br>
<a href="https://wa.link/5ic612" target="_blank" style="background: #25d366; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-weight: bold;">💬 Chatear por WhatsApp</a><br><br>
🗺️ <a href="https://maps.app.goo.gl/YRpACso4TjHMGFAg7" target="_blank">📍 Visítanos en Santa Cruz</a> | ✉️ info@website.com`;
}

// === FUNCIONES ADICIONALES ===

// Función para detectar intención del usuario
function detectIntention(message) {
  const intentions = {
    greeting: /(hola|buenas|hey|saludos)/,
    services: /(servicio|solución|desarrollo|sistema)/,
    pricing: /(precio|costo|cotización|cuánto)/,
    contact: /(contacto|ubicación|teléfono|email)/,
    company: /(empresa|quiénes|nosotros|codecloud)/,
    time: /(tiempo|plazo|duración|cuándo)/,
    quality: /(calidad|garantía|certificación)/,
    farewell: /(gracias|adiós|chau|bye)/
  };

  for (const [intent, pattern] of Object.entries(intentions)) {
    if (pattern.test(message.toLowerCase())) {
      return intent;
    }
  }
  return 'unknown';
}

// Función para limpiar el chat
function clearChat() {
  const container = document.getElementById("chatbotMessages");
  container.innerHTML = "";
  conversationHistory = [];
  hideQuickActions();
  
  // Mostrar mensaje de bienvenida después de limpiar
  setTimeout(() => {
    appendMessage("bot", getWelcomeMessage());
    showQuickActions();
  }, 500);
}

// Función para exportar conversación
function exportConversation() {
  const data = {
    session: currentSession,
    timestamp: new Date().toISOString(),
    messages: conversationHistory
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `conversacion_codecloud_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Función para generar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para formatear texto con emojis
function addEmojis(text) {
  const emojiMap = {
    'CodeCloud': '🚀 CodeCloud',
    'desarrollo': '💻 desarrollo',
    'calidad': '⭐ calidad',
    'servicio': '🛠️ servicio',
    'proyecto': '📊 proyecto',
    'tiempo': '⏰ tiempo',
    'precio': '💰 precio',
    'contacto': '📞 contacto',
    'empresa': '🏢 empresa'
  };

  let formattedText = text;
  for (const [word, emoji] of Object.entries(emojiMap)) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    formattedText = formattedText.replace(regex, emoji);
  }
  
  return formattedText;
}

// Función para sugerir preguntas relacionadas
function getSuggestedQuestions(lastMessage) {
  const suggestions = {
    services: [
      "¿Cuánto cuesta un sistema de gestión?",
      "¿Desarrollan aplicaciones móviles?",
      "¿Qué tecnologías usan?"
    ],
    pricing: [
      "¿Incluyen soporte post-venta?",
      "¿Cuáles son los métodos de pago?",
      "¿Hacen proyectos por etapas?"
    ],
    company: [
      "¿Cuántos años de experiencia tienen?",
      "¿Dónde están ubicados?",
      "¿Qué proyectos han realizado?"
    ],
    contact: [
      "¿Puedo agendar una reunión?",
      "¿Atienden los fines de semana?",
      "¿Hacen visitas a domicilio?"
    ]
  };

  const intent = detectIntention(lastMessage);
  return suggestions[intent] || suggestions.services;
}

// Función para mostrar sugerencias de preguntas
function showSuggestions(message) {
  const suggestions = getSuggestedQuestions(message);
  const suggestionsHtml = suggestions.map(q => 
    `<button class="suggestion-btn" onclick="document.getElementById('chatInput').value='${q}'; sendMessage();">${q}</button>`
  ).join('');
  
  setTimeout(() => {
    appendMessage("bot", `💡 <strong>Otras preguntas frecuentes:</strong><br>${suggestionsHtml}`);
  }, 2000);
}

// Función para manejar errores
function handleError(error) {
  console.error('Error en chatbot:', error);
  appendMessage("bot", `⚠️ <strong>Ups, algo salió mal</strong><br>
Por favor, inténtalo de nuevo o contáctanos directamente:<br>
📱 <a href="https://wa.link/5ic612" target="_blank">WhatsApp</a> | ✉️ info@website.com`);
}

// Función para validar entrada del usuario
function validateInput(message) {
  // Filtrar contenido potencialmente malicioso
  const forbiddenWords = ['<script', 'javascript:', 'onclick', 'onerror'];
  const lowerMessage = message.toLowerCase();
  
  return !forbiddenWords.some(word => lowerMessage.includes(word));
}

// Función para inicializar el chatbot
function initChatbot() {
  const input = document.getElementById("chatInput");
  if (input) {
    input.addEventListener("input", function() {
      const button = document.getElementById("sendButton");
      const hasText = this.value.trim().length > 0;
      
      if (button) {
        button.style.opacity = hasText ? "1" : "0.5";
        button.style.cursor = hasText ? "pointer" : "default";
      }
    });
    
    // Placeholder dinámico
    const placeholders = [
      "¿Qué servicios ofrecen?",
      "¿Cuánto cuesta una app?",
      "¿Dónde están ubicados?",
      "Cuéntame sobre CodeCloud"
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
      input.placeholder = placeholders[placeholderIndex];
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);
  }
  
  // Detectar inactividad
  let inactivityTimer;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (conversationHistory.length > 0) {
        appendMessage("bot", `💤 <strong>¿Sigues ahí?</strong><br>
Si necesitas más información, estaré aquí esperando.<br>
También puedes contactarnos directamente:<br>
📱 <a href="https://wa.link/5ic612" target="_blank">WhatsApp</a>`);
      }
    }, 300000); // 5 minutos
  }
  
  // Eventos para reiniciar timer
  document.addEventListener('click', resetInactivityTimer);
  document.addEventListener('keypress', resetInactivityTimer);
  resetInactivityTimer();
}

// Inicializar cuando se carga el DOM
document.addEventListener('DOMContentLoaded', initChatbot);

// === ESTILOS CSS ADICIONALES (para incluir en el HTML) ===
/*
Agregar estos estilos CSS para las nuevas funcionalidades:

.message-appear {
  animation: slideInMessage 0.3s ease-out;
}

@keyframes slideInMessage {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-btn {
  background: #f0f8ff;
  border: 1px solid #007bff;
  border-radius: 15px;
  color: #007bff;
  cursor: pointer;
  font-size: 12px;
  margin: 3px;
  padding: 5px 10px;
  transition: all 0.2s;
}

.suggestion-btn:hover {
  background: #007bff;
  color: white;
}

.typing-dots {
  display: inline-block;
}

.typing-dots span {
  animation: typing 1.4s infinite;
  background: #007bff;
  border-radius: 50%;
  display: inline-block;
  height: 8px;
  margin: 0 2px;
  width: 8px;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.message-time {
  color: #666;
  font-size: 10px;
  margin-top: 5px;
  display: block;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
*/