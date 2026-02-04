// Trade/Field options
export const TRADE_FIELDS = [
  "Mechanical",
  "Automobile",
  "Electrical",
  "Civil",
  "IT",
  "Hotel Management",
  "ECD (Early Childhood Development)",
  "Tea Technology",
];

// Training Provider (Institute) options
export interface TrainingProvider {
  id: string;
  name: string;
  trades: string[];
  location: string;
}

export const TRAINING_PROVIDERS: TrainingProvider[] = [
  {
    id: "manamohan",
    name: "Manamohan Memorial Polytechnic",
    trades: [
      "Mechanical Engineering",
      "Automobile Engineering",
      "Electrical Engineering",
    ],
    location: "Budiganga, Morang",
  },
  {
    id: "kankai",
    name: "Kankai Polytechnic Institute",
    trades: ["Civil Engineering", "Information Technology"],
    location: "Kankai, Jhapa",
  },
  {
    id: "shailaja",
    name: "Shailaja Acharya Memorial Polytechnic",
    trades: ["Information Technology"],
    location: "Jahada, Morang",
  },
  {
    id: "pushpa-dhirendra",
    name: "Pushpa-Dhirendra Memorial Academy",
    trades: ["Information Technology"],
    location: "Damak, Jhapa",
  },
  {
    id: "nara-bahadur",
    name: "Nara Bahadur Karmacharya Bahuprabidhik Shikshyalaya",
    trades: ["Hotel Management"],
    location: "Itahari, Sunsari",
  },
  {
    id: "aadarsha",
    name: "Aadarsha School",
    trades: ["Information Technology", "Early Childhood Development"],
    location: "Biratnagar, Morang",
  },
  {
    id: "ratna-kumar",
    name: "Ratna Kumar Bantawa Bahuprabidhik Shikshyalaya",
    trades: ["Tea Technology"],
    location: "Ilam",
  },
];

// Industry options
export interface Industry {
  id: string;
  name: string;
  website?: string;
}

export const INDUSTRIES: Industry[] = [
  { id: "mm-group", name: "MM Group", website: "https://mmgroup.com.np" },
  { id: "bagmati-oil", name: "Bagmati Oil Industries" },
  { id: "kabra-g", name: "Kabra G Group" },
  { id: "laminar", name: "Laminar Private Limited" },
  { id: "purwanchal-lube", name: "Purwanchal Lube Oil Limited (PLO)" },
  { id: "hulas-wire", name: "Hulas Wire Industries Limited" },
  { id: "premier-wires", name: "Premier Wires Pvt. Ltd." },
  { id: "fujima-oil", name: "Fujima Oil Company Ltd." },
  { id: "shivam-footwears", name: "Shivam Footwears Pvt. Ltd." },
  { id: "kwality-foods", name: "Kwality Foods Nepal" },
  { id: "bhudeo-khadya", name: "Bhudeo Khadya Udyog Pvt. Ltd." },
  { id: "alexa-lifesciences", name: "Alexa Lifesciences Pvt. Ltd." },
  { id: "jay-shree", name: "Jay Shree Electrical Pvt. Ltd." },
  { id: "kiran-cake", name: "Kiran Cake Parlour Pvt. Ltd." },
  { id: "rabindra-knitfab", name: "Rabindra Knitfab Industries" },
  { id: "others", name: "Others" },
];

// Preferred Location options
export const PREFERRED_LOCATIONS = [
  "Morang",
  "Sunsari",
  "Jhapa",
  "Ilam",
  "Any",
];
