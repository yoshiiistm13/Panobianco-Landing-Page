// Remover el badge "Powered by Netlify" si es inyectado en el DOM
document.addEventListener('DOMContentLoaded', () => {
  const removeNetlifyBadge = () => {
    const elements = document.querySelectorAll('a[href*="utm_source=powered-by-netlify"], a[href*="netlify.com"]');
    elements.forEach(el => {
      // Verificamos que sea el botón flotante fijo en pantalla y no un link normal
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || el.textContent.toLowerCase().includes('powered by netlify')) {
        el.remove();
      }
    });
  };

  // Ejecutar al cargar y observar si Netlify lo inyecta después
  removeNetlifyBadge();
  const observer = new MutationObserver(removeNetlifyBadge);
  observer.observe(document.body, { childList: true, subtree: true });
});