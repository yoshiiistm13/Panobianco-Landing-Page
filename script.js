// Remover el badge "Powered by Netlify" si es inyectado en el DOM
document.addEventListener('DOMContentLoaded', () => {
  const formPanobianco = document.getElementById('formulario__panobianco');
  const captchaError = document.getElementById('captcha-error');

  if (formPanobianco) {
    formPanobianco.addEventListener('submit', (e) => {
      const recaptchaResponse = formPanobianco.querySelector('[name="g-recaptcha-response"]');

      if (recaptchaResponse && !recaptchaResponse.value) {
        e.preventDefault();
        if (captchaError) {
          captchaError.style.display = 'block';
        }
        return;
      }

      if (captchaError) {
        captchaError.style.display = 'none';
      }
    });
  }
});

  // Ejecutar al cargar y observar si Netlify lo inyecta después
  removeNetlifyBadge();
  const observer = new MutationObserver(removeNetlifyBadge);
  observer.observe(document.body, { childList: true, subtree: true });
});