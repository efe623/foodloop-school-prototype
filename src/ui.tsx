import { assetUrl } from "./assets";
import { useState, type ReactNode } from "react";
import {
  Sprout,
  MapPin,
  Clock,
  Heart,
  Gift,
  ChevronRight,
  ArrowLeft,
  Store,
  Utensils,
  Apple,
  Coffee,
  LayoutGrid,
  Plus,
  Minus,
  LocateFixed,
  Wheat,
  Milk,
  Egg,
  Nut,
  Fish,
  Info,
  type LucideIcon,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDemo } from "./state";
import { formatDistance, formatTime, type Listing } from "./data/mockListings";
export const categoryIcons: Record<string, LucideIcon> = {
  All: LayoutGrid,
  Meals: Utensils,
  Bakery: Store,
  "Fruit & Veg": Apple,
  Drinks: Coffee,
};
export const allergenIcons: Record<string, LucideIcon> = {
  Gluten: Wheat,
  Dairy: Milk,
  Eggs: Egg,
  Nuts: Nut,
  Fish: Fish,
  Shellfish: Fish,
  Soy: Sprout,
  Sesame: Sprout,
};
export function Brand() {
  return (
    <div className="brand">
      <img src={assetUrl("/images/foodloop-logo.png")} alt="FoodLoop" />
    </div>
  );
}
export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  options: (string | { value: string; label: string })[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="select-field" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          return (
            <SelectItem value={v} key={v}>
              {typeof o === "string" ? o : o.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
export function ChoicePills({
  label,
  value,
  onChange,
  options,
  icons = false,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  options: (string | { value: string; label: string })[];
  icons?: boolean;
}) {
  return (
    <RadioGroup
      className="choice-pills"
      value={value}
      onValueChange={onChange}
      aria-label={label}
    >
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const text = typeof o === "string" ? o : o.label;
        const Icon = categoryIcons[v];
        return (
          <label
            key={v}
            className={"choice " + (v === value ? "selected" : "")}
          >
            <RadioGroupItem value={v} className="sr-only" />
            {icons && Icon ? <Icon size={16} /> : null}
            {text}
          </label>
        );
      })}
    </RadioGroup>
  );
}
export function Back({
  onClick,
  label = "Back",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button className="back-button" onClick={onClick}>
      <ArrowLeft size={18} />
      {label}
    </button>
  );
}
export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="note">
      <Info size={18} />
      <span>{children}</span>
    </div>
  );
}
export function FoodCard({
  listing,
  onOpen,
  mode = "grid",
}: {
  listing: Listing;
  onOpen: () => void;
  mode?: "grid" | "row" | "compact";
}) {
  const { state, dispatch } = useDemo();
  const saved = state.saved.includes(listing.id);
  return (
    <article className={"food-card " + mode}>
      <button
        className="food-open"
        onClick={onOpen}
        aria-label={"View " + listing.title}
      >
        <div className="food-image">
          <img
            src={assetUrl(listing.image)}
            alt={listing.title}
            loading="lazy"
          />
          <span className="free-tag">Free</span>
        </div>
        <div className="food-info">
          <h3>{listing.title}</h3>
          <p>{listing.donor}</p>
          <span className="quantity">
            {listing.quantity} {listing.quantity === 1 ? "portion" : "portions"}
            {listing.availability !== "available"
              ? " · " + listing.availability
              : listing.quantity === 0
                ? " · unavailable"
                : ""}
          </span>
          <div className="food-meta">
            <span>
              <MapPin />
              {formatDistance(listing.distance, state.preferences.unit)} away
            </span>
            <span>
              <Clock />
              Collect by {formatTime(listing.collectionTime)}
              {listing.day === "Tomorrow" ? " tomorrow" : ""}
            </span>
          </div>
        </div>
      </button>
      <button
        className={"save-button " + (saved ? "saved" : "")}
        aria-label={(saved ? "Unsave " : "Save ") + listing.title}
        aria-pressed={saved}
        onClick={() => dispatch({ type: "save", id: listing.id })}
      >
        <Heart size={20} fill={saved ? "currentColor" : "none"} />
      </button>
    </article>
  );
}
export function MiniCard({
  listing,
  portions,
  children,
}: {
  listing: Listing;
  portions?: number;
  children?: ReactNode;
}) {
  return (
    <div className="mini-card">
      <img src={assetUrl(listing.image)} alt={listing.title} />
      <div>
        <h3>{listing.title}</h3>
        <p>{listing.donor}</p>
        <span className="quantity">
          {portions ?? listing.quantity}{" "}
          {(portions ?? listing.quantity) === 1 ? "portion" : "portions"}
        </span>
      </div>
      {children}
    </div>
  );
}
export function MetaLine({
  listing,
  quantity,
}: {
  listing: Listing;
  quantity?: number;
}) {
  const { state } = useDemo();
  return (
    <div className="meta-line">
      <span>
        <MapPin size={18} />
        {formatDistance(listing.distance, state.preferences.unit)} away
      </span>
      <span>
        <Clock size={18} />
        {listing.day}, {formatTime(listing.collectionTime)}
      </span>
      <span>
        <Gift size={18} />
        Free
      </span>
      {quantity ? <span>{quantity} portion reserved</span> : null}
    </div>
  );
}
export function MapView({
  listings,
  onInspect,
  compact = false,
  single = false,
}: {
  listings: Listing[];
  onInspect?: (l: Listing) => void;
  compact?: boolean;
  single?: boolean;
}) {
  const [zoom, setZoom] = useState(1);
  const [active, setActive] = useState<string | null>(null);
  const [panning, setPanning] = useState({ x: 0, y: 0 });
  const selected = listings.find((l) => l.id === active);
  return (
    <div
      className={"demo-map " + (compact ? "small-map" : "")}
      aria-label="Fixed demo map of Jumeirah, Dubai"
    >
      <div
        className="map-layer"
        style={{
          transform: `translate(${panning.x}px,${panning.y}px) scale(${zoom})`,
        }}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("button")) return;
          const x = e.clientX,
            y = e.clientY,
            start = { ...panning };
          const el = e.currentTarget;
          el.setPointerCapture(e.pointerId);
          el.onpointermove = (move) =>
            setPanning({
              x: Math.max(-180, Math.min(180, start.x + move.clientX - x)),
              y: Math.max(-130, Math.min(130, start.y + move.clientY - y)),
            });
          el.onpointerup = () => {
            el.onpointermove = null;
            el.onpointerup = null;
          };
        }}
      >
        <div className="map-background" />
        {listings.map((l) => (
          <button
            key={l.id}
            className={
              "food-marker " +
              (single ? "single-marker" : "") +
              (active === l.id ? " active" : "")
            }
            style={{ left: `${l.point[0]}%`, top: `${l.point[1]}%` }}
            aria-label={"Inspect " + l.title + " on map"}
            onClick={() => {
              setActive(l.id);
              if (single && onInspect) onInspect(l);
            }}
          >
            {single ? (
              <MapPin size={32} fill="#1b492c" />
            ) : (
              <>
                <img src={assetUrl(l.image)} alt="" />
                <span>{l.quantity}</span>
              </>
            )}
          </button>
        ))}
        {!single ? (
          <span
            className="demo-centre"
            style={{ left: "50%", top: "55%" }}
            title="Fixed demo centre, not your location"
          >
            <i />
          </span>
        ) : null}
      </div>
      <div className="map-caption">
        JUMEIRAH <span>Fixed demo area</span>
      </div>
      {!compact ? (
        <div className="map-controls">
          <button
            aria-label="Reset demo map"
            title="Reset demo map"
            onClick={() => {
              setZoom(1);
              setPanning({ x: 0, y: 0 });
            }}
          >
            <LocateFixed size={20} />
          </button>
          <div>
            <button
              aria-label="Zoom in"
              onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
              disabled={zoom >= 2}
            >
              <Plus size={20} />
            </button>
            <button
              aria-label="Zoom out"
              onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}
              disabled={zoom <= 0.75}
            >
              <Minus size={20} />
            </button>
          </div>
        </div>
      ) : null}
      <a
        className="map-credit"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        © OpenStreetMap contributors
      </a>
      {selected && !single ? (
        <div className="marker-preview">
          <MiniCard listing={selected} />
          <button className="primary" onClick={() => onInspect?.(selected)}>
            View food details
          </button>
          <button className="text-button" onClick={() => setActive(null)}>
            Close preview
          </button>
        </div>
      ) : null}
    </div>
  );
}
export function MenuRow({
  icon: Icon,
  title,
  subtitle,
  onClick,
  value,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClick: () => void;
  value?: string;
}) {
  return (
    <button className="menu-row" onClick={onClick}>
      <Icon size={21} />
      <span>
        <strong>{title}</strong>
        {subtitle ? <small>{subtitle}</small> : null}
      </span>
      {value ? <em>{value}</em> : null}
      <ChevronRight size={18} />
    </button>
  );
}
