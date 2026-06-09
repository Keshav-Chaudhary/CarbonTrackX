import {
  Car,
  Zap,
  Utensils,
  Leaf,
  Trash,
  Bike
} from "lucide-react";

export const PRESETS = [
  { label: "Car Commute", factorId: "car_petrol", quantity: 20, icon: Car, desc: "20 km (Petrol)" },
  { label: "Electricity Day", factorId: "electricity", quantity: 10, icon: Zap, desc: "10 kWh" },
  { label: "Beef Meal", factorId: "meal_beef", quantity: 1, icon: Utensils, desc: "1 serving" },
  { label: "Vegan Meal", factorId: "meal_vegan", quantity: 1, icon: Leaf, desc: "1 serving" },
  { label: "General Waste", factorId: "waste_general", quantity: 5, icon: Trash, desc: "5 kg" },
  { label: "Zero-Emission Commute", factorId: "bike_walk", quantity: 10, icon: Bike, desc: "10 km" },
] as const;

export const ECO_TIPS = [
  "Small changes make a huge difference. Replacing just one beef meal a week with a plant-based option can save roughly 100 kg of CO2e per year—the equivalent of driving a petrol car for 400 kilometers!",
  "Unplugging inactive electronics, often called 'vampire power', can reduce your home energy footprint by up to 10%.",
  "Opting for public transit or carpooling just twice a week can significantly reduce your daily commuting emissions over a year.",
  "Washing clothes in cold water saves up to 90% of the energy used by your washing machine and keeps clothes looking new.",
  "Reducing food waste is one of the most effective ways to lower your personal footprint—the average household wastes 30% of its food.",
  "A leaky faucet that drips at the rate of one drop per second can waste more than 3,000 gallons per year, increasing water heating emissions.",
  "Switching to LED lightbulbs uses at least 75% less energy and lasts 25 times longer than incandescent lighting.",
  "Taking a 5-minute shower instead of a bath can save up to 50 gallons of water and drastically lower heating emissions.",
  "Bringing your own reusable bags to the grocery store reduces the demand for single-use plastics, which are highly emission-intensive to produce.",
  "Lowering your thermostat by just 2 degrees in the winter can cut your heating emissions by up to 10% without sacrificing comfort."
] as const;

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "transport", label: "Transport" },
  { value: "energy", label: "Home Energy" },
  { value: "diet", label: "Diet" },
  { value: "shopping", label: "Shopping" },
  { value: "waste", label: "Waste" },
  { value: "custom", label: "Custom" },
];

export const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
];

export const IMPACT_OPTIONS = [
  { value: "all", label: "All Impacts" },
  { value: "low", label: "Low (< 1kg)" },
  { value: "medium", label: "Medium (1 - 10kg)" },
  { value: "high", label: "High (> 10kg)" },
];
