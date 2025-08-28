const PAK_states = {
  PB: 'Punjab',
  SD: 'Sindh',
  KP: 'Khyber Pakhtunkhwa',
  BL: 'Balochistan',
  IS: 'Islamabad Capital Territory',
  GB: 'Gilgit-Baltistan',
  AJ: 'Azad Jammu and Kashmir',
};

const PAK_cities = {
  PB: [
    "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala",
    "Sialkot", "Sargodha", "Bahawalpur", "Sheikhupura", "Jhelum",
    "Okara", "Kasur", "Vehari", "Chiniot", "Mianwali", "Rahim Yar Khan",
    "Dera Ghazi Khan", "Khanewal", "Attock", "Narowal", "Pakpattan",
    "Hafizabad", "Muzaffargarh", "Toba Tek Singh", "Muridke"
  ],
  SD: [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Mirpur Khas",
    "Nawabshah", "Shikarpur", "Khairpur", "Badin", "Thatta",
    "Jacobabad", "Dadu", "Umerkot", "Kashmore", "Ghotki", "Jamshoro",
    "Tando Allahyar", "Tando Adam", "Matiari", "Hala"
  ],
  KP: [
    "Peshawar", "Mardan", "Mingora", "Abbottabad", "Kohat",
    "Dera Ismail Khan", "Charsadda", "Nowshera", "Swabi", "Mansehra",
    "Hangu", "Haripur", "Bannu", "Shangla", "Chitral", "Timergara",
    "Batkhela", "Tank", "Karak"
  ],
  BL: [
    "Quetta", "Gwadar", "Turbat", "Khuzdar", "Sibi",
    "Chaman", "Zhob", "Panjgur", "Kalat", "Lasbela",
    "Dera Murad Jamali", "Loralai", "Pasni", "Hub", "Nushki",
    "Mastung", "Dera Allah Yar", "Kharan"
  ],
  GB: [
    "Gilgit", "Skardu", "Hunza", "Ghizer", "Astore",
    "Diamer", "Ghanche", "Shigar", "Nagar", "Kharmang"
  ],
  AJ: [
    "Muzaffarabad", "Mirpur", "Rawalakot", "Kotli", "Bhimber",
    "Bagh", "Pallandri", "Sudhnuti", "Neelum Valley", "Hattian Bala"
  ],
  IS: [
    "Islamabad", "Bari Imam", "Bhara Kahu", "Tarnol", "Golra Sharif"
  ]
};

const sortArrayByString = (arr) => arr.sort((a, b) => a.localeCompare(b));

export const getPAK_states = function getPAK_states() {
  const states = [];
  for (let i = 0; i < Object.keys(PAK_states).length; i++) {
    const state = Object.keys(PAK_states)[i];
    states.push({ label: PAK_states[state], value: state });
  }
  return states;
};

export const getPAK_cities = function getPAK_cities() {
  const cities = [];
  for (let i = 0; i < Object.keys(PAK_cities).length; i++) {
    const state = Object.keys(PAK_cities)[i];
    for (let j = 0; j < PAK_cities[state].length; j++) {
      cities.push(PAK_cities[state][j]);
    }
  }
  return sortArrayByString([...new Set(cities)]).map((x) => ({ label: x, value: x.toLowerCase() }));
};

export const PK_cities_asArray = getPAK_cities();
export const PK_states_asArray = getPAK_states();
