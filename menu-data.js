const MENU = [
  {
    id: 'smash',
    label: 'Smash Burgers',
    desc: 'Pommes frites + 33 cl dryck ingår',
    items: [
      {
        id: 'sb1',
        name: 'Smash Burger 1',
        desc: 'Dubbel smashad patty, cheddar, karamelliserad lök, pickles, Ishak\'s sås, briochebröd',
        price: 150,
        img: 'assets/images/smash-burger-1-real.jpg',
      },
      {
        id: 'sb2',
        name: 'Smash Burger 2',
        desc: 'Dubbel patty, bacon, cheddar, jalapeño, chipotle-majo, knaprig sallad',
        price: 150,
        img: 'assets/images/smash-burger-2.jpg',
      },
      {
        id: 'sb3',
        name: 'Smash Burger 3',
        desc: 'Trippel smash, trippel cheddar, pickles, lök, Ishak\'s hemliga sås',
        price: 150,
        img: 'assets/images/smash-burger-3.jpg',
      },
      {
        id: 'sb4',
        name: 'Smash Burger 4',
        desc: 'Dubbel patty, gruyère, karamelliserad lök, dijon, tryffelinfuserad sås',
        price: 150,
        img: 'assets/images/smash-burger-4-real.jpg',
      },
      {
        id: 'sb5',
        name: 'Smash Burger 5',
        desc: 'Smashad patty, blåmögelost, knaprig bacon, sötsur sås, ruccola',
        price: 150,
        img: 'assets/images/smash-burger-5.jpg',
      },
      {
        id: 'sb6',
        name: 'Smash Burger 6',
        desc: 'Kycklingpatty, picklade jalapeños, pico de gallo, avocadokräm, briochebröd',
        price: 150,
        img: 'assets/images/smash-burger-6-real.jpg',
      },
    ],
  },
  {
    id: 'klassiker',
    label: 'Klassiker',
    desc: 'Pommes frites + 33 cl dryck ingår',
    items: [
      {
        id: 'barn',
        name: 'Barn Burger',
        desc: 'Enkel smashad patty, cheddar, ketchup, senap, lök — ren och klassisk',
        price: 110,
        img: 'assets/images/barn-burger.jpg',
      },
      {
        id: 'nuggets',
        name: 'Chicken Nuggets',
        desc: '8 knapriga kycklingnuggets, valfri dippsås',
        price: 110,
        img: 'assets/images/chicken-nuggets.jpg',
      },
    ],
  },
  {
    id: 'smasatt',
    label: 'Smårätter',
    desc: null,
    items: [
      {
        id: 'fries',
        name: 'Pommes Frites',
        desc: 'Nyfriterade pommes, havssalt',
        price: 35,
        img: 'assets/images/fries.jpg',
      },
      {
        id: 'chili',
        name: 'Chili Cheese Nuggets',
        desc: '6 st — krämig ostfyllning, chiliskorpa',
        price: 30,
        img: 'assets/images/chili-cheese.jpg',
      },
      {
        id: 'dips',
        name: 'Dippsåser',
        desc: 'Tryffelmajo · Srirachamajo · Ketchup',
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
        name: 'Dryck 33 cl',
        desc: 'Coca-Cola, Coca-Cola Zero, Fanta, Sprite',
        price: 15,
        img: 'assets/images/drinks.jpg',
      },
    ],
  },
];

const EXTRAS = [
  { id: 'double', label: 'Dubbelkött', price: 35 },
  { id: 'gluten', label: 'Glutenfritt briochebröd', price: 15 },
];
