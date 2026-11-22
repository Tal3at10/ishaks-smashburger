(function () {
  "use strict";

  const DATA = window.ISHAKS_MENU;
  const ITEMS = DATA.items;

  const state = {
    category: "Alla",
    search: "",
    fulfillment: "pickup",
    pickupTime: "Snarast (ca 15 min)",
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    kitchenNote: "",
    paymentMethod: "swish",
    cart: [], // { key, id, name, unitPrice, qty, sizeLabel, drink, extras, note }
    kitchenDone: false,
    ownerOrdersPerDay: 14,
    activeModalItem: null,
    modalQty: 1
  };

  const els = {
    heroLiveStatus: document.getElementById("heroLiveStatus"),
    heroLiveStatusText: document.getElementById("heroLiveStatusText"),
    catNav: document.getElementById("catNav"),
    menuSearch: document.getElementById("menuSearch"),
    menuSections: document.getElementById("menuSections"),
    cartCard: document.getElementById("cartCard"),
    headerCartBtn: document.getElementById("headerCartBtn"),
    headerCartText: document.getElementById("headerCartText"),
    mobileCartBar: document.getElementById("mobileCartBar"),
    mobileCartCount: document.getElementById("mobileCartCount"),
    mobileCartTotal: document.getElementById("mobileCartTotal"),
    mobileCartBtn: document.getElementById("mobileCartBtn"),
    productModal: document.getElementById("productModal"),
    pmBody: document.getElementById("pmBody"),
    pmClose: document.getElementById("pmClose"),
    checkoutModal: document.getElementById("checkoutModal"),
    cmBody: document.getElementById("cmBody"),
    cmClose: document.getElementById("cmClose"),
    ownerModal: document.getElementById("ownerModal"),
    omBody: document.getElementById("omBody"),
    omClose: document.getElementById("omClose"),
    openOwnerModalBtn: document.getElementById("openOwnerModalBtn"),
    cateringForm: document.getElementById("cateringForm"),
    cateringFeedback: document.getElementById("cateringFeedback")
  };

  const esc = (v) => String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const fmt = (n) => `${Math.round(n).toLocaleString("sv-SE")} kr`;

  function updateLiveStatus() {
    if (!els.heroLiveStatus || !els.heroLiveStatusText) return;
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Stockholm",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).formatToParts(now);

      const get = (type) => parts.find((p) => p.type === type)?.value;
      const day = get("weekday");
      const hour = parseInt(get("hour"), 10);
      const min = parseInt(get("minute"), 10);
      const totalMin = hour * 60 + min;

      const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(day);

      els.heroLiveStatus.classList.remove("is-open", "is-soon", "is-closed");

      if (isWeekday) {
        if (totalMin >= 660 && totalMin < 900) {
          els.heroLiveStatus.classList.add("is-open");
          els.heroLiveStatusText.textContent = "Öppet nu · Stänger 15:00";
        } else if (totalMin >= 600 && totalMin < 660) {
          els.heroLiveStatus.classList.add("is-soon");
          els.heroLiveStatusText.textContent = "Öppnar kl. 11:00";
        } else if (totalMin >= 900) {
          const nextDay = day === "Fri" ? "mån" : "imorgon";
          els.heroLiveStatus.classList.add("is-closed");
          els.heroLiveStatusText.textContent = `Stängt nu · Öppnar ${nextDay} 11:00`;
        } else {
          els.heroLiveStatus.classList.add("is-closed");
          els.heroLiveStatusText.textContent = "Öppnar idag kl. 11:00";
        }
      } else if (day === "Sat") {
        els.heroLiveStatus.classList.add("is-soon");
        els.heroLiveStatusText.textContent = "Lördag · Se Instagram för öppettider";
      } else {
        els.heroLiveStatus.classList.add("is-closed");
        els.heroLiveStatusText.textContent = "Söndag · Endast event & catering";
      }
    } catch (e) {
      els.heroLiveStatusText.textContent = "Mån–Fre 11:00–15:00";
    }
  }

  function getItemQty(itemId) {
    return state.cart
      .filter((entry) => entry.id === itemId)
      .reduce((sum, entry) => sum + entry.qty, 0);
  }

  function getCartTotals() {
    const count = state.cart.reduce((sum, entry) => sum + entry.qty, 0);
    const subtotal = state.cart.reduce((sum, entry) => sum + entry.unitPrice * entry.qty, 0);
    const fee = state.fulfillment === "delivery" && count > 0 ? DATA.restaurant.deliveryFee : 0;
    return { count, subtotal, fee, total: subtotal + fee };
  }

  function addToCart(entry) {
    const existing = state.cart.find((c) => c.key === entry.key);
    if (existing) {
      existing.qty += entry.qty;
    } else {
      state.cart.push(entry);
    }
    renderMenu();
    renderCart();
  }

  function stepCartKey(key, delta) {
    const idx = state.cart.findIndex((c) => c.key === key);
    if (idx === -1) return;
    state.cart[idx].qty += delta;
    if (state.cart[idx].qty <= 0) {
      state.cart.splice(idx, 1);
    }
    renderMenu();
    renderCart();
  }

  function renderCategoryNav() {
    const cats = ["Alla", ...DATA.categories];
    els.catNav.innerHTML = cats
      .map(
        (cat) =>
          `<button type="button" class="cat-pill ${state.category === cat ? "active" : ""}" data-cat="${esc(cat)}">${esc(cat)}</button>`
      )
      .join("");
  }

  function renderMenu() {
    const q = state.search.trim().toLowerCase();
    const visibleCats = state.category === "Alla" ? DATA.categories : [state.category];
    let renderedCount = 0;

    const html = visibleCats
      .map((cat) => {
        const rows = ITEMS.filter((item) => {
          if (item.category !== cat) return false;
          if (!q) return true;
          return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
        });

        if (!rows.length) return "";
        renderedCount += rows.length;

        const cardsHtml = rows
          .map((item) => {
            const inCartQty = getItemQty(item.id);
            const tagHtml = item.badge ? `<span class="dish-tag">${esc(item.badge)}</span>` : "";
            const hintHtml = item.customizable ? `<span class="dish-hint">Välj dryck &amp; tillval</span>` : "";
            const badgeBtn =
              inCartQty > 0
                ? `<span class="dish-qty-pill">${inCartQty}</span>`
                : `<span class="dish-add-btn" aria-hidden="true">+</span>`;

            return `
              <button type="button" class="dish-card ${inCartQty > 0 ? "in-cart" : ""}" data-item-id="${esc(item.id)}">
                <div class="dish-body">
                  <div class="dish-top">
                    <div class="dish-title-row">
                      <span class="dish-name">${esc(item.name)}</span>
                      ${tagHtml}
                    </div>
                    <p class="dish-desc">${esc(item.desc)}</p>
                  </div>
                  <div class="dish-bottom">
                    <span class="dish-price tabular">${fmt(item.price)}</span>
                    ${hintHtml}
                  </div>
                </div>
                <div class="dish-thumb-wrap">
                  <img src="${esc(item.image)}" alt="${esc(item.name)}" class="dish-thumb" />
                  ${badgeBtn}
                </div>
              </button>`;
          })
          .join("");

        return `
          <div class="menu-group">
            <div class="menu-group-header">
              <h2 class="menu-group-title">${esc(cat)}</h2>
              <span class="menu-group-count">${rows.length} st</span>
            </div>
            <div class="dish-grid">${cardsHtml}</div>
          </div>`;
      })
      .join("");

    els.menuSections.innerHTML =
      renderedCount > 0
        ? html
        : `<div class="cart-empty"><strong>Inga rätter matchade "${esc(state.search)}"</strong><p>Prova att rensa sökfältet eller välj en annan kategori.</p></div>`;
  }

  function openProductModal(itemId) {
    const item = ITEMS.find((x) => x.id === itemId);
    if (!item) return;

    if (!item.customizable) {
      addToCart({
        key: item.id,
        id: item.id,
        name: item.name,
        unitPrice: item.price,
        qty: 1,
        sizeLabel: "",
        drink: "",
        extras: [],
        note: ""
      });
      return;
    }

    state.activeModalItem = item;
    state.modalQty = 1;

    const sizeHtml = item.hasSizeOption
      ? `
        <div class="pm-group">
          <div class="pm-group-head">
            <h3>Storlek</h3>
            <span class="pm-req">Obligatorisk</span>
          </div>
          <div class="pm-options-list">
            ${DATA.sizes
              .map(
                (sz, idx) => `
              <label class="pm-opt">
                <span class="pm-opt-left">
                  <input type="radio" name="pmSize" value="${esc(sz.id)}" data-add="${sz.addPrice}" ${idx === 0 ? "checked" : ""} />
                  <span>${esc(sz.label)}</span>
                </span>
                <span class="pm-opt-price tabular">${sz.addPrice > 0 ? `+${fmt(sz.addPrice)}` : "Ingår"}</span>
              </label>`
              )
              .join("")}
          </div>
        </div>`
      : "";

    const breadHtml = item.category === "Smash Burger Menyer" && DATA.breads
      ? `
        <div class="pm-group">
          <div class="pm-group-head">
            <h3>Val av bröd</h3>
            <span class="pm-req">Obligatorisk</span>
          </div>
          <div class="pm-options-list">
            ${DATA.breads
              .map(
                (br, idx) => `
              <label class="pm-opt">
                <span class="pm-opt-left">
                  <input type="radio" name="pmBread" value="${esc(br.id)}" data-label="${esc(br.label)}" data-add="${br.addPrice}" ${idx === 0 ? "checked" : ""} />
                  <span>${esc(br.label)}</span>
                </span>
                <span class="pm-opt-price tabular">${br.addPrice > 0 ? `+${fmt(br.addPrice)}` : "Ingår"}</span>
              </label>`
              )
              .join("")}
          </div>
        </div>`
      : "";

    const dietaryHtml = item.category === "Smash Burger Menyer" && DATA.dietaryOptions
      ? `
        <div class="pm-group">
          <div class="pm-group-head">
            <h3>Anpassa burgaren</h3>
            <span class="pm-req">Valfritt</span>
          </div>
          <div class="pm-options-list">
            ${DATA.dietaryOptions
              .map(
                (opt) => `
              <label class="pm-opt">
                <span class="pm-opt-left">
                  <input type="checkbox" name="pmDietary" value="${esc(opt.label)}" />
                  <span>${esc(opt.label)}</span>
                </span>
                <span class="pm-opt-price tabular">0 kr</span>
              </label>`
              )
              .join("")}
          </div>
        </div>`
      : "";

    const drinkHtml = `
      <div class="pm-group">
        <div class="pm-group-head">
          <h3>Välj dryck (33 cl)</h3>
          <span class="pm-req">Ingår i menyn</span>
        </div>
        <div class="pm-drink-grid">
          ${DATA.includedDrinks
            .map(
              (dr, idx) => `
            <label class="pm-opt">
              <span class="pm-opt-left">
                <input type="radio" name="pmDrink" value="${esc(dr)}" ${idx === 0 ? "checked" : ""} />
                <span>${esc(dr)}</span>
              </span>
            </label>`
            )
            .join("")}
        </div>
      </div>`;

    const extrasHtml = `
      <div class="pm-group">
        <div class="pm-group-head">
          <h3>Extra dipp &amp; tillbehör</h3>
          <span class="pm-req">Valfritt</span>
        </div>
        <div class="pm-options-list">
          ${DATA.mealExtras
            .map(
              (ex) => `
            <label class="pm-opt">
              <span class="pm-opt-left">
                <input type="checkbox" name="pmExtra" value="${esc(ex.label)}" data-price="${ex.price}" />
                <span>${esc(ex.label)}</span>
              </span>
              <span class="pm-opt-price tabular">+${fmt(ex.price)}</span>
            </label>`
            )
            .join("")}
        </div>
      </div>`;

    els.pmBody.innerHTML = `
      <img src="${esc(item.image)}" alt="${esc(item.name)}" class="pm-hero-img" />
      <div class="pm-content">
        <div class="pm-head">
          <h2 id="pmTitle">${esc(item.name)}</h2>
          <div class="pm-price-base tabular">${fmt(item.price)}</div>
          <p class="pm-desc">${esc(item.desc)}</p>
        </div>
        ${sizeHtml}
        ${breadHtml}
        ${dietaryHtml}
        ${drinkHtml}
        ${extrasHtml}
        <div class="pm-group">
          <div class="pm-group-head">
            <h3>Övriga önskemål till köket</h3>
            <span class="pm-req">Valfritt</span>
          </div>
          <input type="text" id="pmNote" class="pm-note-input" placeholder="T.ex. extra hårt stekt, såsen separat..." />
        </div>
      </div>
      <div class="pm-footer">
        <div class="pm-qty">
          <button type="button" id="pmQtyDec">−</button>
          <span id="pmQtyVal" class="tabular">1</span>
          <button type="button" id="pmQtyInc">+</button>
        </div>
        <button type="button" id="pmAddBtn" class="btn-primary full-width">Lägg till · ${fmt(item.price)}</button>
      </div>`;

    els.productModal.hidden = false;
    document.body.style.overflow = "hidden";

    const updateModalPrice = () => {
      const sizeInput = els.pmBody.querySelector('input[name="pmSize"]:checked');
      const sizeAdd = sizeInput ? Number(sizeInput.dataset.add) : 0;
      const breadInput = els.pmBody.querySelector('input[name="pmBread"]:checked');
      const breadAdd = breadInput ? Number(breadInput.dataset.add) : 0;
      const extrasAdd = Array.from(els.pmBody.querySelectorAll('input[name="pmExtra"]:checked')).reduce(
        (sum, cb) => sum + Number(cb.dataset.price),
        0
      );
      const unit = item.price + sizeAdd + breadAdd + extrasAdd;
      document.getElementById("pmQtyVal").textContent = String(state.modalQty);
      document.getElementById("pmAddBtn").textContent = `Lägg till · ${fmt(unit * state.modalQty)}`;
    };

    els.pmBody.querySelectorAll('input[name="pmSize"], input[name="pmBread"], input[name="pmExtra"]').forEach((inp) => {
      inp.addEventListener("change", updateModalPrice);
    });

    document.getElementById("pmQtyDec").addEventListener("click", () => {
      if (state.modalQty > 1) {
        state.modalQty -= 1;
        updateModalPrice();
      }
    });

    document.getElementById("pmQtyInc").addEventListener("click", () => {
      state.modalQty += 1;
      updateModalPrice();
    });

    document.getElementById("pmAddBtn").addEventListener("click", () => {
      const sizeInput = els.pmBody.querySelector('input[name="pmSize"]:checked');
      const sizeObj = sizeInput ? DATA.sizes.find((s) => s.id === sizeInput.value) : null;
      const sizeAdd = sizeObj ? sizeObj.addPrice : 0;
      const sizeLabel = sizeObj && sizeObj.addPrice > 0 ? "Dubbelkött" : "";

      const breadInput = els.pmBody.querySelector('input[name="pmBread"]:checked');
      const breadAdd = breadInput ? Number(breadInput.dataset.add) : 0;
      const breadLabel = breadInput && breadAdd > 0 ? "Glutenfritt bröd" : "";

      const dietaryChecked = Array.from(els.pmBody.querySelectorAll('input[name="pmDietary"]:checked')).map(
        (cb) => cb.value
      );

      const drinkInput = els.pmBody.querySelector('input[name="pmDrink"]:checked');
      const drink = drinkInput ? drinkInput.value : "";

      const checkedExtras = Array.from(els.pmBody.querySelectorAll('input[name="pmExtra"]:checked'));
      const extras = checkedExtras.map((cb) => cb.value);
      const extrasAdd = checkedExtras.reduce((sum, cb) => sum + Number(cb.dataset.price), 0);

      const note = document.getElementById("pmNote").value.trim();
      const unitPrice = item.price + sizeAdd + breadAdd + extrasAdd;
      const key = [item.id, sizeLabel, breadLabel, drink, extras.join(","), dietaryChecked.join(","), note].join("|");

      let displayName = item.name;
      if (sizeLabel) displayName += ` (${sizeLabel})`;

      addToCart({
        key,
        id: item.id,
        name: displayName,
        unitPrice,
        qty: state.modalQty,
        sizeLabel,
        breadLabel,
        dietary: dietaryChecked,
        drink,
        extras,
        note
      });

      closeModal(els.productModal);
    });
  }

  function renderCart() {
    const { count, subtotal, fee, total } = getCartTotals();

    els.headerCartText.textContent = count > 0 ? `Varukorg · ${fmt(total)}` : "Varukorg";

    if (count > 0 && window.innerWidth <= 920) {
      els.mobileCartBar.hidden = false;
      document.body.classList.add("has-cart");
      els.mobileCartCount.textContent = `${count} ${count === 1 ? "vara" : "varor"} · ${state.fulfillment === "pickup" ? "Avhämtning" : "Utkörning"}`;
      els.mobileCartTotal.textContent = fmt(total);
    } else {
      els.mobileCartBar.hidden = true;
      document.body.classList.remove("has-cart");
    }

    if (!state.cart.length) {
      els.cartCard.innerHTML = `
        <div class="cart-head">
          <h2>Din beställning</h2>
        </div>
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <strong>Varukorgen är tom</strong>
          <p>Välj en smashburgare eller dryck i menyn för att lägga din beställning.</p>
        </div>`;
      return;
    }

    const itemsHtml = state.cart
      .map((entry) => {
        const metaParts = [];
        if (entry.breadLabel) metaParts.push(entry.breadLabel);
        if (entry.drink) metaParts.push(entry.drink);
        if (entry.extras.length) metaParts.push(entry.extras.join(", "));
        if (entry.dietary && entry.dietary.length) metaParts.push(entry.dietary.join(", "));
        if (entry.note) metaParts.push(`Notering: ${entry.note}`);

        return `
          <div class="cart-item-row">
            <div class="cart-item-info">
              <div class="cart-item-name">${esc(entry.name)}</div>
              ${metaParts.length ? `<div class="cart-item-meta">${esc(metaParts.join(" · "))}</div>` : ""}
            </div>
            <div class="cart-item-controls">
              <span class="cart-item-price tabular">${fmt(entry.unitPrice * entry.qty)}</span>
              <div class="qty-stepper">
                <button type="button" data-step-key="${esc(entry.key)}" data-delta="-1" aria-label="Minska">−</button>
                <span class="tabular">${entry.qty}</span>
                <button type="button" data-step-key="${esc(entry.key)}" data-delta="1" aria-label="Öka">+</button>
              </div>
            </div>
          </div>`;
      })
      .join("");

    let deliveryField = "";
    if (state.fulfillment === "delivery") {
      const burgerCount = state.cart
        .filter((e) => e.id.startsWith("sb-") || e.id.includes("burger"))
        .reduce((sum, e) => sum + e.qty, 0);

      const hintHtml =
        burgerCount < 5
          ? `<div class="corp-delivery-hint">Företagsleverans gäller vid minst 5 menyer (du har ${burgerCount} st). Lägg till ${5 - burgerCount} menyer till för fri lunchleverans till kontoret/bygget.</div>`
          : `<div class="corp-delivery-hint" style="border-style:solid;border-color:#15803D;color:#15803D;background:#F0FDF4;">Minst 5 menyer uppnått (${burgerCount} st) – lunchkörning till företaget ingår.</div>`;

      deliveryField = `
        ${hintHtml}
        <div class="cf-field">
          <label for="cAddress">Företag &amp; leveransadress i Borlänge</label>
          <input type="text" id="cAddress" value="${esc(state.deliveryAddress)}" placeholder="T.ex. ByggPartner AB, Hantverkargatan 12" />
        </div>`;
    }

    const timeSlots = [
      "Snarast (ca 15 min)",
      "11:15 (Lunch)",
      "11:45 (Lunch)",
      "12:15 (Lunch)",
      "12:45 (Lunch)",
      "13:30 (Lunch)",
      "14:15 (Lunch)"
    ];

    els.cartCard.innerHTML = `
      <div class="cart-head">
        <h2>Din beställning (${count})</h2>
        <button type="button" id="clearCartBtn" class="cart-clear-btn">Töm</button>
      </div>
      <div class="cart-items">${itemsHtml}</div>
      <div class="cart-form">
        <div class="cf-field">
          <label for="cPickupTime">${state.fulfillment === "pickup" ? "Tid för avhämtning (Mån–Fre 11–15)" : "Önskad lunchtid för leverans"}</label>
          <select id="cPickupTime">
            ${timeSlots.map((slot) => `<option ${state.pickupTime === slot ? "selected" : ""}>${esc(slot)}</option>`).join("")}
          </select>
        </div>
        ${deliveryField}
        <div class="cf-row-2">
          <div class="cf-field">
            <label for="cName">Ditt namn</label>
            <input type="text" id="cName" value="${esc(state.customerName)}" placeholder="Förnamn" />
          </div>
          <div class="cf-field">
            <label for="cPhone">Mobil (för SMS/Swish)</label>
            <input type="tel" id="cPhone" value="${esc(state.customerPhone)}" placeholder="070-XXX XX XX" />
          </div>
        </div>
        <div class="cf-field">
          <label>Betalsätt</label>
          <div class="pay-toggle">
            <button type="button" class="pay-option ${state.paymentMethod === "swish" ? "active" : ""}" data-pay="swish">Swish</button>
            <button type="button" class="pay-option ${state.paymentMethod === "card" ? "active" : ""}" data-pay="card">Kort / Apple Pay</button>
          </div>
        </div>
        <div class="cart-summary tabular">
          <div class="sum-line"><span>Mat &amp; dryck</span><span>${fmt(subtotal)}</span></div>
          ${fee > 0 ? `<div class="sum-line"><span>Utkörning</span><span>${fmt(fee)}</span></div>` : ""}
          <div class="sum-line"><span>Serviceavgift</span><span>0 kr</span></div>
          <div class="sum-grand"><span>Att betala</span><span>${fmt(total)}</span></div>
        </div>
        <button type="button" id="submitOrderBtn" class="btn-primary full-width">
          ${state.paymentMethod === "swish" ? `Betala med Swish · ${fmt(total)}` : `Betala med kort · ${fmt(total)}`}
        </button>
        <p class="checkout-caption">Direkt till Ishak's Smash Burger utan app-provision</p>
      </div>`;

    els.cartCard.querySelectorAll("[data-step-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        stepCartKey(btn.dataset.stepKey, Number(btn.dataset.delta));
      });
    });

    document.getElementById("clearCartBtn").addEventListener("click", () => {
      state.cart = [];
      renderMenu();
      renderCart();
    });

    document.getElementById("cPickupTime").addEventListener("change", (e) => {
      state.pickupTime = e.target.value;
    });
    document.getElementById("cName").addEventListener("input", (e) => {
      state.customerName = e.target.value;
    });
    document.getElementById("cPhone").addEventListener("input", (e) => {
      state.customerPhone = e.target.value;
    });

    const addrEl = document.getElementById("cAddress");
    if (addrEl) {
      addrEl.addEventListener("input", (e) => {
        state.deliveryAddress = e.target.value;
      });
    }

    els.cartCard.querySelectorAll("[data-pay]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.paymentMethod = btn.dataset.pay;
        renderCart();
      });
    });

    document.getElementById("submitOrderBtn").addEventListener("click", () => {
      openCheckoutModal();
    });
  }

  function openCheckoutModal() {
    const { fee, total } = getCartTotals();
    const orderNum = `ISB-${Math.floor(400 + Math.random() * 500)}`;
    const guestName = state.customerName.trim() || "Gäst i Borlänge";
    const payStatus = state.paymentMethod === "swish" ? "Swish-betalning" : "Kortbetalning";
    const fulfillmentLabel =
      state.fulfillment === "pickup"
        ? `Avhämtning vid vagnen · Hantverkargatan 5 (${state.pickupTime})`
        : `Företagsleverans till ${state.deliveryAddress.trim() || "Borlänge"} (${state.pickupTime})`;

    const orderLines = state.cart.map((e) => {
      const parts = [];
      if (e.breadLabel) parts.push(e.breadLabel);
      if (e.drink) parts.push(e.drink);
      if (e.extras.length) parts.push(e.extras.join(", "));
      if (e.dietary && e.dietary.length) parts.push(e.dietary.join(", "));
      if (e.note) parts.push(`OBS: ${e.note}`);
      return `- ${e.qty}x ${e.name}${parts.length ? ` (${parts.join(", ")})` : ""}`;
    }).join("\n");

    const waOrderMsg = [
      `Hej Ishak! Ny beställning (${orderNum}) från webben:`,
      orderLines,
      `Totalt: ${fmt(total)} (${state.paymentMethod === "swish" ? "Swish" : "Kort"})`,
      `Leveranssätt: ${state.fulfillment === "pickup" ? "Avhämtning vid vagnen" : "Företagsleverans"} (${state.pickupTime})`,
      state.fulfillment === "delivery" && state.deliveryAddress ? `Adress: ${state.deliveryAddress}` : "",
      `Beställare: ${guestName} (${state.customerPhone.trim() || "Telefon saknas"})`
    ].filter(Boolean).join("\n");

    const receiptRows = state.cart
      .map((entry) => {
        const subs = [];
        if (entry.breadLabel) subs.push(entry.breadLabel);
        if (entry.drink) subs.push(entry.drink);
        if (entry.extras.length) subs.push(entry.extras.join(", "));
        if (entry.dietary && entry.dietary.length) subs.push(entry.dietary.join(", "));
        if (entry.note) subs.push(entry.note);
        return `
          <div class="cm-line">
            <div>
              <strong>${entry.qty} × ${esc(entry.name)}</strong>
              ${subs.length ? `<span class="cm-line-sub">${esc(subs.join(" · "))}</span>` : ""}
            </div>
            <span class="tabular"><strong>${fmt(entry.unitPrice * entry.qty)}</strong></span>
          </div>`;
      })
      .join("");

    const kitchenRows = state.cart
      .map((entry) => {
        const subs = [];
        if (entry.breadLabel) subs.push(`Bröd: ${entry.breadLabel}`);
        if (entry.drink) subs.push(`Dryck: ${entry.drink}`);
        if (entry.extras.length) subs.push(`Tillval: ${entry.extras.join(", ")}`);
        if (entry.dietary && entry.dietary.length) subs.push(`Anpassning: ${entry.dietary.join(", ")}`);
        if (entry.note) subs.push(`OBS: ${entry.note}`);
        return `
          <div class="k-row">
            <div><strong>${entry.qty} × ${esc(entry.name)}</strong></div>
            ${subs.length ? `<div class="k-row-sub">${esc(subs.join(" | "))}</div>` : ""}
          </div>`;
      })
      .join("");

    state.kitchenDone = false;

    const swishBox = state.paymentMethod === "swish"
      ? `
        <div class="cm-swish-box">
          <strong>Swish till Ishak's Smash Burger</strong>
          <span>Nummer: <strong>070-549 11 32</strong></span><br />
          <span>Belopp: <strong>${fmt(total)}</strong> · Meddelande: <strong>${esc(orderNum)}</strong></span>
        </div>`
      : "";

    els.cmBody.innerHTML = `
      <div class="cm-split">
        <section class="cm-pane">
          <div class="cm-eyebrow">1. Kundens kvitto i mobilen</div>
          <div class="cm-receipt-status">${esc(payStatus)} · Order #${esc(orderNum)}</div>
          <p style="font-size:13px;color:var(--ink-muted);margin-bottom:12px;">
            <strong style="color:var(--ink);">${esc(guestName)}</strong><br />
            ${esc(fulfillmentLabel)}
          </p>
          <div>${receiptRows}</div>
          ${fee > 0 ? `<div class="cm-line"><span>Utkörning</span><span class="tabular">${fmt(fee)}</span></div>` : ""}
          <div class="cm-total tabular">
            <span>Totalt att betala</span>
            <span>${fmt(total)}</span>
          </div>
          ${swishBox}
          <div class="cm-actions">
            <a href="https://wa.me/46705491132?text=${encodeURIComponent(waOrderMsg)}" target="_blank" rel="noopener" class="btn-wa-action">
              <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <span>Skicka beställning till Ishak på WhatsApp</span>
            </a>
          </div>
        </section>

        <section class="cm-pane kitchen-pane">
          <div class="kitchen-ticket-head">
            <span class="cm-eyebrow" style="margin:0;">2. Köksskärm i foodtrucken</span>
            <span id="kitchenStatusBadge" class="k-badge">INKOMMEN</span>
          </div>
          <div class="k-order-num">#${esc(orderNum)} · ${state.fulfillment === "pickup" ? "AVHÄMTNING" : "FÖRETAGSUTKÖRNING"}</div>
          <div class="k-meta">${esc(guestName)} · ${esc(state.pickupTime)} · 0 kr provision</div>
          <div>${kitchenRows}</div>
          ${state.customerPhone.trim() ? `<div class="k-note">SMS skickas automatiskt till <strong>${esc(state.customerPhone.trim())}</strong> när ordern markeras klar.</div>` : ""}
          <button type="button" id="kitchenDoneBtn" class="k-action-btn">Markera som klar · Skicka SMS</button>
        </section>
      </div>`;

    els.checkoutModal.hidden = false;
    document.body.style.overflow = "hidden";

    const btn = document.getElementById("kitchenDoneBtn");
    const badge = document.getElementById("kitchenStatusBadge");
    btn.addEventListener("click", () => {
      state.kitchenDone = !state.kitchenDone;
      btn.classList.toggle("done", state.kitchenDone);
      badge.classList.toggle("done", state.kitchenDone);
      if (state.kitchenDone) {
        badge.textContent = "KLAR FÖR UTLÄMNING";
        btn.textContent = "Klar · SMS skickat till kund";
      } else {
        badge.textContent = "INKOMMEN";
        btn.textContent = "Markera som klar · Skicka SMS";
      }
    });
  }

  function renderOwnerSavings() {
    const avgTicket = 175;
    const commissionRate = 0.28;

    els.omBody.innerHTML = `
      <div class="om-slider-head">
        <span>Direktbeställningar per öppen dag</span>
        <strong id="omOrderVal" class="tabular">${state.ownerOrdersPerDay} st / dag</strong>
      </div>
      <input type="range" id="omSlider" class="om-slider" min="5" max="50" step="1" value="${state.ownerOrdersPerDay}" />
      <div class="om-stats">
        <div class="om-stat-box">
          <div class="om-stat-lbl">Direkt omsättning / mån</div>
          <div id="omRev" class="om-stat-num tabular">—</div>
          <div class="om-stat-sub">Vid snittorder ${fmt(avgTicket)} (22 dagar/mån)</div>
        </div>
        <div class="om-stat-box accent">
          <div class="om-stat-lbl">Sparat vs appar (28 %)</div>
          <div id="omSaved" class="om-stat-num tabular">—</div>
          <div id="omYear" class="om-stat-sub tabular">— / år rakt i egen kassa</div>
        </div>
      </div>`;

    const slider = document.getElementById("omSlider");
    const update = () => {
      state.ownerOrdersPerDay = Number(slider.value);
      const monthlyRev = state.ownerOrdersPerDay * avgTicket * 22;
      const monthlySaved = monthlyRev * commissionRate;
      document.getElementById("omOrderVal").textContent = `${state.ownerOrdersPerDay} st / dag`;
      document.getElementById("omRev").textContent = fmt(monthlyRev);
      document.getElementById("omSaved").textContent = fmt(monthlySaved);
      document.getElementById("omYear").textContent = `${fmt(monthlySaved * 12)} / år rakt i egen kassa`;
    };
    slider.addEventListener("input", update);
    update();
  }

  function closeModal(modalEl) {
    modalEl.hidden = true;
    document.body.style.overflow = "";
  }

  function bindGlobalEvents() {
    document.querySelectorAll("[data-ful]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.fulfillment = btn.dataset.ful;
        document.querySelectorAll("[data-ful]").forEach((b) => {
          const active = b.dataset.ful === state.fulfillment;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", String(active));
        });
        renderCart();
      });
    });

    els.catNav.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cat]");
      if (!btn) return;
      state.category = btn.dataset.cat;
      renderCategoryNav();
      renderMenu();
    });

    els.menuSearch.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderMenu();
    });

    els.menuSections.addEventListener("click", (e) => {
      const card = e.target.closest("[data-item-id]");
      if (!card) return;
      openProductModal(card.dataset.itemId);
    });

    const scrollToCart = () => {
      document.getElementById("cartSidebar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    els.headerCartBtn.addEventListener("click", scrollToCart);
    els.mobileCartBtn.addEventListener("click", scrollToCart);

    els.pmClose.addEventListener("click", () => closeModal(els.productModal));
    els.cmClose.addEventListener("click", () => closeModal(els.checkoutModal));
    els.omClose.addEventListener("click", () => closeModal(els.ownerModal));

    [els.productModal, els.checkoutModal, els.ownerModal].forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        [els.productModal, els.checkoutModal, els.ownerModal].forEach(closeModal);
      }
    });

    els.openOwnerModalBtn.addEventListener("click", () => {
      renderOwnerSavings();
      els.ownerModal.hidden = false;
      document.body.style.overflow = "hidden";
    });

    window.addEventListener("resize", renderCart);

    els.cateringForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const company = document.getElementById("catCompany").value.trim();
      const guests = document.getElementById("catGuests").value;
      const date = document.getElementById("catDate").value || "Enligt överenskommelse";
      const phone = document.getElementById("catPhone").value.trim();
      const notes = document.getElementById("catNotes").value.trim();

      const msg = [
        `Hej Ishak! Eventförfrågan från ${company}`,
        `Antal gäster: ${guests}`,
        `Önskat datum: ${date}`,
        `Telefon: ${phone}`,
        notes ? `Önskemål: ${notes}` : ""
      ]
        .filter(Boolean)
        .join("\n");

      const waUrl = `https://wa.me/${DATA.restaurant.whatsapp}?text=${encodeURIComponent(msg)}`;
      els.cateringFeedback.textContent = "Förfrågan förberedd – öppnar WhatsApp till 070-549 11 32.";
      window.open(waUrl, "_blank", "noopener");
    });
  }

  function init() {
    updateLiveStatus();
    setInterval(updateLiveStatus, 60000);
    renderCategoryNav();
    renderMenu();
    renderCart();
    bindGlobalEvents();
  }

  init();
})();
