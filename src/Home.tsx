import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Map,
  List,
  LayoutGrid,
  X,
  MapPin,
  Heart,
  Leaf,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDemo, filterListings, defaultFilters } from "./state";
import { categories, type Listing } from "./data/mockListings";
import { ChoicePills, FoodCard, SelectField, MapView } from "./ui";
export default function Home({ onOpen }: { onOpen: (l: Listing) => void }) {
  const { state, dispatch } = useDemo();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"map" | "row" | "grid">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState(state.filters);
  const [sort, setSort] = useState("Distance");
  const f = state.filters;
  const results = filterListings(state, query).sort((a, b) =>
    sort === "Collection time"
      ? a.day.localeCompare(b.day) ||
        a.collectionTime.localeCompare(b.collectionTime)
      : sort === "Quantity"
        ? b.quantity - a.quantity
        : a.distance - b.distance,
  );
  const activeFilters =
    Number(f.distance !== 5000) +
    Number(f.day !== "Any") +
    Number(f.availability !== "available") +
    Number(f.savedOnly) +
    Number(f.usePreferences);
  const reset = () => {
    dispatch({ type: "filters", filters: { ...defaultFilters } });
    setDraft({ ...defaultFilters });
    setQuery("");
  };
  return (
    <div className="home-view">
      <h1 className="sr-only">Explore demo food</h1>
      <header className="discovery-header">
        <div className="home-eyeline">
          <span>
            <MapPin size={15} />
            Jumeirah, Dubai <small>· Demo area</small>
          </span>
          <div className="view-switch" aria-label="Food display">
            <button
              className={view === "map" ? "active" : ""}
              aria-label="Map view"
              aria-pressed={view === "map"}
              onClick={() => setView("map")}
            >
              <Map size={19} />
              <span>Map</span>
            </button>
            <button
              className={view === "row" ? "active" : ""}
              aria-label="List view"
              aria-pressed={view === "row"}
              onClick={() => setView("row")}
            >
              <List size={19} />
              <span>List</span>
            </button>
            <button
              className={view === "grid" ? "active" : ""}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid size={19} />
            </button>
          </div>
        </div>
        <div className="search-row">
          <label className="search-box">
            <Search size={21} />
            <input
              placeholder="Search for food, places or categories..."
              aria-label="Search food"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query ? (
              <button aria-label="Clear search" onClick={() => setQuery("")}>
                <X size={18} />
              </button>
            ) : null}
          </label>
          <button
            className={
              "icon-button filter-button " + (filtersOpen ? "active" : "")
            }
            aria-label="Search filters"
            aria-expanded={filtersOpen}
            onClick={() => {
              setDraft(state.filters);
              setFiltersOpen((s) => !s);
            }}
          >
            <SlidersHorizontal size={21} />
            {activeFilters ? <b>{activeFilters}</b> : null}
          </button>
        </div>
        <ChoicePills
          label="Food category"
          options={["All", ...categories]}
          value={f.category}
          onChange={(category) =>
            dispatch({ type: "filters", filters: { ...f, category } })
          }
          icons
        />
        {filtersOpen ? (
          <section className="filter-panel" aria-label="Search and filters">
            <div className="filter-group">
              <h3>Distance</h3>
              <ChoicePills
                label="Maximum distance"
                value={String(draft.distance)}
                onChange={(value) =>
                  setDraft({ ...draft, distance: Number(value) })
                }
                options={[
                  { value: "5000", label: "Any" },
                  { value: "500", label: "< 500 m" },
                  { value: "1000", label: "< 1 km" },
                  { value: "2000", label: "< 2 km" },
                ]}
              />
            </div>
            <div className="filter-group">
              <h3>Collection time</h3>
              <ChoicePills
                label="Collection day"
                options={["Any", "Today", "Tomorrow", "This week"]}
                value={draft.day}
                onChange={(day) => setDraft({ ...draft, day })}
              />
            </div>
            <div className="filter-group">
              <h3>Availability</h3>
              <ChoicePills
                label="Availability"
                options={[
                  { value: "available", label: "Available" },
                  { value: "unavailable", label: "Unavailable" },
                  { value: "all", label: "All listings" },
                ]}
                value={draft.availability}
                onChange={(availability) =>
                  setDraft({ ...draft, availability })
                }
              />
            </div>
            <div className="filter-extra">
              <label>
                <Checkbox
                  checked={draft.savedOnly}
                  onCheckedChange={(v) =>
                    setDraft({ ...draft, savedOnly: !!v })
                  }
                />
                <Heart size={16} />
                Saved food only
              </label>
              <label>
                <Checkbox
                  checked={draft.usePreferences}
                  onCheckedChange={(v) =>
                    setDraft({ ...draft, usePreferences: !!v })
                  }
                />
                <Leaf size={16} />
                Use food preferences
              </label>
            </div>
            <div className="filter-actions">
              <button
                className="primary"
                onClick={() => {
                  dispatch({ type: "filters", filters: draft });
                  setFiltersOpen(false);
                }}
              >
                Apply filters
              </button>
              <button className="secondary" onClick={reset}>
                Reset
              </button>
            </div>
          </section>
        ) : null}
      </header>
      {view === "map" && !filtersOpen && !query ? (
        <MapView listings={results} onInspect={onOpen} />
      ) : null}
      <section
        className={
          "listing-section " +
          (view === "map" && !filtersOpen && !query ? "under-map" : "")
        }
      >
        <div className="list-heading">
          <div>
            <h2>
              {query
                ? `Results for “${query}”`
                : f.savedOnly
                  ? "Saved food"
                  : "Nearby food"}
            </h2>
            <span>
              {results.length} demo listings
              {activeFilters ? " · filters applied" : ""}
            </span>
          </div>
          <div className="sort-control">
            <span>Sort by:</span>
            <SelectField
              label="Sort listings"
              value={sort}
              onChange={setSort}
              options={["Distance", "Collection time", "Quantity"]}
            />
            {view === "map" ? (
              <button className="text-button" onClick={() => setView("row")}>
                See all
              </button>
            ) : null}
          </div>
        </div>
        {results.length ? (
          <div className={view === "row" ? "food-list" : "food-grid"}>
            {results.map((l) => (
              <FoodCard
                key={l.id}
                listing={l}
                mode={view === "row" ? "row" : "grid"}
                onOpen={() => onOpen(l)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={36} />
            <h3>No food found</h3>
            <p>Try another search or adjust your filters.</p>
            <button className="primary" onClick={reset}>
              Clear search and filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
