const MENU = [
  {
    id: 'smash',
    label: 'Smash Burgers',
    desc: 'Pommes frites & 33 cl dryck ingår i alla menyer',
    items: [
      {
        id: 'sb1',
        name: 'Smash Burger 1',
        desc: 'Steks med färsk jalapeño inpressad i köttet, smält cheddar, srirachamajo, karamelliserad lök och krispiga chili cheese i rostat briochebröd.',
        price: 150,
        img: 'assets/images/smash-burger-2.jpg',
      },
      {
        id: 'sb2',
        name: 'Smash Burger 2',
        desc: 'Husets tryffelmajo, smält cheddar, söt karamelliserad lök och knaprig rostad lök i nyrostat briochebröd.',
        price: 150,
        img: 'assets/images/smash-burger-3.jpg',
      },
      {
        id: 'sb3',
        name: 'Smash Burger 3',
        desc: 'Smashed med lök direkt på plattan (Oklahoma-style), dubbel cheddar, rökig BBQ-sås, syrlig pickles och rostad lök i briochebröd.',
        price: 150,
        img: 'assets/images/smash-burger-5.jpg',
      },
      {
        id: 'sb4',
        name: 'Smash Burger 4',
        desc: 'Tidlös street classic med dubbel smash, smält cheddar, krispig sallad, finskivad rödlök, ketchup, senap och pickles i mjukt briochebröd.',
        price: 150,
        img: 'assets/images/smash-burger-2.jpg',
      },
      {
        id: 'sb5',
        name: 'Smash Burger 5',
        desc: 'Len tryffelmajo möter rökig BBQ-sås, dubbel smash, cheddar, karamelliserad lök och picklad jalapeño i briochebröd.',
        price: 150,
        img: 'assets/images/smash-burger-5.jpg',
      },
      {
        id: 'sb6',
        name: 'Smash Burger 6',
        desc: 'Dubbel smash på svenskt nötkött, smält cheddar, krispig sallad, syrlig picklad rödlök och husets fylliga tryffelmajo.',
        price: 150,
        img: 'assets/images/smash-burger-3.jpg',
      },
    ],
  },
  {
    id: 'klassiker',
    label: 'Klassiker',
    desc: 'Pommes frites & 33 cl dryck ingår',
    items: [
      {
        id: 'barn',
        name: 'Barn Burger',
        desc: 'Enkel smashad patty på svenskt nötkött, cheddarost och ketchup i mjukt briochebröd.',
        price: 110,
        img: 'assets/images/barn-burger.jpg',
      },
      {
        id: 'nuggets',
        name: 'Chicken Nuggets (8 st)',
        desc: '8 st gyllene, knapriga kycklingnuggets med nystekta pommes och valfri dippsås.',
        price: 110,
        img: 'assets/images/chicken-nuggets.jpg',
      },
    ],
  },
  {
    id: 'smaratter',
    label: 'Smårätter',
    desc: null,
    items: [
      {
        id: 'fries',
        name: 'Pommes Frites',
        desc: 'Nystekta, krispiga pommes frites kryddade med havssalt.',
        price: 35,
        img: 'assets/images/fries.jpg',
      },
      {
        id: 'chili',
        name: 'Chili Cheese Bites (6 st)',
        desc: '6 st frasiga nuggets fyllda med krämig smält cheddar och mild jalapeño.',
        price: 30,
        img: 'assets/images/chili-cheese.jpg',
      },
      {
        id: 'dips',
        name: 'Dippsåser',
        desc: 'Välj mellan Tryffelmajo, Srirachamajo, Vitlöksmajo eller Ketchup.',
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
        name: 'Dryck 33 cl burk',
        desc: 'Coca-Cola, Coca-Cola Zero, Fanta Orange, Sprite, Trocadero, Loka Naturell.',
        price: 15,
        img: 'assets/images/drinks.jpg',
      },
    ],
  },
];

const EXTRAS = [
  { id: 'double', label: 'Extra smashpuck & cheddar (+100g)', price: 35 },
  { id: 'gluten', label: 'Glutenfritt briochebröd', price: 15 },
];

const DRINKS_LIST = [
  'Coca-Cola Original 33 cl',
  'Coca-Cola Zero 33 cl',
  'Fanta Orange 33 cl',
  'Sprite 33 cl',
  'Trocadero 33 cl',
  'Trocadero Zero 33 cl',
  'Loka Naturell 33 cl'
];

const DIPS_LIST = [
  'Tryffelmajo',
  'Srirachamajo',
  'Vitlöksmajo',
  'Ketchup'
];
