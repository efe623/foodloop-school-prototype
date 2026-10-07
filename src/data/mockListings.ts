export type Role = "student" | "business";
export type Category = "Meals" | "Bakery" | "Fruit & Veg" | "Drinks";
export type Availability = "available" | "paused" | "completed";
export interface Listing {
  id: string;
  title: string;
  description: string;
  category: Category;
  image: string;
  images: string[];
  donor: string;
  quantity: number;
  allergens: string[];
  distance: number;
  collectionTime: string;
  collectionFrom: string;
  day: "Today" | "Tomorrow";
  location: string;
  pickup: string;
  point: [number, number];
  availability: Availability;
  owner: "business" | "other";
  dietary: string[];
  price: number;
}
const make = (
  data: Omit<Listing, "images" | "price" | "pickup" | "collectionFrom"> &
    Partial<Pick<Listing, "images" | "pickup" | "collectionFrom">>,
): Listing => ({
  images: [data.image],
  price: 0,
  collectionFrom: "14:00",
  pickup:
    "Use the marked entrance at the demo collection point. Ask for the FoodLoop collection and show your demo claim.",
  ...data,
});
export const mockListings: Listing[] = [
  make({
    id: "pastries",
    title: "Mixed Pastries",
    description:
      "Assorted freshly baked croissants, chocolate rolls and danishes. These pastries are surplus from this morning and ready to enjoy. One portion contains two pastries.",
    category: "Bakery",
    image: "/images/pastries.jpg",
    images: ["/images/pastries.jpg", "/images/donuts.jpg"],
    donor: "Local Bakery",
    quantity: 3,
    allergens: ["Gluten", "Dairy", "Eggs"],
    distance: 320,
    collectionTime: "17:00",
    day: "Today",
    location: "Jumeirah, Dubai · Demo point A",
    point: [40, 43],
    availability: "available",
    owner: "business",
    dietary: ["Vegetarian"],
  }),
  make({
    id: "chicken",
    title: "Chicken & Rice",
    description:
      "A freshly prepared portion of tender chicken with seasoned rice and vegetables. Packed in a takeaway container, ready for collection from the demo café counter.",
    category: "Meals",
    image: "/images/chicken.jpg",
    donor: "Café",
    quantity: 4,
    allergens: ["Soy"],
    distance: 450,
    collectionTime: "16:30",
    day: "Today",
    location: "Al Wasl, Dubai · Demo point B",
    point: [61, 62],
    availability: "available",
    owner: "other",
    dietary: ["Halal"],
  }),
  make({
    id: "fruit",
    title: "Fresh Fruit",
    description:
      "A colourful selection of apples, oranges and seasonal fruit. Fresh surplus produce, carefully selected and packed. Each portion is a small bag of fruit.",
    category: "Fruit & Veg",
    image: "/images/fruit.jpg",
    donor: "Grocery Store",
    quantity: 6,
    allergens: [],
    distance: 900,
    collectionTime: "18:00",
    day: "Today",
    location: "Jumeirah, Dubai · Demo point C",
    point: [65, 27],
    availability: "available",
    owner: "other",
    dietary: ["Vegetarian", "Vegan", "Gluten free"],
  }),
  make({
    id: "bananas",
    title: "Bananas",
    description:
      "Ripe yellow bananas that are perfect for a snack, smoothie or baking. Each portion contains a small bunch. Surplus produce from our fictional grocery store.",
    category: "Fruit & Veg",
    image: "/images/bananas.jpg",
    donor: "Grocery Store",
    quantity: 8,
    allergens: [],
    distance: 1500,
    collectionTime: "19:00",
    day: "Tomorrow",
    location: "Jumeirah, Dubai · Demo point D",
    point: [78, 74],
    availability: "available",
    owner: "other",
    dietary: ["Vegetarian", "Vegan", "Gluten free"],
  }),
  make({
    id: "salad",
    title: "Fruit Salad",
    description:
      "Freshly cut kiwi, pineapple, strawberries and seasonal fruit, topped with mint. A refreshing ready-to-eat portion in a sealed container.",
    category: "Fruit & Veg",
    image: "/images/salad.jpg",
    donor: "Café",
    quantity: 3,
    allergens: [],
    distance: 720,
    collectionTime: "17:30",
    day: "Today",
    location: "Jumeirah, Dubai · Demo point E",
    point: [34, 69],
    availability: "available",
    owner: "other",
    dietary: ["Vegetarian", "Vegan", "Gluten free"],
  }),
  make({
    id: "mac",
    title: "Mac & Cheese",
    description:
      "Creamy macaroni pasta with a rich cheddar cheese sauce. Freshly cooked today and packed into individual portions. Reheat before enjoying.",
    category: "Meals",
    image: "/images/mac.jpg",
    donor: "Café",
    quantity: 3,
    allergens: ["Gluten", "Dairy"],
    distance: 1200,
    collectionTime: "18:00",
    day: "Today",
    location: "Al Safa, Dubai · Demo point F",
    point: [55, 79],
    availability: "available",
    owner: "other",
    dietary: ["Vegetarian"],
  }),
  make({
    id: "pasta",
    title: "Pesto Pasta",
    description:
      "Pasta tossed in basil pesto with parmesan cheese. Surplus from our fictional restaurant lunch service. Each portion is packed and ready to collect.",
    category: "Meals",
    image: "/images/pasta.jpg",
    donor: "Local Restaurant",
    quantity: 4,
    allergens: ["Gluten", "Dairy", "Nuts"],
    distance: 2100,
    collectionTime: "18:30",
    day: "Tomorrow",
    location: "Al Wasl, Dubai · Demo point G",
    point: [79, 44],
    availability: "available",
    owner: "other",
    dietary: ["Vegetarian"],
  }),
  make({
    id: "sandwiches",
    title: "Sandwiches",
    description:
      "Rustic sandwiches with a fresh vegetable filling. Made today, individually wrapped and available as surplus from the demo café.",
    category: "Meals",
    image: "/images/sandwiches.jpg",
    donor: "University Café",
    quantity: 6,
    allergens: ["Gluten", "Dairy"],
    distance: 800,
    collectionTime: "17:30",
    day: "Today",
    location: "Jumeirah, Dubai · Demo point H",
    point: [45, 23],
    availability: "available",
    owner: "business",
    dietary: ["Vegetarian"],
  }),
  make({
    id: "donuts",
    title: "Donuts",
    description:
      "A mixed box of soft donuts with chocolate and strawberry icing. Fresh bakery surplus. Two donuts per portion.",
    category: "Bakery",
    image: "/images/donuts.jpg",
    donor: "Local Bakery",
    quantity: 5,
    allergens: ["Gluten", "Dairy", "Eggs"],
    distance: 600,
    collectionTime: "18:00",
    day: "Today",
    location: "Jumeirah, Dubai · Demo point I",
    point: [23, 50],
    availability: "available",
    owner: "business",
    dietary: ["Vegetarian"],
  }),
  make({
    id: "juice",
    title: "Fresh Orange Juice",
    description:
      "Freshly squeezed orange juice in sealed cups. Prepared for the fictional café breakfast service. One cup per portion.",
    category: "Drinks",
    image: "/images/juice.jpg",
    donor: "Café",
    quantity: 2,
    allergens: [],
    distance: 1800,
    collectionTime: "16:00",
    day: "Tomorrow",
    location: "Al Safa, Dubai · Demo point J",
    point: [71, 88],
    availability: "available",
    owner: "other",
    dietary: ["Vegetarian", "Vegan", "Gluten free"],
  }),
];
export const allergenOptions = [
  "Gluten",
  "Dairy",
  "Eggs",
  "Nuts",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame",
];
export const categories: Category[] = [
  "Meals",
  "Bakery",
  "Fruit & Veg",
  "Drinks",
];
export const demoLocations = [
  "Jumeirah, Dubai · Demo point A",
  "Jumeirah, Dubai · Demo point C",
  "Al Wasl, Dubai · Demo point B",
  "Al Safa, Dubai · Demo point F",
];
export const photoChoices = mockListings
  .filter((l) => l.id !== "juice")
  .map((l) => ({ image: l.image, title: l.title }));
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
export function formatDistance(m: number, unit = "km") {
  return unit === "mi"
    ? `${(m / 1609.344).toFixed(2)} mi`
    : m < 1000
      ? `${m} m`
      : `${Number((m / 1000).toFixed(1))} km`;
}
