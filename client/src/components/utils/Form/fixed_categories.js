const frets = [
  {
    _id: 20,
    name: 20,
  },
  {
    _id: 21,
    name: 21,
  },
  {
    _id: 22,
    name: 22,
  },
  {
    _id: 24,
    name: 24,
  },
];

const prices = [
  {
    _id: 0,
    name: "Any",
    range: [],
  },
  {
    _id: 1,
    name: "$0 to $299",
    range: [0, 299],
  },
  {
    _id: 2,
    name: "$300 to $599",
    range: [300, 599],
  },
  {
    _id: 3,
    name: "$600 to $999",
    range: [600, 999],
  },
  {
    _id: 4,
    name: "$1000 to $1999",
    range: [1000, 1999],
  },
  {
    _id: 5,
    name: "More than $2000",
    range: [2000, 99999],
  },
];

export { frets, prices };
