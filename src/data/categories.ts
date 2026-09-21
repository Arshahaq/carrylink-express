import type { ItemCategory } from "@/types";

export const CATEGORIES: ItemCategory[] = [
  {
    id: "documents",
    label: "Documents",
    icon: "FileText",
    description: "Certificates, academic and legal paperwork",
    subtypes: [
      "Certificates",
      "University documents",
      "Business documents",
      "Legal documents",
      "Personal documents",
      "Other documents",
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: "Smartphone",
    description: "Devices and accessories, battery checks apply",
    subtypes: [
      "Smartphone",
      "Laptop",
      "Tablet",
      "Camera",
      "Smartwatch",
      "Accessories",
      "Other electronics",
    ],
  },
  {
    id: "personal",
    label: "Personal Items",
    icon: "Shirt",
    description: "Everyday belongings and gifts",
    subtypes: [
      "Clothes",
      "Books",
      "Gifts",
      "Toys",
      "Accessories",
      "Small personal belongings",
    ],
  },
  {
    id: "medicines",
    label: "Medicines",
    icon: "Pill",
    description: "Needs documentation review",
    subtypes: ["Prescription medicine", "Non-prescription medicine", "Medical supplies"],
  },
  {
    id: "food",
    label: "Food",
    icon: "Cookie",
    description: "Sealed and packaged food only",
    subtypes: ["Packaged food", "Snacks", "Dry food", "Other food"],
  },
  {
    id: "business",
    label: "Business",
    icon: "Briefcase",
    description: "Samples, paperwork and small equipment",
    subtypes: [
      "Product samples",
      "Business documents",
      "Small equipment",
      "Other business items",
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: "Package",
    description: "Requires manual verification",
    subtypes: ["Unlisted item"],
  },
];

export function categoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}

export const CITIES = [
  { city: "Bengaluru, India", airport: "BLR", lat: 13.1986, lng: 77.7066 },
  { city: "Mumbai, India", airport: "BOM", lat: 19.0896, lng: 72.8656 },
  { city: "Delhi, India", airport: "DEL", lat: 28.5562, lng: 77.1 },
  { city: "Dubai, UAE", airport: "DXB", lat: 25.2532, lng: 55.3657 },
  { city: "London, UK", airport: "LHR", lat: 51.47, lng: -0.4543 },
  { city: "Singapore", airport: "SIN", lat: 1.3644, lng: 103.9915 },
  { city: "Toronto, Canada", airport: "YYZ", lat: 43.6777, lng: -79.6248 },
  { city: "New York, USA", airport: "JFK", lat: 40.6413, lng: -73.7781 },
];

export function cityMeta(city: string) {
  return CITIES.find((c) => c.city === city);
}

export const PICKUP_OPTIONS = [
  "Designated location",
  "Airport",
  "Other approved location",
];

export const DELIVERY_OPTIONS = ["Designated location", "Airport"];
