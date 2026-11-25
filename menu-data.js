const MENU = [
  {
    id: 'smash',
    label: 'Smash Burgers',
    desc: 'Pommes och dricka ingår i alla menyer · Välj kött, kyckling eller halloumi',
    items: [
      {
        id: 'sb1',
        name: 'Smash Burger 1',
        desc: 'Steks med jalapeños. Briochebröd, cheddar, srirachamajo, karamelliserad lök, chili cheese.',
        price: 135,
        img: 'assets/images/smash-burger-1-real.jpg',
      },
      {
        id: 'sb2',
        name: 'Smash Burger 2',
        desc: 'Briochebröd, cheddar, tryffelmajo, karamelliserad lök, rostad lök.',
        price: 135,
        img: 'assets/images/smash-burger-3.jpg',
      },
      {
        id: 'sb3',
        name: 'Smash Burger 3',
        desc: 'Steks med lök. Briochebröd, cheddar, barbequesås, picklad gurka, rostad lök.',
        price: 135,
        img: 'assets/images/smash-burger-5.jpg',
      },
      {
        id: 'sb4',
        name: 'Smash Burger 4',
        desc: 'Briochebröd, cheddar, ketchup, senap, sallad, rödlök.',
        price: 135,
        img: 'assets/images/smash-burger-2.jpg',
      },
      {
        id: 'sb5',
        name: 'Smash Burger 5',
        desc: 'Briochebröd, cheddar, tryffelmajo, karamelliserad lök, picklad jalapeño, barbequesås.',
        price: 135,
        img: 'assets/images/smash-burger-5.jpg',
      },
      {
        id: 'sb6',
        name: 'Smash Burger 6',
        desc: 'Briochebröd, cheddar, tryffelmajo, sallad, picklad rödlök.',
        price: 135,
        img: 'assets/images/smash-burger-3.jpg',
      },
    ],
  },
  {
    id: 'klassiker',
    label: 'Barnmeny',
    desc: 'Pommes och dricka ingår',
    items: [
      {
        id: 'barn',
        name: 'Barn Burger',
        desc: 'Briochebröd, kött, cheddar, tryffelmajo, sallad, ketchup.',
        price: 110,
        img: 'assets/images/barn-burger.jpg',
      },
      {
        id: 'nuggets',
        name: 'Chicken Nuggets (8 st)',
        desc: '8 st chicken nuggets med valfri dip, pommes och dricka.',
        price: 110,
        img: 'assets/images/chicken-nuggets.jpg',
      },
    ],
  },
  {
    id: 'smaratter',
    label: 'Sides & Dip',
    desc: 'Extra tillbehör & såser',
    items: [
      {
        id: 'fries',
        name: 'Fries',
        desc: 'Nystekta, krispiga pommes frites.',
        price: 35,
        img: 'assets/images/fries.jpg',
      },
      {
        id: 'chili',
        name: 'Chili cheese, 6 st',
        desc: '6 st frasiga chili cheese med smält ost och jalapeño.',
        price: 40,
        img: 'assets/images/chili-cheese.jpg',
      },
      {
        id: 'dips',
        name: 'Dip',
        desc: 'Välj mellan Tryffelmajo, Srirachamajo eller Ketchup.',
        price: 10,
        img: 'assets/images/dips.jpg',
      },
    ],
  },
  {
    id: 'drycker',
    label: 'Drycker',
    desc: null,
    items: [
      {
        id: 'drink',
        name: 'Dricka 33 cl',
        desc: 'Coca-Cola, Coca-Cola Zero, Fanta Orange, Sprite, Trocadero, Loka.',
        price: 20,
        img: 'assets/images/drinks.jpg',
      },
    ],
  },
];

const PROTEINS_LIST = [
  'Kött',
  'Kyckling',
  'Halloumi'
];

const EXTRAS = [
  { id: 'extra_meat', label: 'Extra kött', price: 35 },
  { id: 'extra_chicken', label: 'Extra kyckling', price: 35 },
  { id: 'extra_halloumi', label: 'Extra halloumi', price: 35 },
  { id: 'extra_cheddar', label: 'Extra cheddar', price: 10 },
  { id: 'gluten', label: 'Glutenfritt bröd (Alternativ)', price: 0 },
];

const DRINKS_LIST = [
  'Coca-Cola 33 cl',
  'Coca-Cola Zero 33 cl',
  'Fanta Orange 33 cl',
  'Sprite 33 cl',
  'Trocadero 33 cl',
  'Loka 33 cl'
];

const DIPS_LIST = [
  'Tryffelmajo',
  'Srirachamajo',
  'Ketchup'
];
