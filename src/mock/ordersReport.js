import { getRandomElement } from "../utils/functions";
import moment from 'moment';

const firstNames = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"];
const lastNames = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"];
const items = ["coconut oil", "radishes", "cremini mushrooms", "blue cheese", "tartar sauce", "nectarines", "black beans", "watermelons", "romaine lettuce", "onions", "chile peppers", "vanilla bean", "mesclun greens", "huckleberries", "beets", "Romano cheese", "prawns", "cooking wine", "apple pie spice", "potato chips"];

export default [...new Array(45)].map((x, i) => ({
  key: i,
  name: `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`,
  email: `${getRandomElement(firstNames).toLowerCase()}.${getRandomElement(lastNames).toLowerCase()}@DineGo.com`,
  item: getRandomElement(items),
  amount: Math.floor(Math.random() * 200),
  status: Math.random() < 0.33 ? "cancelled" : Math.random() < 0.66 ? "completed" : "process",
  date: moment().subtract(Math.random() * 10, "days").subtract(Math.random() * 10, "hours"),
  details: [
    { key: 0, name: "Cocktail Cherry Lips", total: 232, quantity: 5, price: 46.4, additionals: [{key: 0, name: "Fries", price: 6}, {key: 1, name: "Ketchup", price: 2}], instructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tortor enim. Mauris maximus elit erat. Fusce egestas eleifend est eu commodo."},
    { key: 1, name: "Burrito", total: 22, quantity: 1, price: 126, additionals: [{key: 0, name: "Fries", price: 6}, {key: 1, name: "Ketchup", price: 2}] },
    { key: 2, name: "Piña Colada", total: 65, quantity: 2, price: 32.5, additionals: [], instructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et tortor enim. Mauris maximus elit erat. Fusce egestas eleifend est eu commodo."},
    { key: 3, name: "Ramen", total: 300, quantity: 3, price: 100, additionals: []},
  ]
}));