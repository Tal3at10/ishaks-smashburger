window.ISHAKS_MENU = {
  restaurant: {
    name: "Ishak's Smash Burger",
    address: "Hantverkargatan 5, 781 71 Borlänge",
    district: "Södra Backa",
    phone: "070-549 11 32",
    whatsapp: "46705491132",
    pickupWait: "ca 15 min",
    deliveryFee: 39,
    rating: "4,7"
  },

  categories: [
    "Smash Burger Menyer",
    "Barnmeny",
    "Sides & Tillbehör",
    "Dippsåser",
    "Drycker 33 cl"
  ],

  sizes: [
    { id: "enkel", label: "Enkelmeny (Standard)", addPrice: 0 },
    { id: "dubbel", label: "Dubbelkött (+extra puck & cheddar)", addPrice: 35 }
  ],

  breads: [
    { id: "brioche", label: "Färskt briochebröd", addPrice: 0 },
    { id: "glutenfritt", label: "Glutenfritt briochebröd", addPrice: 15 }
  ],

  dietaryOptions: [
    { id: "no-onion", label: "Utan lök" },
    { id: "no-jalapeno", label: "Utan jalapeños" },
    { id: "no-sauce", label: "Såsen vid sidan av" }
  ],

  includedDrinks: [
    "Coca-Cola Original 33 cl",
    "Coca-Cola Zero 33 cl",
    "Fanta Orange 33 cl",
    "Fanta Exotic 33 cl",
    "Pepsi 33 cl",
    "Pepsi Max 33 cl",
    "Trocadero 33 cl",
    "Trocadero Zero 33 cl",
    "Sprite 33 cl",
    "Loka Naturell 33 cl",
    "Loka Citron 33 cl",
    "Ramlösa Granatäpple 33 cl",
    "Festis Apelsin",
    "Festis Päron"
  ],

  mealExtras: [
    { id: "ex-tryffel", label: "Extra Tryffelmajo", price: 10 },
    { id: "ex-sriracha", label: "Extra Srirachamajo", price: 10 },
    { id: "ex-chilicheese", label: "Chili Cheese (6 st)", price: 30 },
    { id: "ex-fries", label: "Extra Pommes Frites", price: 35 }
  ],

  items: [
    {
      id: "sb-1",
      category: "Smash Burger Menyer",
      name: "Smash Burger 1",
      price: 150,
      badge: "Bästsäljare",
      customizable: true,
      hasSizeOption: true,
      desc: "Steks direkt med färsk jalapeño i köttet. Toppas med smält cheddar, srirachamajo, karamelliserad lök och krispiga chili cheese i rostat briochebröd. Pommes & 33 cl dryck ingår.",
      image: "assets/images/smash-burger-1-real.jpg"
    },
    {
      id: "sb-2",
      category: "Smash Burger Menyer",
      name: "Smash Burger 2",
      price: 150,
      badge: "Favorit",
      customizable: true,
      hasSizeOption: true,
      desc: "Riktig tryffelmayo, smält cheddar, söt karamelliserad lök och knaprig rostad lök i nyrostat briochebröd. Serveras som komplett meny med pommes & 33 cl dryck.",
      image: "assets/images/smash-burger-2.jpg"
    },
    {
      id: "sb-3",
      category: "Smash Burger Menyer",
      name: "Smash Burger 3",
      price: 150,
      badge: "",
      customizable: true,
      hasSizeOption: true,
      desc: "Smashed med lök direkt på hällen, smält cheddar, rökig barbequesås, syrlig picklad gurka och rostad lök i briochebröd. Pommes & 33 cl dryck ingår.",
      image: "assets/images/smash-burger-3.jpg"
    },
    {
      id: "sb-4",
      category: "Smash Burger Menyer",
      name: "Smash Burger 4",
      price: 150,
      badge: "Klassiker",
      customizable: true,
      hasSizeOption: true,
      desc: "Tidlös street-klassiker med smält cheddar, krispig sallad, finskivad rödlök, ketchup och senap i mjukt briochebröd. Pommes & 33 cl dryck ingår.",
      image: "assets/images/smash-burger-4-real.jpg"
    },
    {
      id: "sb-5",
      category: "Smash Burger Menyer",
      name: "Smash Burger 5",
      price: 150,
      badge: "Het & Rökig",
      customizable: true,
      hasSizeOption: true,
      desc: "Kombination av len tryffelmayo och rökig barbequesås, smält cheddar, karamelliserad lök och picklad jalapeño i briochebröd. Pommes & 33 cl dryck ingår.",
      image: "assets/images/smash-burger-5.jpg"
    },
    {
      id: "sb-6",
      category: "Smash Burger Menyer",
      name: "Smash Burger 6",
      price: 150,
      badge: "",
      customizable: true,
      hasSizeOption: true,
      desc: "Fräsch balans med husets tryffelmayo, smält cheddar, krispig sallad och syrlig picklad rödlök i rostat briochebröd. Pommes & 33 cl dryck ingår.",
      image: "assets/images/smash-burger-6-real.jpg"
    },

    {
      id: "barn-burger",
      category: "Barnmeny",
      name: "Barn Burger",
      price: 110,
      badge: "Inkl. pommes & dryck",
      customizable: true,
      hasSizeOption: false,
      desc: "Barnvänlig smashburgare i briochebröd med smält cheddar, tryffelmayo, sallad och ketchup. Serveras med pommes och valfri dryck.",
      image: "assets/images/barn-burger.jpg"
    },
    {
      id: "chicken-nuggets",
      category: "Barnmeny",
      name: "Chicken Nuggets (8 st)",
      price: 110,
      badge: "Inkl. pommes & dryck",
      customizable: true,
      hasSizeOption: false,
      desc: "Åtta frasiga, gyllene kycklingnuggets serverade med krispiga pommes frites och valfri dryck.",
      image: "assets/images/chicken-nuggets.jpg"
    },

    {
      id: "side-fries",
      category: "Sides & Tillbehör",
      name: "Pommes Frites",
      price: 35,
      badge: "",
      customizable: false,
      desc: "Gyllene, krispiga pommes frites lätt saltade och serverade rykande varma.",
      image: "assets/images/fries.jpg"
    },
    {
      id: "side-chilicheese",
      category: "Sides & Tillbehör",
      name: "Chili Cheese (6 st)",
      price: 30,
      badge: "Populär",
      customizable: false,
      desc: "Sex frasigt friterade chili cheese-bites med het cheddarost och grön jalapeño.",
      image: "assets/images/chili-cheese.jpg"
    },

    {
      id: "dip-tryffel",
      category: "Dippsåser",
      name: "Tryffelmajo",
      price: 10,
      badge: "",
      customizable: false,
      desc: "Krämig husets majonnäs med fyllig svarttryffelsmak.",
      image: "assets/images/dips.jpg"
    },
    {
      id: "dip-sriracha",
      category: "Dippsåser",
      name: "Srirachamajo",
      price: 10,
      badge: "Het",
      customizable: false,
      desc: "Kryddig majonnäs med chilihetta från sriracha.",
      image: "assets/images/dips.jpg"
    },
    {
      id: "dip-ketchup",
      category: "Dippsåser",
      name: "Ketchup",
      price: 10,
      badge: "",
      customizable: false,
      desc: "Klassisk tomatketchup i portionsbägare.",
      image: "assets/images/dips.jpg"
    },

    {
      id: "dr-cola",
      category: "Drycker 33 cl",
      name: "Coca-Cola Original",
      price: 15,
      badge: "",
      customizable: false,
      desc: "Iskall burk, 33 cl.",
      image: "assets/images/drinks.jpg"
    },
    {
      id: "dr-colazero",
      category: "Drycker 33 cl",
      name: "Coca-Cola Zero",
      price: 15,
      badge: "",
      customizable: false,
      desc: "Sockerfri cola på burk, 33 cl.",
      image: "assets/images/drinks.jpg"
    },
    {
      id: "dr-trocadero",
      category: "Drycker 33 cl",
      name: "Trocadero / Trocadero Zero",
      price: 15,
      badge: "Svensk klassiker",
      customizable: false,
      desc: "Original eller Zero, 33 cl kylskåpskall burk.",
      image: "assets/images/drinks.jpg"
    },
    {
      id: "dr-fanta",
      category: "Drycker 33 cl",
      name: "Fanta Orange / Exotic",
      price: 15,
      badge: "",
      customizable: false,
      desc: "Apelsin eller exotisk fruktsmak, 33 cl.",
      image: "assets/images/drinks.jpg"
    },
    {
      id: "dr-pepsi",
      category: "Drycker 33 cl",
      name: "Pepsi / Pepsi Max",
      price: 15,
      badge: "",
      customizable: false,
      desc: "Pepsi Original eller sockerfri Pepsi Max, 33 cl.",
      image: "assets/images/drinks.jpg"
    },
    {
      id: "dr-mineral",
      category: "Drycker 33 cl",
      name: "Loka / Ramlösa",
      price: 15,
      badge: "",
      customizable: false,
      desc: "Loka Naturell/Citron eller Ramlösa Granatäpple/Svartvinbär, 33 cl.",
      image: "assets/images/drinks.jpg"
    },
    {
      id: "dr-festis",
      category: "Drycker 33 cl",
      name: "Festis",
      price: 15,
      badge: "",
      customizable: false,
      desc: "Apelsin, Päron eller Hallon.",
      image: "assets/images/drinks.jpg"
    }
  ]
};
