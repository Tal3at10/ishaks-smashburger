// Ishak's Smash Burger — App & Ordering Engine

const CART_KEY = 'ishaks_cart_v2';
let cart = loadCart();
let activeModalItem = null;
let modalQuantity = 1;
let selectedOptions = {
  doubleMeat: false,
  glutenFree: false,
  drink: 'Coca-Cola 33 cl',
  dip: 'Tryffelmajo'
};

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  if (document.getElementById('menuMain')) {
    initMenuPage();
  }
  updateCartUI();
});

function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  const navCartBtn = document.getElementById('navCartBtn');
  if (navCartBtn) {
    navCartBtn.addEventListener('click', () => {
      openMobileDrawer();
    });
  }
}

function initMenuPage() {
  renderCategoryTabs();
  renderMenuSections();
  initModals();
  initMobileDrawer();
  initCheckout();
}

function renderCategoryTabs() {
  const tabsContainer = document.getElementById('categoryTabs');
  if (!tabsContainer || typeof MENU === 'undefined') return;

  tabsContainer.innerHTML = MENU.map((cat, idx) => `
    <button type="button" class="cat-tab ${idx === 0 ? 'active' : ''}" data-cat="${cat.id}">
      ${cat.label}
    </button>
  `).join('');

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-tab');
    if (!btn) return;
    const catId = btn.dataset.cat;
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const target = document.getElementById(`cat-sec-${catId}`);
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  });

  // Observe active category on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const catId = entry.target.id.replace('cat-sec-', '');
        document.querySelectorAll('.cat-tab').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.cat === catId);
        });
      }
    });
  }, { threshold: 0.3 });

  MENU.forEach(cat => {
    const el = document.getElementById(`cat-sec-${cat.id}`);
    if (el) observer.observe(el);
  });
}

function renderMenuSections() {
  const menuMain = document.getElementById('menuMain');
  if (!menuMain || typeof MENU === 'undefined') return;

  menuMain.innerHTML = MENU.map(cat => `
    <section class="menu-section" id="cat-sec-${cat.id}">
      <h2 class="menu-section-title">${cat.label}</h2>
      ${cat.desc ? `<p class="menu-section-desc">${cat.desc}</p>` : ''}
      <div class="dish-grid">
        ${cat.items.map(dish => `
          <div class="dish-card" data-dish-id="${dish.id}">
            <img src="${dish.img}" alt="${dish.name}" class="dish-card-img" loading="lazy" />
            <div class="dish-card-body">
              <h3 class="dish-card-name">${dish.name}</h3>
              <p class="dish-card-desc">${dish.desc}</p>
              <div class="dish-card-footer">
                <span class="dish-price">${dish.price} kr</span>
                <button type="button" class="dish-add-btn" data-dish-id="${dish.id}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>Lägg till</span>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('');

  menuMain.addEventListener('click', (e) => {
    const card = e.target.closest('.dish-card');
    if (!card) return;
    const dishId = card.dataset.dishId;
    const dish = findDish(dishId);
    if (dish) openProductModal(dish);
  });
}

function findDish(id) {
  if (typeof MENU === 'undefined') return null;
  for (const cat of MENU) {
    const found = cat.items.find(i => i.id === id);
    if (found) return { ...found, categoryId: cat.id };
  }
  return null;
}

function openProductModal(dish) {
  activeModalItem = dish;
  modalQuantity = 1;
  selectedOptions = {
    doubleMeat: false,
    glutenFree: false,
    drink: 'Coca-Cola 33 cl',
    dip: 'Tryffelmajo'
  };

  const modal = document.getElementById('productModal');
  const img = document.getElementById('modalImg');
  const name = document.getElementById('modalName');
  const desc = document.getElementById('modalDesc');
  const price = document.getElementById('modalPrice');
  const qtyNum = document.getElementById('modalQty');
  const optionsContainer = document.getElementById('modalOptions');

  img.src = dish.img;
  img.alt = dish.name;
  name.textContent = dish.name;
  desc.textContent = dish.desc;
  price.textContent = `${dish.price} kr`;
  qtyNum.textContent = '1';

  let optionsHTML = '';

  // Burgers allow double meat & gluten-free bread
  if (dish.categoryId === 'smash' || dish.id === 'barn') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Tillval &amp; Anpassningar</div>
        <div class="modal-opts">
          <label class="modal-opt">
            <input type="checkbox" id="optDoubleMeat" />
            <span class="modal-opt-name">Extra smashad patty (+100g)</span>
            <span class="modal-opt-price">+35 kr</span>
          </label>
          <label class="modal-opt">
            <input type="checkbox" id="optGlutenFree" />
            <span class="modal-opt-name">Glutenfritt briochebröd</span>
            <span class="modal-opt-price">+15 kr</span>
          </label>
        </div>
      </div>
    `;
  }

  // Menus include 33cl drink
  if (dish.categoryId === 'smash' || dish.categoryId === 'klassiker') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj dryck (33 cl ingår)</div>
        <div class="modal-opts">
          <label class="modal-opt selected">
            <input type="radio" name="optDrink" value="Coca-Cola 33 cl" checked />
            <span class="modal-opt-name">Coca-Cola</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDrink" value="Coca-Cola Zero 33 cl" />
            <span class="modal-opt-name">Coca-Cola Zero</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDrink" value="Fanta 33 cl" />
            <span class="modal-opt-name">Fanta</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDrink" value="Sprite 33 cl" />
            <span class="modal-opt-name">Sprite</span>
          </label>
        </div>
      </div>
    `;
  }

  // Nuggets include dip
  if (dish.id === 'nuggets') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj dippsås (ingår)</div>
        <div class="modal-opts">
          <label class="modal-opt selected">
            <input type="radio" name="optDip" value="Tryffelmajo" checked />
            <span class="modal-opt-name">Tryffelmajo</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDip" value="Srirachamajo" />
            <span class="modal-opt-name">Srirachamajo</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDip" value="Ketchup" />
            <span class="modal-opt-name">Ketchup</span>
          </label>
        </div>
      </div>
    `;
  }

  // Dippsåser selection
  if (dish.id === 'dips') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj smak</div>
        <div class="modal-opts">
          <label class="modal-opt selected">
            <input type="radio" name="optDip" value="Tryffelmajo" checked />
            <span class="modal-opt-name">Tryffelmajo</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDip" value="Srirachamajo" />
            <span class="modal-opt-name">Srirachamajo</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDip" value="Ketchup" />
            <span class="modal-opt-name">Ketchup</span>
          </label>
        </div>
      </div>
    `;
  }

  // Drycker flavor
  if (dish.id === 'drink') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj smak</div>
        <div class="modal-opts">
          <label class="modal-opt selected">
            <input type="radio" name="optDrink" value="Coca-Cola 33 cl" checked />
            <span class="modal-opt-name">Coca-Cola</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDrink" value="Coca-Cola Zero 33 cl" />
            <span class="modal-opt-name">Coca-Cola Zero</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDrink" value="Fanta 33 cl" />
            <span class="modal-opt-name">Fanta</span>
          </label>
          <label class="modal-opt">
            <input type="radio" name="optDrink" value="Sprite 33 cl" />
            <span class="modal-opt-name">Sprite</span>
          </label>
        </div>
      </div>
    `;
  }

  optionsContainer.innerHTML = optionsHTML;

  // Listeners inside options
  optionsContainer.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
      // update selected styling for radios
      if (input.type === 'radio') {
        const group = optionsContainer.querySelectorAll(`input[name="${input.name}"]`);
        group.forEach(r => r.closest('.modal-opt').classList.remove('selected'));
        input.closest('.modal-opt').classList.add('selected');
      } else if (input.type === 'checkbox') {
        input.closest('.modal-opt').classList.toggle('selected', input.checked);
      }
      updateModalAddPrice();
    });
  });

  updateModalAddPrice();
  modal.classList.add('open');
}

function updateModalAddPrice() {
  if (!activeModalItem) return;
  let unitPrice = activeModalItem.price;

  const dMeat = document.getElementById('optDoubleMeat');
  if (dMeat && dMeat.checked) unitPrice += 35;

  const gFree = document.getElementById('optGlutenFree');
  if (gFree && gFree.checked) unitPrice += 15;

  const total = unitPrice * modalQuantity;
  const priceEl = document.getElementById('modalAddPrice');
  if (priceEl) priceEl.textContent = `${total} kr`;
}

function initModals() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('modalClose');
  const minusBtn = document.getElementById('modalMinus');
  const plusBtn = document.getElementById('modalPlus');
  const addBtn = document.getElementById('modalAddBtn');

  if (!modal) return;

  closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  minusBtn.addEventListener('click', () => {
    if (modalQuantity > 1) {
      modalQuantity--;
      document.getElementById('modalQty').textContent = modalQuantity;
      updateModalAddPrice();
    }
  });

  plusBtn.addEventListener('click', () => {
    modalQuantity++;
    document.getElementById('modalQty').textContent = modalQuantity;
    updateModalAddPrice();
  });

  addBtn.addEventListener('click', () => {
    if (!activeModalItem) return;

    const dMeat = document.getElementById('optDoubleMeat');
    const gFree = document.getElementById('optGlutenFree');
    const drinkEl = document.querySelector('input[name="optDrink"]:checked');
    const dipEl = document.querySelector('input[name="optDip"]:checked');

    const mods = [];
    let extraCost = 0;

    if (dMeat && dMeat.checked) {
      mods.push('Dubbelkött (+35 kr)');
      extraCost += 35;
    }
    if (gFree && gFree.checked) {
      mods.push('Glutenfritt brioche (+15 kr)');
      extraCost += 15;
    }
    if (drinkEl) {
      mods.push(drinkEl.value);
    }
    if (dipEl) {
      mods.push(`Dipp: ${dipEl.value}`);
    }

    const itemKey = `${activeModalItem.id}-${mods.join('|')}`;
    const unitPrice = activeModalItem.price + extraCost;

    const existing = cart.find(ci => ci.key === itemKey);
    if (existing) {
      existing.qty += modalQuantity;
    } else {
      cart.push({
        key: itemKey,
        id: activeModalItem.id,
        name: activeModalItem.name,
        price: unitPrice,
        qty: modalQuantity,
        mods: mods
      });
    }

    saveCart();
    updateCartUI();
    modal.classList.remove('open');
    showToast(`Tillagd: ${activeModalItem.name}`);
  });
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Badge
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = totalCount;
    badge.classList.toggle('visible', totalCount > 0);
  }

  // Desktop sidebar
  const cartEmpty = document.getElementById('cartEmpty');
  const cartList = document.getElementById('cartList');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');
  const btnKassa = document.getElementById('btnKassa');

  if (cartList) {
    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = 'flex';
      cartList.innerHTML = '';
      if (btnKassa) btnKassa.disabled = true;
    } else {
      if (cartEmpty) cartEmpty.style.display = 'none';
      if (btnKassa) btnKassa.disabled = false;
      cartList.innerHTML = renderCartLines(cart);
    }
    if (cartSubtotal) cartSubtotal.textContent = `${totalPrice} kr`;
    if (cartTotal) cartTotal.textContent = `${totalPrice} kr`;
  }

  // Mobile trigger & drawer
  const mobileTrigger = document.getElementById('mobileCartTrigger');
  const mobileCount = document.getElementById('mobileCartCount');
  const mobileTotal = document.getElementById('mobileCartTotal');
  const drawerList = document.getElementById('drawerCartItems');
  const drawerTotal = document.getElementById('drawerTotal');

  if (mobileTrigger) {
    mobileTrigger.classList.toggle('has-items', totalCount > 0);
    if (mobileCount) mobileCount.textContent = `${totalCount} st`;
    if (mobileTotal) mobileTotal.textContent = `${totalPrice} kr`;
  }
  if (drawerList) {
    drawerList.innerHTML = cart.length === 0 ? '<p style="padding:24px;text-align:center;color:var(--ink-muted);">Varukorgen är tom</p>' : renderCartLines(cart);
    if (drawerTotal) drawerTotal.textContent = `${totalPrice} kr`;
  }
}

function renderCartLines(items) {
  return items.map(item => `
    <div class="cart-line" data-key="${item.key}">
      <div class="cart-line-qty">
        <button type="button" class="qty-btn" onclick="changeQty('${item.key}', -1)">&minus;</button>
        <span class="qty-num">${item.qty}</span>
        <button type="button" class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
      </div>
      <div class="cart-line-info">
        <div class="cart-line-name">${item.name}</div>
        ${item.mods.length > 0 ? `<div class="cart-line-mods">${item.mods.join(' · ')}</div>` : ''}
      </div>
      <div class="cart-line-price">${item.price * item.qty} kr</div>
    </div>
  `).join('');
}

window.changeQty = function(key, delta) {
  const item = cart.find(ci => ci.key === key);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(ci => ci.key !== key);
  }

  saveCart();
  updateCartUI();
};

function initMobileDrawer() {
  const trigger = document.getElementById('mobileCartTrigger');
  if (trigger) {
    trigger.addEventListener('click', () => {
      openCheckoutModal();
    });
  }
}

window.setPayMethod = function(method) {
  const tabSwish = document.getElementById('tabSwish');
  const tabWhatsApp = document.getElementById('tabWhatsApp');
  const swishBox = document.getElementById('swishContainer');
  const waBox = document.getElementById('whatsappContainer');

  if (method === 'swish') {
    if (tabSwish) tabSwish.classList.add('active');
    if (tabWhatsApp) tabWhatsApp.classList.remove('active');
    if (swishBox) swishBox.style.display = 'flex';
    if (waBox) waBox.style.display = 'none';
  } else {
    if (tabSwish) tabSwish.classList.remove('active');
    if (tabWhatsApp) tabWhatsApp.classList.add('active');
    if (swishBox) swishBox.style.display = 'none';
    if (waBox) waBox.style.display = 'block';
  }
};

function initCheckout() {
  const btnKassa = document.getElementById('btnKassa');
  const checkoutModal = document.getElementById('checkoutModal');
  const btnCancel = document.getElementById('btnCancelCheckout');
  const btnSend = document.getElementById('btnSendOrder');
  const btnSwish = document.getElementById('btnSimulateSwish');

  if (!checkoutModal) return;

  window.openCheckoutModal = function() {
    if (cart.length === 0) {
      showToast('Din varukorg är tom');
      return;
    }

    const listEl = document.getElementById('checkoutItemsList');
    const totalEl = document.getElementById('checkoutTotalAmount');
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const ref = 'ISHAK-' + Math.floor(1000 + Math.random() * 9000);
    const refEl = document.getElementById('swishOrderRef');
    if (refEl) refEl.textContent = ref;

    listEl.innerHTML = cart.map(item => `
      <div class="checkout-item">
        <div>
          <div class="checkout-item-name">${item.qty}× ${item.name}</div>
          ${item.mods.length > 0 ? `<div class="checkout-item-mods">${item.mods.join(' · ')}</div>` : ''}
        </div>
        <span class="checkout-item-price">${item.price * item.qty} kr</span>
      </div>
    `).join('');

    totalEl.textContent = `${totalPrice} kr`;
    setPayMethod('swish');
    checkoutModal.classList.add('open');
  };

  if (btnKassa) btnKassa.addEventListener('click', openCheckoutModal);

  if (btnCancel) {
    btnCancel.addEventListener('click', () => checkoutModal.classList.remove('open'));
  }

  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) checkoutModal.classList.remove('open');
  });

  // SWISH SIMULATION
  if (btnSwish) {
    btnSwish.addEventListener('click', () => {
      const nameInput = document.getElementById('orderName');
      const timeSelect = document.getElementById('orderTime');
      const notesInput = document.getElementById('orderNotes');

      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        showToast('Vänligen ange ditt namn för avhämtning');
        return;
      }

      const time = timeSelect.value;
      const notes = notesInput ? notesInput.value.trim() : '';
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const ref = document.getElementById('swishOrderRef')?.textContent || ('ISHAK-' + Math.floor(1000 + Math.random() * 9000));

      btnSwish.classList.add('processing');
      btnSwish.innerHTML = '<span>Ansluter till Swish...</span>';

      setTimeout(() => {
        btnSwish.classList.remove('processing');
        btnSwish.classList.add('success');
        btnSwish.innerHTML = '<span>✓ Betalning godkänd (' + totalPrice + ' kr)</span>';

        const orderData = {
          id: ref,
          name: name,
          time: time,
          notes: notes,
          items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price, mods: i.mods })),
          total: totalPrice,
          payment: 'Swish Direkt',
          date: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
        };

        try {
          sessionStorage.setItem('ishaks_last_order', JSON.stringify(orderData));
        } catch (e) {}

        cart = [];
        saveCart();
        updateCartUI();

        setTimeout(() => {
          checkoutModal.classList.remove('open');
          window.location.href = 'tack.html';
        }, 600);
      }, 700);
    });
  }

  // WHATSAPP DISPATCH
  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const nameInput = document.getElementById('orderName');
      const timeSelect = document.getElementById('orderTime');
      const notesInput = document.getElementById('orderNotes');

      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        showToast('Vänligen ange ditt namn för avhämtning');
        return;
      }

      const time = timeSelect.value;
      const notes = notesInput.value.trim();
      const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const ref = document.getElementById('swishOrderRef')?.textContent || ('ISHAK-' + Math.floor(1000 + Math.random() * 9000));

      let text = `*NY BESTÄLLNING [${ref}] — ISHAK'S SMASH BURGER*\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `*Kund:* ${name}\n`;
      text += `*Upphämtning:* ${time}\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
      text += `*BESTÄLLNING:*\n`;

      cart.forEach((item, idx) => {
        text += `${idx + 1}. *${item.qty}× ${item.name}* (${item.price * item.qty} kr)\n`;
        if (item.mods.length > 0) {
          text += `   ↳ _${item.mods.join(', ')}_\n`;
        }
      });

      text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `*TOTALT:* ${totalPrice} kr\n`;
      text += `*Betalsätt:* Vid luckan / Swish vid hämtning\n`;

      if (notes) {
        text += `\n*Önskemål:* ${notes}\n`;
      }
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `Beställning lagd via hemsidan.`;

      const orderData = {
        id: ref,
        name: name,
        time: time,
        notes: notes,
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price, mods: i.mods })),
        total: totalPrice,
        payment: 'WhatsApp / Vid luckan',
        date: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
      };

      try {
        sessionStorage.setItem('ishaks_last_order', JSON.stringify(orderData));
      } catch (e) {}

      // Clear cart
      cart = [];
      saveCart();
      updateCartUI();
      checkoutModal.classList.remove('open');

      // Dispatch WhatsApp & redirect
      const waUrl = `https://wa.me/46705491132?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
      window.location.href = 'tack.html';
    });
  }
}

// Global click to close nav
document.addEventListener('click', (e) => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navLinks.contains(e.target) && !hamburger?.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  }
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}
