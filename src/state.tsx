import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { mockListings, type Listing } from "./data/mockListings";
export const STORAGE_KEY = "foodloop-demo-v1";
export interface Claim {
  id: string;
  listing: Listing;
  status: "upcoming" | "collected";
  claimedAt: string;
  collectedAt?: string;
  portions: number;
}
export interface Filters {
  category: string;
  distance: number;
  day: string;
  availability: string;
  savedOnly: boolean;
  usePreferences: boolean;
}
export interface Preferences {
  diet: string;
  avoid: string[];
  types: string[];
  unit: "km" | "mi";
  dark: boolean;
  notifications: Record<string, boolean>;
  persona: number;
  avatar: number;
}
export interface DemoState {
  version: 1;
  listings: Listing[];
  claims: Claim[];
  saved: string[];
  filters: Filters;
  preferences: Preferences;
}
export const defaultFilters: Filters = {
  category: "All",
  distance: 5000,
  day: "Any",
  availability: "available",
  savedOnly: false,
  usePreferences: false,
};
export function initialState(): DemoState {
  return {
    version: 1,
    listings: structuredClone(mockListings),
    claims: [
      {
        id: "example-chicken",
        listing: structuredClone(mockListings[1]),
        status: "upcoming",
        claimedAt: "2026-10-07T10:00:00+04:00",
        portions: 1,
      },
      {
        id: "example-salad",
        listing: structuredClone(mockListings[4]),
        status: "collected",
        claimedAt: "2026-10-06T10:00:00+04:00",
        collectedAt: "2026-10-06T15:00:00+04:00",
        portions: 1,
      },
    ],
    saved: [],
    filters: { ...defaultFilters },
    preferences: {
      diet: "None",
      avoid: [],
      types: [],
      unit: "km",
      dark: false,
      persona: 0,
      avatar: 0,
      notifications: {
        nearby: true,
        claims: true,
        reminders: true,
        messages: false,
        tips: false,
      },
    },
  };
}
export type Action =
  | { type: "claim"; listingId: string; id: string; date: string }
  | { type: "collect"; id: string; date: string }
  | { type: "save"; id: string }
  | { type: "publish"; listing: Listing }
  | { type: "availability"; id: string; availability: Listing["availability"] }
  | { type: "delete"; id: string }
  | { type: "filters"; filters: Filters }
  | { type: "preferences"; preferences: Partial<Preferences> }
  | { type: "reset" };
export function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "claim": {
      const l = state.listings.find((l) => l.id === action.listingId);
      if (
        !l ||
        l.availability !== "available" ||
        l.quantity < 1 ||
        state.claims.some(
          (c) => c.listing.id === l.id && c.status === "upcoming",
        )
      )
        return state;
      return {
        ...state,
        listings: state.listings.map((x) =>
          x.id === l.id ? { ...x, quantity: x.quantity - 1 } : x,
        ),
        claims: [
          {
            id: action.id,
            listing: { ...l },
            status: "upcoming",
            claimedAt: action.date,
            portions: 1,
          },
          ...state.claims,
        ],
      };
    }
    case "collect":
      return {
        ...state,
        claims: state.claims.map((c) =>
          c.id === action.id && c.status === "upcoming"
            ? { ...c, status: "collected", collectedAt: action.date }
            : c,
        ),
      };
    case "save":
      return {
        ...state,
        saved: state.saved.includes(action.id)
          ? state.saved.filter((id) => id !== action.id)
          : [...state.saved, action.id],
      };
    case "publish":
      return {
        ...state,
        listings: state.listings.some((l) => l.id === action.listing.id)
          ? state.listings.map((l) =>
              l.id === action.listing.id ? action.listing : l,
            )
          : [action.listing, ...state.listings],
      };
    case "availability":
      return {
        ...state,
        listings: state.listings.map((l) =>
          l.id === action.id ? { ...l, availability: action.availability } : l,
        ),
      };
    case "delete":
      return {
        ...state,
        listings: state.listings.filter((l) => l.id !== action.id),
        saved: state.saved.filter((id) => id !== action.id),
      };
    case "filters":
      return { ...state, filters: action.filters };
    case "preferences":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.preferences },
      };
    case "reset":
      return initialState();
  }
}
function validListing(l: unknown): l is Listing {
  if (!l || typeof l !== "object") return false;
  const x = l as Listing;
  return (
    typeof x.id === "string" &&
    typeof x.title === "string" &&
    typeof x.description === "string" &&
    typeof x.image === "string" &&
    Array.isArray(x.images) &&
    Array.isArray(x.allergens) &&
    Array.isArray(x.dietary) &&
    typeof x.quantity === "number" &&
    x.quantity >= 0 &&
    Array.isArray(x.point) &&
    x.point.length === 2 &&
    typeof x.collectionTime === "string" &&
    typeof x.collectionFrom === "string" &&
    typeof x.donor === "string" &&
    typeof x.location === "string" &&
    typeof x.pickup === "string" &&
    typeof x.distance === "number" &&
    ["Meals", "Bakery", "Fruit & Veg", "Drinks"].includes(x.category) &&
    ["available", "paused", "completed"].includes(x.availability) &&
    ["Today", "Tomorrow"].includes(x.day)
  );
}
function loadState(): DemoState {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (
      data?.version === 1 &&
      Array.isArray(data.listings) &&
      data.listings.every(validListing) &&
      Array.isArray(data.claims) &&
      data.claims.every(
        (c: Claim) =>
          validListing(c.listing) &&
          ["upcoming", "collected"].includes(c.status) &&
          typeof c.id === "string",
      ) &&
      Array.isArray(data.saved) &&
      data.filters &&
      data.preferences &&
      Array.isArray(data.preferences.avoid) &&
      Array.isArray(data.preferences.types) &&
      typeof data.preferences.notifications === "object"
    )
      return data;
  } catch {
    /* Fall back to the original classroom demo. */
  }
  return initialState();
}
const DemoContext = createContext<{
  state: DemoState;
  dispatch: Dispatch<Action>;
  storageAvailable: boolean;
} | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      setStorageAvailable(
        false,
      ); /* Continue in memory when storage is unavailable/full. */
    }
  }, [state]);
  return (
    <DemoContext.Provider value={{ state, dispatch, storageAvailable }}>
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider is missing");
  return value;
}
export function filterListings(state: DemoState, query: string) {
  const f = state.filters;
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return state.listings.filter(
    (l) =>
      terms.every((t) =>
        `${l.title} ${l.description} ${l.category} ${l.donor}`
          .toLowerCase()
          .includes(t),
      ) &&
      (f.category === "All" || l.category === f.category) &&
      l.distance <= f.distance &&
      (f.day === "Any" || f.day === "This week" || l.day === f.day) &&
      (f.availability === "all" ||
        (f.availability === "available"
          ? l.availability === "available" && l.quantity > 0
          : l.quantity === 0 || l.availability !== "available")) &&
      (!f.savedOnly || state.saved.includes(l.id)) &&
      (!f.usePreferences ||
        ((state.preferences.diet === "None" ||
          l.dietary.includes(state.preferences.diet)) &&
          !l.allergens.some((a) => state.preferences.avoid.includes(a)) &&
          (!state.preferences.types.length ||
            state.preferences.types.includes(l.category)))),
  );
}
