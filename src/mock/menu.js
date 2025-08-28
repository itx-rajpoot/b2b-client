export const categories = [
  { key: "drinks", name: "Drinks" },
  { key: "food", name: "Food" },
];
export const subcategories = [
  { key: "alcoholic", name: "Alcoholic", category: "drinks" },
  { key: "non_alcoholic", name: "Non Alcoholic", category: "drinks" },
  { key: "sandwiches", name: "Sandwiches", category: "food" },
  { key: "pizza", name: "Pizza", category: "food" },
  { key: "meat", name: "Meat", category: "food" },
  { key: "fries", name: "Fries", category: "food" },
  { key: "soup", name: "Soup", category: "food" },
  { key: "vegetables", name: "Vegetables", category: "food" },
  { key: "sauce", name: "Sauce", category: "food" },
  { key: "dessert", name: "Dessert", category: "food" },
  { key: "cookies", name: "Cookies", category: "food" },
  { key: "unlisted", name: "Not listed", category: "drinks" },
  { key: "unlisted", name: "Not listed", category: "food" },

];
export const menuItems = [...new Array(45)].map((x, i) => ({
  key: i,
  name: "Pizza",
  category: "Food",
  subcategory: "italian",
  addons: ["pepperoni", "bacon", "pineapple"],
  size: "Medium",
  available: true,
  img: "https://i.stack.imgur.com/y9DpT.jpg",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tortor enim. Mauris maximus elit erat. Fusce egestas eleifend est eu commodo. Nam finibus dui justo.",
  price: 131
}));