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

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  syncStoreSettingsToPage();
  if (document.getElementById('menuMain')) {
    initMenuPage();
  }
  updateCartUI();

  window.addEventListener('storage', (e) => {
    if (typeof IshakStore !== 'undefined' && e.key === IshakStore.KEYS.SETTINGS) {
      syncStoreSettingsToPage();
    }
  });
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
}

let isManualScroll = false;
let manualScrollTimer = null;

function getActiveMenu() {
  if (typeof IshakStore !== 'undefined') {
    return IshakStore.getMenu(typeof MENU !== 'undefined' ? MENU : []);
  }
  return typeof MENU !== 'undefined' ? MENU : [];
}

function getNextOrderId() {
  if (typeof IshakStore === 'undefined') {
    return '#ISHAK-' + Math.floor(1000 + Math.random() * 9000);
  }
  const orders = IshakStore.getOrders();
  let maxNum = 1026;
  orders.forEach(o => {
    const n = parseInt((o.id || '').replace(/\D/g, ''), 10);
    if (!isNaN(n) && n >= maxNum) maxNum = n;
  });
  return `#${maxNum + 1}`;
}

function syncStoreSettingsToPage() {
  if (typeof IshakStore === 'undefined') return;
  const s = IshakStore.getSettings();
  const timeNote = document.querySelector('.cart-time-note');
  if (timeNote) timeNote.textContent = `Klar inom ca ${s.waitTime || '15–20 min'}`;
  const swishEl = document.getElementById('swishNumberDisplay');
  if (swishEl && s.swish) swishEl.textContent = s.swish;
  const recEl = document.getElementById('swishRecipientDisplay');
  if (recEl && s.name) recEl.textContent = s.name;
  const copyLbl = document.getElementById('btnCopySwishLabel');
  if (copyLbl && s.swish) copyLbl.textContent = `Kopiera Swish-nummer (${s.swish})`;

  document.querySelectorAll('[data-store-swish]').forEach(el => {
    if (s.swish) el.textContent = s.swish;
  });
  document.querySelectorAll('[data-store-phone]').forEach(el => {
    if (s.phone) {
      el.textContent = s.phone;
      if (el.tagName === 'A') el.href = 'tel:' + s.phone.replace(/\s+/g, '');
    }
  });
  document.querySelectorAll('[data-store-address]').forEach(el => {
    if (s.address) el.textContent = s.address;
  });
}

function initMenuPage() {
  renderCategoryTabs();
  renderMenuSections();
  syncStoreSettingsToPage();
  setupMenuScrollSpy();
  initModals();
  initMobileDrawer();
  initCheckout();

  window.addEventListener('storage', (e) => {
    if (typeof IshakStore === 'undefined') return;
    if (e.key === IshakStore.KEYS.MENU || e.key === IshakStore.KEYS.SETTINGS) {
      renderMenuSections();
      syncStoreSettingsToPage();
    }
  });

  window.addEventListener('focus', () => {
    renderMenuSections();
    syncStoreSettingsToPage();
  });
}

function updateActiveCategoryTab(catId) {
  const tabs = document.querySelectorAll('.cat-tab');
  let activeBtn = null;
  tabs.forEach(btn => {
    const isMatch = btn.dataset.cat === catId;
    btn.classList.toggle('active', isMatch);
    if (isMatch) activeBtn = btn;
  });
  if (activeBtn) {
    activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function renderCategoryTabs() {
  const tabsContainer = document.getElementById('categoryTabs');
  const catalog = getActiveMenu();
  if (!tabsContainer || !catalog.length) return;

  tabsContainer.innerHTML = catalog.map((cat, idx) => `
    <button type="button" class="cat-tab ${idx === 0 ? 'active' : ''}" data-cat="${cat.id}">
      ${cat.label}
    </button>
  `).join('');

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-tab');
    if (!btn) return;
    const catId = btn.dataset.cat;
    updateActiveCategoryTab(catId);

    const target = document.getElementById(`cat-sec-${catId}`);
    if (target) {
      isManualScroll = true;
      clearTimeout(manualScrollTimer);
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 58;
      const tabsH = tabsContainer.offsetHeight || 50;
      const topOffset = target.getBoundingClientRect().top + window.pageYOffset - (navH + tabsH + 8);
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' });
      manualScrollTimer = setTimeout(() => {
        isManualScroll = false;
      }, 700);
    }
  });
}

function setupMenuScrollSpy() {
  const sections = Array.from(document.querySelectorAll('.menu-section'));
  if (!sections.length) return;

  function onScroll() {
    if (isManualScroll) return;

    // Check if scrolled near the bottom of the page
    const scrollPos = window.innerHeight + window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - 60;
    if (scrollPos >= maxScroll) {
      const last = sections[sections.length - 1];
      if (last) updateActiveCategoryTab(last.id.replace('cat-sec-', ''));
      return;
    }

    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 58;
    const tabsEl = document.getElementById('categoryTabs');
    const tabsH = tabsEl ? tabsEl.offsetHeight : 50;
    const threshold = navH + tabsH + 20;

    let currentCat = null;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top <= threshold) {
        currentCat = sections[i].id.replace('cat-sec-', '');
      } else {
        break;
      }
    }

    if (currentCat) {
      updateActiveCategoryTab(currentCat);
    } else if (sections[0]) {
      updateActiveCategoryTab(sections[0].id.replace('cat-sec-', ''));
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function renderMenuSections() {
  const menuMain = document.getElementById('menuMain');
  const catalog = getActiveMenu();
  if (!menuMain || !catalog.length) return;

  const settings = typeof IshakStore !== 'undefined' ? IshakStore.getSettings() : { acceptOrders: true };
  const pausedBanner = settings.acceptOrders === false
    ? `<div class="orders-paused-banner"><strong>Onlinebeställning är tillfälligt pausad.</strong> Kontakta oss på ${settings.phone || '070-549 11 32'} eller besök luckan.</div>`
    : '';

  menuMain.innerHTML = pausedBanner + catalog.map(cat => `
    <section class="menu-section" id="cat-sec-${cat.id}">
      <h2 class="menu-section-title">${cat.label}</h2>
      ${cat.desc ? `<p class="menu-section-desc">${cat.desc}</p>` : ''}
      <div class="dish-grid">
        ${cat.items.map(dish => {
          const isPaused = dish.active === false;
          return `
          <div class="dish-card ${isPaused ? 'paused' : ''}" data-dish-id="${dish.id}">
            <img src="${dish.img}" alt="${dish.name}" class="dish-card-img" loading="lazy" />
            <div class="dish-card-body">
              ${isPaused ? '<span class="dish-paused-badge">Tillfälligt slut</span>' : ''}
              <h3 class="dish-card-name">${dish.name}</h3>
              <p class="dish-card-desc">${dish.desc}</p>
              <div class="dish-card-footer">
                <span class="dish-price">${dish.price} kr</span>
                <button type="button" class="dish-add-btn" data-dish-id="${dish.id}" ${isPaused ? 'disabled' : ''}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>${isPaused ? 'Slut' : 'Lägg till'}</span>
                </button>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </section>
  `).join('');

  if (!menuMain.dataset.bound) {
    menuMain.dataset.bound = '1';
    menuMain.addEventListener('click', (e) => {
      const card = e.target.closest('.dish-card');
      if (!card || card.classList.contains('paused')) return;
      const s = typeof IshakStore !== 'undefined' ? IshakStore.getSettings() : { acceptOrders: true };
      if (s.acceptOrders === false) {
        showToast('Onlinebeställning är tillfälligt pausad');
        return;
      }
      const dishId = card.dataset.dishId;
      const dish = findDish(dishId);
      if (dish) openProductModal(dish);
    });
  }
}

function findDish(id) {
  const catalog = getActiveMenu();
  for (const cat of catalog) {
    const found = cat.items.find(i => i.id === id);
    if (found) return { ...found, categoryId: cat.id };
  }
  return null;
}

function openProductModal(dish) {
  activeModalItem = dish;
  modalQuantity = 1;

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

  if (dish.categoryId === 'smash' && typeof PROTEINS_LIST !== 'undefined') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj protein</div>
        <div class="modal-opts">
          ${PROTEINS_LIST.map((prot, idx) => `
            <label class="modal-opt ${idx === 0 ? 'selected' : ''}">
              <input type="radio" name="optProtein" value="${prot}" ${idx === 0 ? 'checked' : ''} />
              <span class="modal-opt-name">${prot}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  if ((dish.categoryId === 'smash' || dish.id === 'barn') && typeof EXTRAS !== 'undefined') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Extra hungrig? &amp; Alternativ</div>
        <div class="modal-opts">
          ${EXTRAS.map(ex => `
            <label class="modal-opt">
              <input type="checkbox" class="opt-extra-cb" data-id="${ex.id}" data-label="${ex.label}" data-price="${ex.price}" />
              <span class="modal-opt-name">${ex.label}</span>
              <span class="modal-opt-price">${ex.price > 0 ? '+' + ex.price + ' kr' : 'Ingår'}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  if ((dish.categoryId === 'smash' || dish.categoryId === 'klassiker') && typeof DRINKS_LIST !== 'undefined') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj dryck (33 cl ingår)</div>
        <div class="modal-opts">
          ${DRINKS_LIST.map((dr, idx) => `
            <label class="modal-opt ${idx === 0 ? 'selected' : ''}">
              <input type="radio" name="optDrink" value="${dr}" ${idx === 0 ? 'checked' : ''} />
              <span class="modal-opt-name">${dr.replace(' 33 cl', '')}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (dish.id === 'nuggets' && typeof DIPS_LIST !== 'undefined') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj dip (ingår)</div>
        <div class="modal-opts">
          ${DIPS_LIST.map((dip, idx) => `
            <label class="modal-opt ${idx === 0 ? 'selected' : ''}">
              <input type="radio" name="optDip" value="${dip}" ${idx === 0 ? 'checked' : ''} />
              <span class="modal-opt-name">${dip}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (dish.id === 'dips' && typeof DIPS_LIST !== 'undefined') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj smak</div>
        <div class="modal-opts">
          ${DIPS_LIST.map((dip, idx) => `
            <label class="modal-opt ${idx === 0 ? 'selected' : ''}">
              <input type="radio" name="optDip" value="${dip}" ${idx === 0 ? 'checked' : ''} />
              <span class="modal-opt-name">${dip}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (dish.id === 'drink' && typeof DRINKS_LIST !== 'undefined') {
    optionsHTML += `
      <div class="modal-opt-group">
        <div class="modal-opt-label">Välj dricka</div>
        <div class="modal-opts">
          ${DRINKS_LIST.map((dr, idx) => `
            <label class="modal-opt ${idx === 0 ? 'selected' : ''}">
              <input type="radio" name="optDrink" value="${dr}" ${idx === 0 ? 'checked' : ''} />
              <span class="modal-opt-name">${dr.replace(' 33 cl', '')}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  optionsContainer.innerHTML = optionsHTML;

  optionsContainer.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', () => {
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

  document.querySelectorAll('.opt-extra-cb:checked').forEach(cb => {
    unitPrice += parseInt(cb.dataset.price || '0', 10);
  });

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

    const proteinEl = document.querySelector('input[name="optProtein"]:checked');
    const drinkEl = document.querySelector('input[name="optDrink"]:checked');
    const dipEl = document.querySelector('input[name="optDip"]:checked');

    const mods = [];
    let extraCost = 0;

    if (proteinEl) {
      mods.push(proteinEl.value);
    }
    document.querySelectorAll('.opt-extra-cb:checked').forEach(cb => {
      const p = parseInt(cb.dataset.price || '0', 10);
      mods.push(p > 0 ? `${cb.dataset.label} (+${p} kr)` : cb.dataset.label);
      extraCost += p;
    });
    if (drinkEl) {
      mods.push(drinkEl.value);
    }
    if (dipEl) {
      mods.push(`Dip: ${dipEl.value}`);
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

  const mobileTrigger = document.getElementById('mobileCartTrigger');
  const mobileCount = document.getElementById('mobileCartCount');
  const mobileTotal = document.getElementById('mobileCartTotal');

  if (mobileTrigger) {
    mobileTrigger.classList.toggle('has-items', totalCount > 0);
    if (mobileCount) mobileCount.textContent = `${totalCount} st`;
    if (mobileTotal) mobileTotal.textContent = `${totalPrice} kr`;
  }
}

function renderCartLines(items) {
  return items.map((item, idx) => `
    <div class="cart-line">
      <div class="cart-line-qty">
        <button type="button" class="qty-btn" onclick="changeQtyIdx(${idx}, -1)" aria-label="Minska">&minus;</button>
        <span class="qty-num">${item.qty}</span>
        <button type="button" class="qty-btn" onclick="changeQtyIdx(${idx}, 1)" aria-label="Öka">+</button>
      </div>
      <div class="cart-line-info">
        <div class="cart-line-name">${escapeHtml(item.name)}</div>
        ${item.mods.length > 0 ? `<div class="cart-line-mods">${escapeHtml(item.mods.join(' · '))}</div>` : ''}
      </div>
      <div class="cart-line-price">${item.price * item.qty} kr</div>
    </div>
  `).join('');
}

window.changeQtyIdx = function(idx, delta) {
  if (!cart[idx]) return;

  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }

  saveCart();
  updateCartUI();

  const checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal && checkoutModal.classList.contains('open')) {
    if (cart.length === 0) {
      checkoutModal.classList.remove('open');
      showToast('Varukorgen är tom');
    } else if (typeof window.refreshCheckoutSummary === 'function') {
      window.refreshCheckoutSummary();
    }
  }
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
  const btnPayAtPickup = document.getElementById('btnPayAtPickup');
  const btnSwish = document.getElementById('btnSimulateSwish');
  const btnCopySwish = document.getElementById('btnCopySwish');

  if (!checkoutModal) return;

  let activeCheckoutRef = '#1027';

  window.refreshCheckoutSummary = function() {
    const s = typeof IshakStore !== 'undefined'
      ? IshakStore.getSettings()
      : { name: "Ishak's Smash Burger", swish: '123 082 44 41' };

    const listEl = document.getElementById('checkoutItemsList');
    const totalEl = document.getElementById('checkoutTotalAmount');
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const cleanNumRef = activeCheckoutRef.replace(/^#/, '');
    const swishMsg = `Order ${cleanNumRef}`;

    const refEl = document.getElementById('swishOrderRef');
    if (refEl) refEl.textContent = swishMsg;

    const swishDisplay = document.getElementById('swishNumberDisplay');
    if (swishDisplay && s.swish) swishDisplay.textContent = s.swish;
    const recDisplay = document.getElementById('swishRecipientDisplay');
    if (recDisplay && s.name) recDisplay.textContent = s.name;
    const copyLbl = document.getElementById('btnCopySwishLabel');
    if (copyLbl && s.swish) copyLbl.textContent = `Kopiera Swish-nummer (${s.swish})`;

    const qrWrap = document.getElementById('swishQrWrap');
    if (qrWrap && typeof qrcode === 'function') {
      const payload = typeof IshakStore !== 'undefined' && IshakStore.buildSwishQrPayload
        ? IshakStore.buildSwishQrPayload(s.swish, totalPrice, swishMsg, 0)
        : `C1230824441;${totalPrice};${encodeURIComponent(swishMsg)};0`;
      const q = qrcode(0, 'M');
      q.addData(payload);
      q.make();
      qrWrap.innerHTML = q.createSvgTag(4, 0);
    }

    listEl.innerHTML = cart.map((item, idx) => `
      <div class="checkout-item">
        <div class="checkout-item-left">
          <div class="cart-line-qty">
            <button type="button" class="qty-btn" onclick="changeQtyIdx(${idx}, -1)" aria-label="Minska">&minus;</button>
            <span class="qty-num">${item.qty}</span>
            <button type="button" class="qty-btn" onclick="changeQtyIdx(${idx}, 1)" aria-label="Öka">+</button>
          </div>
          <div>
            <div class="checkout-item-name">${escapeHtml(item.name)}</div>
            ${item.mods.length > 0 ? `<div class="checkout-item-mods">${escapeHtml(item.mods.join(' · '))}</div>` : ''}
          </div>
        </div>
        <span class="checkout-item-price">${item.price * item.qty} kr</span>
      </div>
    `).join('');

    totalEl.textContent = `${totalPrice} kr`;
  };

  window.openCheckoutModal = function() {
    if (cart.length === 0) {
      showToast('Din varukorg är tom');
      return;
    }
    const s = typeof IshakStore !== 'undefined' ? IshakStore.getSettings() : { acceptOrders: true, swish: '123 082 44 41' };
    if (s.acceptOrders === false) {
      showToast('Onlinebeställning är tillfälligt pausad');
      return;
    }

    if (btnSwish) {
      btnSwish.classList.remove('processing', 'success');
      btnSwish.innerHTML = '<span>Skicka beställning</span>';
    }

    activeCheckoutRef = getNextOrderId();
    window.refreshCheckoutSummary();
    setPayMethod('swish');
    checkoutModal.classList.add('open');
  };

  if (btnCopySwish) {
    btnCopySwish.addEventListener('click', () => {
      const s = typeof IshakStore !== 'undefined' ? IshakStore.getSettings() : { swish: '123 082 44 41' };
      const rawNum = (s.swish || '123 082 44 41').replace(/\s+/g, '');
      const lbl = document.getElementById('btnCopySwishLabel');
      const done = () => {
        if (lbl) lbl.textContent = `Kopierat: ${s.swish || '123 082 44 41'}`;
        showToast('Swish-nummer kopierat');
        setTimeout(() => {
          if (lbl) lbl.textContent = `Kopiera Swish-nummer (${s.swish || '123 082 44 41'})`;
        }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(rawNum).then(done).catch(done);
      } else {
        done();
      }
    });
  }

  function getValidatedCheckoutDetails() {
    const nameInput = document.getElementById('orderName');
    const phoneInput = document.getElementById('orderPhone');
    const timeSelect = document.getElementById('orderTime');
    const notesInput = document.getElementById('orderNotes');

    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      showToast('Vänligen ange ditt namn för avhämtning');
      return null;
    }

    const phone = phoneInput ? phoneInput.value.trim() : '';
    if (phoneInput && phone.length < 7) {
      phoneInput.focus();
      showToast('Vänligen ange ditt mobilnummer');
      return null;
    }

    return {
      name,
      phone,
      time: timeSelect.value,
      notes: notesInput ? notesInput.value.trim() : '',
      totalPrice: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
      ref: activeCheckoutRef || getNextOrderId()
    };
  }

  function commitPlacedOrder(details, paymentMethod, paymentStatus) {
    const timeStr = new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    const itemsCopy = cart.map(i => ({ name: i.name, qty: i.qty, price: i.price, mods: i.mods }));

    const orderData = {
      id: details.ref,
      name: details.name,
      phone: details.phone,
      time: details.time,
      notes: details.notes,
      items: itemsCopy,
      total: details.totalPrice,
      payment: paymentMethod,
      paymentStatus: paymentStatus || 'unverified',
      date: timeStr
    };

    try {
      sessionStorage.setItem('ishaks_last_order', JSON.stringify(orderData));
    } catch (e) {}

    if (typeof IshakStore !== 'undefined') {
      IshakStore.addOrder({
        id: details.ref,
        customer: details.name,
        phone: details.phone,
        tid: timeStr,
        pickupTime: details.time,
        kanal: paymentMethod,
        paymentStatus: paymentStatus || 'unverified',
        total: details.totalPrice,
        status: 'new',
        elapsedSec: 0,
        note: details.notes,
        items: itemsCopy
      });
    }

    cart = [];
    saveCart();
    updateCartUI();
  }

  function navigateToOrderTracker(ref) {
    const num = String(ref || '').replace(/^#/, '');
    window.location.href = `tack.html?order=${encodeURIComponent(num)}`;
  }

  if (btnKassa) btnKassa.addEventListener('click', openCheckoutModal);

  if (btnCancel) {
    btnCancel.addEventListener('click', () => checkoutModal.classList.remove('open'));
  }

  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) checkoutModal.classList.remove('open');
  });

  if (btnSwish) {
    btnSwish.addEventListener('click', () => {
      const details = getValidatedCheckoutDetails();
      if (!details) return;

      btnSwish.classList.add('processing');
      btnSwish.innerHTML = '<span>Skickar till köket...</span>';

      setTimeout(() => {
        commitPlacedOrder(details, 'Swish', 'unverified');
        checkoutModal.classList.remove('open');
        navigateToOrderTracker(details.ref);
      }, 350);
    });
  }

  if (btnPayAtPickup) {
    btnPayAtPickup.addEventListener('click', () => {
      const details = getValidatedCheckoutDetails();
      if (!details) return;

      commitPlacedOrder(details, 'Vid luckan', 'at_pickup');
      checkoutModal.classList.remove('open');
      navigateToOrderTracker(details.ref);
    });
  }

  if (btnSend) {
    btnSend.addEventListener('click', () => {
      const details = getValidatedCheckoutDetails();
      if (!details) return;

      const s = typeof IshakStore !== 'undefined' ? IshakStore.getSettings() : { swish: '123 082 44 41', phone: '46705491132' };
      const waTarget = typeof IshakStore !== 'undefined' ? IshakStore.formatSwedishWhatsApp(s.phone) : '46705491132';

      let text = `*NY BESTÄLLNING [${details.ref}] — ISHAK'S SMASH BURGER*\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `*Kund:* ${details.name}\n`;
      text += `*Mobil:* ${details.phone}\n`;
      text += `*Upphämtning:* ${details.time}\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
      text += `*BESTÄLLNING:*\n`;

      cart.forEach((item, idx) => {
        text += `${idx + 1}. *${item.qty}× ${item.name}* (${item.price * item.qty} kr)\n`;
        if (item.mods.length > 0) {
          text += `   ↳ _${item.mods.join(', ')}_\n`;
        }
      });

      text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `*TOTALT:* ${details.totalPrice} kr\n`;
      text += `*Betalsätt:* Vid luckan (Kort / Swish ${s.swish || '123 082 44 41'})\n`;

      if (details.notes) {
        text += `\n*Önskemål:* ${details.notes}\n`;
      }

      commitPlacedOrder(details, 'WhatsApp', 'at_pickup');
      checkoutModal.classList.remove('open');

      const waUrl = `https://wa.me/${waTarget}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
      navigateToOrderTracker(details.ref);
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
