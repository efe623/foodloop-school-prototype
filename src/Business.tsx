import { useState } from "react";
import {
  Plus,
  Sprout,
  PackageCheck,
  Users,
  ChevronRight,
  Pencil,
  Pause,
  Play,
  Trash2,
  Clock,
  Store,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDemo } from "./state";
import { formatTime, type Listing } from "./data/mockListings";
import { FoodCard, MiniCard, Note, PageHeading } from "./ui";
export function BusinessHome({
  onShare,
  onListings,
  onOpen,
  onBrowse,
}: {
  onShare: () => void;
  onListings: () => void;
  onOpen: (l: Listing) => void;
  onBrowse: () => void;
}) {
  const { state } = useDemo();
  const own = state.listings.filter((l) => l.owner === "business");
  const active = own.filter((l) => l.availability === "available");
  const collections = state.claims.filter(
    (c) => c.listing.owner === "business" && c.status === "upcoming",
  );
  return (
    <div className="page-pad business-home">
      <PageHeading
        title="Good food. A little more good."
        subtitle="Welcome to your fictional Local Bakery Demo."
        action={
          <button className="primary" onClick={onShare}>
            <Plus size={19} />
            Share food
          </button>
        }
      />
      <div className="stats-row">
        <div>
          <span>
            <Store />
          </span>
          <strong>{active.length}</strong>
          <p>Active demo listings</p>
        </div>
        <div>
          <span>
            <Users />
          </span>
          <strong>{collections.length + 2}</strong>
          <p>Example collections</p>
        </div>
        <div>
          <span>
            <Sprout />
          </span>
          <strong>
            {12 + own.filter((l) => l.id.startsWith("demo-")).length} kg
          </strong>
          <p>Demo food saved</p>
        </div>
      </div>
      <div className="business-banner">
        <span>
          <Sprout size={29} />
        </span>
        <div>
          <h2>Give good food another chance.</h2>
          <p>
            Share a demo listing and see it appear in the Student interface.
          </p>
        </div>
        <button className="secondary" onClick={onShare}>
          Create a listing
        </button>
      </div>
      <div className="section-header">
        <h2>Your active listings</h2>
        <button className="text-button" onClick={onListings}>
          Manage listings <ChevronRight size={18} />
        </button>
      </div>
      <div className="food-grid business-grid">
        {active.slice(0, 4).map((l) => (
          <FoodCard key={l.id} listing={l} onOpen={() => onOpen(l)} />
        ))}
      </div>
      {!active.length ? (
        <Note>No active demo listings. Use Share food to create one.</Note>
      ) : null}
      <div className="section-header">
        <h2>Collections today</h2>
        <span className="subtle-label">Demonstration schedule</span>
      </div>
      <div className="collection-schedule">
        {collections.map((c) => (
          <div key={c.id}>
            <MiniCard listing={c.listing} portions={c.portions} />
            <span>
              <Clock size={18} />
              {formatTime(c.listing.collectionTime)}
            </span>
            <span className="status-pill">Student Demo</span>
          </div>
        ))}
        <div>
          <MiniCard
            listing={own.find((l) => l.id === "pastries") ?? state.listings[0]}
            portions={1}
          />
          <span>
            <Clock size={18} />
            4:00 PM
          </span>
          <span className="status-pill">Example collection</span>
        </div>
      </div>
      <button className="secondary browse-button" onClick={onBrowse}>
        Browse all demo food
      </button>
      <p className="page-disclaimer">
        All businesses, collection schedules and statistics are fictional demo
        data.
      </p>
    </div>
  );
}
export function MyListings({
  onShare,
  onOpen,
  onEdit,
  onDelete,
}: {
  onShare: () => void;
  onOpen: (l: Listing) => void;
  onEdit: (l: Listing) => void;
  onDelete: (l: Listing) => void;
}) {
  const { state, dispatch } = useDemo();
  const [tab, setTab] = useState("active");
  const own = state.listings.filter((l) => l.owner === "business");
  const active = own.filter((l) => l.availability !== "completed");
  const past = own.filter((l) => l.availability === "completed");
  return (
    <div className="page-pad">
      <PageHeading
        title="My Listings"
        subtitle="Manage food shared in this local demo."
        action={
          <button className="primary" onClick={onShare}>
            <Plus size={18} />
            New listing
          </button>
        }
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="wide-tabs">
          <TabsTrigger value="active">
            Active <b>{active.length}</b>
          </TabsTrigger>
          <TabsTrigger value="past">
            Past <b>{past.length}</b>
          </TabsTrigger>
        </TabsList>
        {[
          ["active", active],
          ["past", past],
        ].map(([name, items]) => (
          <TabsContent key={name as string} value={name as string}>
            <div className="managed-listings">
              {(items as Listing[]).map((l) => (
                <article key={l.id} className="managed-listing">
                  <button
                    className="managed-open"
                    onClick={() => onOpen(l)}
                    aria-label={"View " + l.title}
                  >
                    <MiniCard listing={l} />
                    <span>
                      <Clock size={17} />
                      Collect by {formatTime(l.collectionTime)}{" "}
                      {l.day.toLowerCase()}
                    </span>
                    <span
                      className={
                        "status-pill " +
                        (l.availability === "paused" ? "paused" : "")
                      }
                    >
                      {l.availability === "available"
                        ? "Active"
                        : l.availability === "paused"
                          ? "Paused"
                          : "Completed"}
                    </span>
                  </button>
                  <div className="manage-actions">
                    <button className="secondary" onClick={() => onEdit(l)}>
                      <Pencil size={16} />
                      Edit
                    </button>
                    {l.availability !== "completed" ? (
                      <>
                        <button
                          className="secondary"
                          onClick={() =>
                            dispatch({
                              type: "availability",
                              id: l.id,
                              availability:
                                l.availability === "paused"
                                  ? "available"
                                  : "paused",
                            })
                          }
                        >
                          {l.availability === "paused" ? (
                            <Play size={16} />
                          ) : (
                            <Pause size={16} />
                          )}{" "}
                          {l.availability === "paused" ? "Resume" : "Pause"}
                        </button>
                        <button
                          className="secondary"
                          onClick={() =>
                            dispatch({
                              type: "availability",
                              id: l.id,
                              availability: "completed",
                            })
                          }
                        >
                          <PackageCheck size={16} />
                          Complete
                        </button>
                      </>
                    ) : (
                      <button
                        className="secondary"
                        onClick={() =>
                          dispatch({
                            type: "availability",
                            id: l.id,
                            availability: "available",
                          })
                        }
                      >
                        <Play size={16} />
                        Reopen
                      </button>
                    )}
                    <button
                      className="icon-button danger"
                      aria-label={"Delete " + l.title + " demo listing"}
                      onClick={() => onDelete(l)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
            {!(items as Listing[]).length ? (
              <div className="empty-state">
                <Store size={38} />
                <h3>No {name as string} listings</h3>
                <button className="primary" onClick={onShare}>
                  Share demo food
                </button>
              </div>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
      <p className="page-disclaimer">
        Changes affect this browser’s demo only.
      </p>
    </div>
  );
}
