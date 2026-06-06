/* ===========================
   PRO 6 – CHECKOUT SCRIPT
   =========================== */

(function () {
  'use strict';

  const PRICE = 59.90;

  /* ---- Color selector ---- */
  const colorCards = document.querySelectorAll('.color-card');
  const summaryImg = document.getElementById('summaryImg');
  const summaryVariant = document.getElementById('summaryVariant');

  // Preload color images from hidden imgs
  const imgSrcs = {
    black: document.getElementById('img-black')?.src,
    white: document.getElementById('img-white')?.src,
    pink:  document.getElementById('img-pink')?.src,
  };

  // Build label map
  const labelMap = {};
  colorCards.forEach(card => {
    labelMap[card.dataset.color] = card.dataset.label;
  });

  let selectedColor = 'black';
  let quantity = 1;

  colorCards.forEach(card => {
    card.addEventListener('click', () => {
      colorCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedColor = card.dataset.color;

      // Update summary
      const label = card.dataset.label.toUpperCase();
      summaryVariant.textContent = `${quantity}x ${label}`;

      // Swap summary image
      const src = imgSrcs[selectedColor] || card.querySelector('img').src;
      summaryImg.style.opacity = '0';
      summaryImg.style.transform = 'scale(0.9)';
      setTimeout(() => {
        summaryImg.src = src;
        summaryImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        summaryImg.style.opacity = '1';
        summaryImg.style.transform = 'scale(1)';
      }, 150);
    });
  });

  /* ---- Quantity ---- */
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus  = document.getElementById('qtyPlus');
  const qtyVal   = document.getElementById('qtyVal');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl    = document.getElementById('totalPrice');
  const summaryItemPrice = document.getElementById('summaryItemPrice');

  function updatePrice() {
    const total = (PRICE * quantity).toFixed(2);
    qtyVal.textContent = quantity;
    subtotalEl.textContent = `S/${total}`;
    totalEl.textContent = `S/${total}`;
    summaryItemPrice.textContent = `S/${total}`;
    summaryVariant.textContent = `${quantity}x ${labelMap[selectedColor]?.toUpperCase() || 'PHANTOM BLACK'}`;
  }

  qtyMinus.addEventListener('click', () => {
    if (quantity > 1) { quantity--; updatePrice(); }
    qtyMinus.style.transform = 'scale(0.88)';
    setTimeout(() => qtyMinus.style.transform = '', 150);
  });

  qtyPlus.addEventListener('click', () => {
    if (quantity < 10) { quantity++; updatePrice(); }
    qtyPlus.style.transform = 'scale(0.88)';
    setTimeout(() => qtyPlus.style.transform = '', 150);
  });

  /* ---- Select color value fix ---- */
  document.querySelectorAll('.select-wrap select').forEach(sel => {
    sel.addEventListener('change', () => {
      if (sel.value) sel.classList.add('has-value');
    });
  });

  /* ---- Form validation + submit ---- */
  const form      = document.getElementById('checkoutForm');
  const btnFinal  = document.getElementById('btnFinalizar');
  const modal     = document.getElementById('modalOverlay');
  const modalClose= document.getElementById('modalClose');

  function validateField(input) {
    const ok = input.validity.valid && input.value.trim() !== '';
    input.classList.toggle('error', !ok);
    return ok;
  }

  // Live validation on blur
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(el);
    });
  });

  btnFinal.addEventListener('click', () => {
    const fields = form.querySelectorAll('input[required], select[required]');
    let allValid = true;

    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }

      // Shake the button
      btnFinal.style.animation = 'shake 0.4s ease';
      setTimeout(() => btnFinal.style.animation = '', 500);
      return;
    }

    // Success: show modal
    modal.classList.add('show');

    // Build message for WhatsApp and email
    try {
      const nombres = document.getElementById('nombres').value.trim();
      const apellidos = document.getElementById('apellidos').value.trim();
      const prefix = document.getElementById('prefix').value;
      const telefono = document.getElementById('telefono').value.trim();
      const dept = document.getElementById('departamento').value;
      const dist = document.getElementById('distrito').value;
      const direccion = document.getElementById('direccion').value.trim();
      const email = document.getElementById('email').value.trim();
      const colorLabel = labelMap[selectedColor] || selectedColor;
      const total = (PRICE * quantity).toFixed(2);

      const message = `Nuevo pedido Pro 6%0A\nNombre: ${nombres} ${apellidos}%0ATeléfono: ${prefix} ${telefono}%0ACorreo: ${email}%0ADirección: ${direccion}, ${dist}, ${dept}%0AColor: ${colorLabel}%0ACantidad: ${quantity}%0ATotal: S/${total}`;

      // WhatsApp (user prefers WhatsApp). Use international number without plus/spaces.
      const waPhone = '51973376311'; // +51 973376311
      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(decodeURIComponent(message))}`;

      // Open WhatsApp in a new tab/window
      window.open(waUrl, '_blank');

      // Also open mailto as fallback
      const subject = encodeURIComponent('Nuevo pedido Pro 6');
      const body = encodeURIComponent(message.replace(/%0A\\n/g, '\n').replace(/%0A/g, '\n'));
      const mailto = `mailto:iriartejeshua@gmail.com?subject=${subject}&body=${body}`;
      window.open(mailto, '_blank');
    } catch (err) {
      // If anything fails, just continue — modal already shown
      console.error('Error preparando envío por WhatsApp/mailto:', err);
    }
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
    // Reset form
    form.reset();
    quantity = 1;
    updatePrice();
    colorCards.forEach((c, i) => c.classList.toggle('active', i === 0));
    selectedColor = 'black';
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  });

  // Close modal on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  // Keyboard close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('show');
  });

  /* ---- Shake keyframe injection ---- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(style);

  /* ---- Departamento locked to Lima ---- */
  const deptSelect = document.getElementById('departamento');
  deptSelect.addEventListener('change', () => {
    deptSelect.classList.add('has-value');
  });
  // Auto-select Lima since it's the only option
  deptSelect.value = 'Lima';
  deptSelect.classList.add('has-value');

})();
