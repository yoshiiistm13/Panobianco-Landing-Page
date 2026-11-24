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

  // Validar que el CAPTCHA esté resuelto antes de enviar #formulario__panobianco
  const formPanobianco = document.getElementById('formulario__panobianco');
  const formError = document.getElementById('form-error');
  const captchaError = document.getElementById('captcha-error');

  if (formPanobianco) {
    const fields = Array.from(formPanobianco.querySelectorAll('input:not([type="hidden"]), select'));

    const validateField = (field) => {
      field.setCustomValidity('');

      if (field.name === 'name') {
        const name = field.value.trim().replace(/\s+/g, ' ');
        if (name && name.split(' ').length < 2) {
          field.setCustomValidity('Ingresa tu nombre y apellido.');
        } else if (field.value && !name) {
          field.setCustomValidity('Ingresa tu nombre y apellido.');
        }
      }

      if (field.name === 'phone' && field.value.trim()) {
        const digits = field.value.replace(/\D/g, '');
        const hasValidDigitCount = digits.length === 10
          || (digits.length === 12 && digits.startsWith('52'))
          || (digits.length === 13 && digits.startsWith('521'));

        if (!hasValidDigitCount) {
          field.setCustomValidity('Ingresa 10 dígitos, con el prefijo +52 opcional.');
        }
      }

      if (field.name === 'city' && field.value && field.value.trim().length < 2) {
        field.setCustomValidity('Ingresa una ciudad o estado válido.');
      }
    };

    const updateFormError = () => {
      if (formError) {
        formError.hidden = !fields.some((field) => field.classList.contains('is-invalid'));
      }
    };

    fields.forEach((field) => {
      validateField(field);

      ['input', 'change', 'blur'].forEach((eventName) => {
        field.addEventListener(eventName, () => {
          if (field.name === 'email' && eventName === 'blur') {
            field.value = field.value.trim();
          }

          validateField(field);
          if (field.validity.valid) {
            field.classList.remove('is-invalid');
            field.removeAttribute('aria-invalid');
          } else if (field.classList.contains('is-invalid')) {
            field.setAttribute('aria-invalid', 'true');
          }
          updateFormError();
        });
      });
    });

    formPanobianco.addEventListener('invalid', (e) => {
      const field = e.target;
      if (fields.includes(field)) {
        validateField(field);
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        if (formError) {
          formError.hidden = false;
        }
      }
    }, true);

    formPanobianco.addEventListener('submit', (e) => {
      fields.forEach((field) => {
        validateField(field);
        if (field.validity.valid) {
          field.classList.remove('is-invalid');
          field.removeAttribute('aria-invalid');
        }
      });
      const invalidFields = fields.filter((field) => !field.validity.valid);

      if (invalidFields.length) {
        e.preventDefault();
        invalidFields.forEach((field) => {
          field.classList.add('is-invalid');
          field.setAttribute('aria-invalid', 'true');
        });
        if (formError) {
          formError.hidden = false;
        }
        invalidFields[0].reportValidity();
        return;
      }

      const recaptchaResponse = formPanobianco.querySelector('[name="g-recaptcha-response"]');
      const captchaContainer = formPanobianco.querySelector('[data-netlify-recaptcha="true"]');
      const captchaFrame = captchaContainer && captchaContainer.querySelector('iframe');
      const widgetToken = recaptchaResponse && recaptchaResponse.value.trim()
        ? recaptchaResponse.value.trim()
        : (captchaFrame && window.grecaptcha && typeof window.grecaptcha.getResponse === 'function'
          ? window.grecaptcha.getResponse()
          : '');

      if (!captchaContainer || !widgetToken) {
        e.preventDefault();
        if (captchaError) {
          captchaError.textContent = captchaFrame
            ? 'Por favor, marca la casilla "No soy un robot" antes de enviar.'
            : 'No se pudo cargar la verificación CAPTCHA. Recarga la página e inténtalo de nuevo.';
          captchaError.hidden = false;
        }
        return;
      }

      if (captchaError) {
        captchaError.hidden = true;
      }
    });
  }
});