// Shared Demo State Store — Bridges Storefront (menu.html), Admin, and KDS via localStorage
window.IshakStore = (function () {
  const KEYS = {
    ORDERS: 'ishaks_store_orders_v1',
    MENU: 'ishaks_store_menu_v1',
    SETTINGS: 'ishaks_store_settings_v1',
    HOURS: 'ishaks_store_hours_v1',
    CATERING: 'ishaks_store_catering_v1',
  };

  const DEFAULT_ORDERS = [
    {
      id: '#1026',
      customer: 'Marcus K.',
      phone: '0701234567',
      tid: '14:42',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'Swish Direkt',
      total: 470,
      status: 'cooking',
      elapsedSec: 140,
      note: 'Extra krispiga pommes',
      items: [
        { name: 'Smash Burger 1', qty: 2, price: 180, mods: ['Kött', 'Extra kött (+35 kr)', 'Extra cheddar (+10 kr)'] },
        { name: 'Fries', qty: 2, price: 35, mods: [] },
        { name: 'Dricka 33 cl', qty: 2, price: 20, mods: ['Trocadero 33 cl'] }
      ]
    },
    {
      id: '#1025',
      customer: 'Sara Lind',
      phone: '0739876543',
      tid: '14:38',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'Swish Direkt',
      total: 175,
      status: 'cooking',
      elapsedSec: 380,
      note: 'Allergi: Glutenallergi — viktigt med rent stekbord',
      items: [
        { name: 'Smash Burger 2', qty: 1, price: 135, mods: ['Halloumi', 'Glutenfritt bröd (Alternativ)'] },
        { name: 'Chili cheese, 6 st', qty: 1, price: 40, mods: [] }
      ]
    },
    {
      id: '#1024',
      customer: 'Johan Bergström',
      phone: '0705544332',
      tid: '14:32',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'Swish Direkt',
      total: 595,
      status: 'ready',
      elapsedSec: 740,
      note: '',
      items: [
        { name: 'Smash Burger 3', qty: 3, price: 135, mods: ['Kött', 'Srirachamajo'] },
        { name: 'Chicken Nuggets (8 st)', qty: 1, price: 110, mods: ['Dip: Tryffelmajo'] },
        { name: 'Dricka 33 cl', qty: 4, price: 20, mods: ['Coca-Cola Zero 33 cl'] }
      ]
    },
    {
      id: '#1023',
      customer: 'Anders E.',
      phone: '0722334455',
      tid: '14:22',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'WhatsApp',
      total: 135,
      status: 'new',
      elapsedSec: 45,
      note: 'Utan senap',
      items: [
        { name: 'Smash Burger 4', qty: 1, price: 135, mods: ['Kyckling'] }
      ]
    },
    {
      id: '#1022',
      customer: 'Emma N.',
      phone: '0731122334',
      tid: '14:05',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'Foodora',
      total: 220,
      status: 'klar',
      elapsedSec: 0,
      note: '',
      items: [
        { name: 'Barn Burger', qty: 1, price: 110, mods: [] },
        { name: 'Chicken Nuggets (8 st)', qty: 1, price: 110, mods: ['Dip: Ketchup'] }
      ]
    },
    {
      id: '#1021',
      customer: 'Oskar H.',
      phone: '0709988776',
      tid: '13:52',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'WhatsApp',
      total: 135,
      status: 'klar',
      elapsedSec: 0,
      note: 'Utan lök',
      items: [
        { name: 'Smash Burger 1', qty: 1, price: 135, mods: ['Kött'] }
      ]
    },
    {
      id: '#1020',
      customer: 'Lukas P.',
      phone: '0725566778',
      tid: '13:41',
      pickupTime: 'Om 30 minuter',
      kanal: 'WhatsApp',
      total: 340,
      status: 'klar',
      elapsedSec: 0,
      note: '',
      items: [
        { name: 'Smash Burger 5', qty: 2, price: 135, mods: ['Kött'] },
        { name: 'Fries', qty: 2, price: 35, mods: [] }
      ]
    },
    {
      id: '#1019',
      customer: 'Frida W.',
      phone: '0704455667',
      tid: '13:28',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'Foodora',
      total: 135,
      status: 'klar',
      elapsedSec: 0,
      note: '',
      items: [
        { name: 'Smash Burger 4', qty: 1, price: 135, mods: ['Kött', 'Glutenfritt bröd'] }
      ]
    },
    {
      id: '#1018',
      customer: 'Kalle B.',
      phone: '0701122998',
      tid: '12:48',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'Foodora',
      total: 405,
      status: 'klar',
      elapsedSec: 0,
      note: '',
      items: [
        { name: 'Smash Burger 1', qty: 3, price: 135, mods: ['Kött'] }
      ]
    },
    {
      id: '#1017',
      customer: 'Maja S.',
      phone: '0728899001',
      tid: '12:33',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'Swish Direkt',
      total: 290,
      status: 'klar',
      elapsedSec: 0,
      note: '',
      items: [
        { name: 'Smash Burger 2', qty: 2, price: 135, mods: ['Kyckling'] },
        { name: 'Dip', qty: 2, price: 10, mods: ['Tryffelmajo'] }
      ]
    },
    {
      id: '#1016',
      customer: 'Viktor L.',
      phone: '0703344556',
      tid: '12:20',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'WhatsApp',
      total: 215,
      status: 'klar',
      elapsedSec: 0,
      note: '',
      items: [
        { name: 'Smash Burger 3', qty: 1, price: 135, mods: ['Kött'] },
        { name: 'Chili cheese, 6 st', qty: 2, price: 40, mods: [] }
      ]
    },
    {
      id: '#1015',
      customer: 'Nils A.',
      phone: '0707788990',
      tid: '12:11',
      pickupTime: 'Snarast (ca 15-20 min)',
      kanal: 'Foodora',
      total: 220,
      status: 'klar',
      elapsedSec: 0,
      note: '',
      items: [
        { name: 'Chicken Nuggets (8 st)', qty: 2, price: 110, mods: ['Dip: Srirachamajo'] }
      ]
    }
  ];

  const DEFAULT_SETTINGS = {
    name: "Ishak's Smash Burger",
    address: 'Hantverkargatan 5',
    zipCity: '781 71 Borlänge',
    phone: '+46 70 549 11 32',
    swish: '123 082 44 41',
    instagram: '@ishaks_smashburger',
    waitTime: '15–20 min',
    orderType: 'Avhämtning (Hämta-själv)',
    acceptOrders: true,
    introMsg: "Tack för din beställning hos Ishak's Smash Burger! Vi bekräftar din beställning inom kort.",
    outroMsg: 'Vi ses vid luckan på Hantverkargatan 5. Swish: 123 082 44 41'
  };

  const DEFAULT_HOURS = [
    { day: 'Måndag', open: true, start: '11:00', end: '15:00', note: '' },
    { day: 'Tisdag', open: true, start: '11:00', end: '15:00', note: '' },
    { day: 'Onsdag', open: true, start: '11:00', end: '15:00', note: '' },
    { day: 'Torsdag', open: true, start: '11:00', end: '15:00', note: '' },
    { day: 'Fredag', open: true, start: '11:00', end: '15:00', note: '' },
    { day: 'Lördag', open: false, start: '11:00', end: '15:00', note: 'Varierande öppettider' },
    { day: 'Söndag', open: false, start: '', end: '', note: '' }
  ];

  const DEFAULT_CATERING = [
    { id: 'cat-3', title: 'SSAB Borlänge — Skiftlunch', meta: '12 dec 2026 · 60 personer · Borlänge', phone: '0703322110', status: 'new' },
    { id: 'cat-2', title: 'Tunabyggen — Avdelningslunch', meta: '18 dec 2026 · 45 personer · Södra Backa', phone: '0734455667', status: 'new' },
    { id: 'cat-1', title: 'ICA Maxi Borlänge — Personalträff', meta: '15 jan 2027 · 50 personer · Borlänge', phone: '0708899112', status: 'contacted' }
  ];

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback));
    } catch (e) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function write(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function cloneMenuFromDefault(baseMenu) {
    const src = baseMenu || (typeof MENU !== 'undefined' ? MENU : []);
    return src.map(cat => ({
      ...cat,
      items: (cat.items || []).map(it => ({
        active: true,
        ...it
      }))
    }));
  }

  function getOrders() {
    if (!localStorage.getItem(KEYS.ORDERS)) {
      write(KEYS.ORDERS, DEFAULT_ORDERS);
    }
    return read(KEYS.ORDERS, DEFAULT_ORDERS);
  }

  function saveOrders(orders) {
    write(KEYS.ORDERS, orders);
  }

  function addOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    return orders;
  }

  function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();
    const target = orders.find(o => o.id === orderId);
    if (target) {
      target.status = newStatus;
      saveOrders(orders);
    }
    return orders;
  }

  function getMenu(baseMenu) {
    const fallback = cloneMenuFromDefault(baseMenu);
    if (!localStorage.getItem(KEYS.MENU)) {
      if (fallback.length) write(KEYS.MENU, fallback);
      return fallback;
    }
    return read(KEYS.MENU, fallback);
  }

  function saveMenu(menu) {
    write(KEYS.MENU, menu);
  }

  function getSettings() {
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      write(KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    return read(KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  function saveSettings(settings) {
    write(KEYS.SETTINGS, settings);
  }

  function getHours() {
    if (!localStorage.getItem(KEYS.HOURS)) {
      write(KEYS.HOURS, DEFAULT_HOURS);
    }
    return read(KEYS.HOURS, DEFAULT_HOURS);
  }

  function saveHours(hours) {
    write(KEYS.HOURS, hours);
  }

  function getCatering() {
    if (!localStorage.getItem(KEYS.CATERING)) {
      write(KEYS.CATERING, DEFAULT_CATERING);
    }
    return read(KEYS.CATERING, DEFAULT_CATERING);
  }

  function saveCatering(list) {
    write(KEYS.CATERING, list);
  }

  function addCatering(entry) {
    const list = getCatering();
    list.unshift({
      id: 'cat-' + Date.now(),
      status: 'new',
      ...entry
    });
    saveCatering(list);
    return list;
  }

  function resetAll() {
    Object.values(KEYS).forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  function formatSwedishWhatsApp(phone) {
    const digits = (phone || '').replace(/\D/g, '');
    if (digits.startsWith('0')) return '46' + digits.slice(1);
    return digits || '46705491132';
  }

  return {
    KEYS,
    getOrders,
    saveOrders,
    addOrder,
    updateOrderStatus,
    getMenu,
    saveMenu,
    getSettings,
    saveSettings,
    getHours,
    saveHours,
    getCatering,
    saveCatering,
    addCatering,
    resetAll,
    formatSwedishWhatsApp
  };
})();
