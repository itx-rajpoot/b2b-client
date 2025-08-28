import moment from 'moment';

const rewards = [...new Array(14)].map((x, i) => ({
  key: i,
  image: 'https://i.stack.imgur.com/y9DpT.jpg',
  name: 'Vegetable burger',
  description: 'Lorem ipsum dolor sit amet, consectuter adipiscing elit.',
  lp: 120,
  venue: "Nusr-Et Steakhouse",
  stipulations: 'One reward per purchase',
  limit: 78,
  expiration: moment(),
  available: Math.random() > 0.5,
}));

export default rewards;
