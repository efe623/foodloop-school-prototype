import { assetUrl } from "./assets";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Clock,
  Gift,
  MapPin,
  Store,
  Phone,
  MessageCircle,
  Star,
  Check,
  ClipboardCheck,
  ExternalLink,
} from "lucide-react";
import { useDemo, type Claim } from "./state";
import { type Listing, formatTime, formatDistance } from "./data/mockListings";
import { Back, MapView, MiniCard, MetaLine, Note, allergenIcons } from "./ui";
export function Details({
  listing,
  claim,
  onBack,
  onClaim,
  onCollect,
  onLocation,
  onDonor,
  onEdit,
  canClaim = true,
}: {
  listing: Listing;
  claim?: Claim;
  onBack: () => void;
  onClaim: () => void;
  onCollect: () => void;
  onLocation: () => void;
  onDonor: (mode: string) => void;
  onEdit?: () => void;
  canClaim?: boolean;
}) {
  const { state, dispatch } = useDemo();
  const [index, setIndex] = useState(0);
  const saved = state.saved.includes(listing.id);
  const existing = state.claims.find(
    (c) => c.listing.id === listing.id && c.status === "upcoming",
  );
  const images = listing.images.length ? listing.images : [listing.image];
  const available =
    listing.quantity > 0 && listing.availability === "available";
  return (
    <div className="detail-page page-pad">
      <div className="detail-top">
        <Back onClick={onBack} />
        <div>
          <span className="subtle-label">
            {claim ? "Demo claim" : "Demo listing"}
          </span>
          <button
            className={"icon-button " + (saved ? "saved" : "")}
            aria-label={(saved ? "Unsave " : "Save ") + listing.title}
            onClick={() => dispatch({ type: "save", id: listing.id })}
          >
            <Heart size={21} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <div className="detail-grid">
        <div className="gallery">
          <div className="gallery-main">
            <img
              src={assetUrl(images[index])}
              alt={listing.title + " photo " + (index + 1)}
            />
            {images.length > 1 ? (
              <>
                <button
                  className="gallery-prev"
                  aria-label="Previous food photo"
                  onClick={() =>
                    setIndex((i) => (i + images.length - 1) % images.length)
                  }
                >
                  <ChevronLeft />
                </button>
                <button
                  className="gallery-next"
                  aria-label="Next food photo"
                  onClick={() => setIndex((i) => (i + 1) % images.length)}
                >
                  <ChevronRight />
                </button>
              </>
            ) : null}
            <span className="photo-count">
              {index + 1} / {images.length}
            </span>
            {claim ? (
              <span className="gallery-status">
                {claim.status === "collected" ? "Collected" : "Upcoming"}
              </span>
            ) : null}
          </div>
          <div className="gallery-thumbs">
            {images.map((src, i) => (
              <button
                key={i}
                className={i === index ? "selected" : ""}
                aria-label={"Show food photo " + (i + 1)}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                <img src={assetUrl(src)} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-content">
          <div className="detail-title">
            <h1>{listing.title}</h1>
            <span className="quantity">
              {claim ? claim.portions : listing.quantity}{" "}
              {(claim ? claim.portions : listing.quantity) === 1
                ? "portion"
                : "portions"}
              {claim ? " reserved" : ""}
            </span>
          </div>
          <p className="donor-name">{listing.donor}</p>
          <p className="rating">
            <Star size={16} fill="#e4b740" />
            4.8 <span>· Example rating</span>
          </p>
          <MetaLine listing={listing} />
          <div className="mobile-facts">
            <div>
              <Clock size={23} />
              <span>
                Collect by
                <strong>
                  {formatTime(listing.collectionTime)}{" "}
                  {listing.day.toLowerCase()}
                </strong>
              </span>
            </div>
            <div>
              <Gift size={23} />
              <span>
                <strong>Free</strong>No payment needed
              </span>
            </div>
          </div>
          <section>
            <h2>Description</h2>
            <p>{listing.description}</p>
          </section>
          <section>
            <h2>Type</h2>
            <span className="info-pill">
              <Store size={18} />
              {listing.category}
            </span>
          </section>
          <section>
            <h2>Quantity</h2>
            <span className="info-pill">
              <ClipboardCheck size={18} />
              {claim
                ? `${claim.portions} portion reserved in this demo`
                : `${listing.quantity} portions available`}
            </span>
          </section>
          <section>
            <h2>Allergens</h2>
            <div className="allergen-tags">
              {listing.allergens.length ? (
                listing.allergens.map((a) => {
                  const Icon = allergenIcons[a] ?? Store;
                  return (
                    <span className="info-pill" key={a}>
                      <Icon size={19} />
                      {a}
                    </span>
                  );
                })
              ) : (
                <span className="info-pill">
                  <Check size={18} />
                  None listed
                </span>
              )}
            </div>
            <p className="microcopy">
              Example allergen information for this fictional food.
            </p>
          </section>
          <section>
            <h2>Collection time</h2>
            <button className="time-info" onClick={onLocation}>
              <Clock size={23} />
              <span>
                <strong>
                  {listing.day}, {formatTime(listing.collectionFrom)} –{" "}
                  {formatTime(listing.collectionTime)}
                </strong>
                <small>Be sure to collect by the deadline</small>
              </span>
              <ChevronRight size={18} />
            </button>
          </section>
          <section>
            <h2>Collection location</h2>
            <div className="location-card">
              <MapView
                listings={[listing]}
                compact
                single
                onInspect={onLocation}
              />
              <button
                className="location-info"
                onClick={onLocation}
                aria-label="View demo collection location"
              >
                <MapPin size={22} />
                <span>
                  <strong>{listing.location.split(" · ")[0]}</strong>
                  <small>
                    {formatDistance(listing.distance, state.preferences.unit)}{" "}
                    away · fictional collection point
                  </small>
                </span>
                <ChevronRight size={19} />
              </button>
            </div>
          </section>
          <section>
            <h2>Donor information</h2>
            <div className="donor-card">
              <button className="donor-main" onClick={() => onDonor("info")}>
                <span className="donor-avatar">
                  <Store size={25} />
                </span>
                <span>
                  <strong>{listing.donor}</strong>
                  <small>Fictional demo donor</small>
                  <span className="rating">
                    <Star size={14} fill="#e4b740" />
                    4.8 · Example rating
                  </span>
                </span>
              </button>
              <div className="donor-actions">
                <button
                  className="icon-button"
                  aria-label="Simulate call to donor"
                  onClick={() => onDonor("call")}
                >
                  <Phone size={19} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Simulate donor message"
                  onClick={() => onDonor("message")}
                >
                  <MessageCircle size={19} />
                </button>
              </div>
            </div>
          </section>
          {claim?.status === "collected" ? (
            <Note>
              This simulated collection is complete. You can find it in Past
              Claims.
            </Note>
          ) : null}
          <div className="detail-action">
            {claim ? (
              claim.status === "upcoming" ? (
                <button className="primary" onClick={onCollect}>
                  <Check size={20} />
                  Mark as collected
                </button>
              ) : (
                <button className="secondary" onClick={onBack}>
                  Back to My Claims
                </button>
              )
            ) : onEdit ? (
              <button className="primary" onClick={onEdit}>
                Edit demo listing
              </button>
            ) : !canClaim ? (
              <button className="secondary" onClick={() => onDonor("info")}>
                View donor information
              </button>
            ) : (
              <button
                className="primary"
                disabled={!available}
                onClick={onClaim}
              >
                {existing
                  ? "View your claim"
                  : available
                    ? "Claim Food"
                    : "Currently unavailable"}
              </button>
            )}
            <p>
              School prototype · {claim ? "Collections" : "Claims"} are
              simulated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export function CollectionLocation({
  listing,
  onBack,
}: {
  listing: Listing;
  onBack: () => void;
}) {
  const [directions, setDirections] = useState(false);
  return (
    <div className="page-pad">
      <Back onClick={onBack} />
      <h1>Collection location</h1>
      <p className="muted">Here’s where to collect your demo food.</p>
      <div className="collection-layout">
        <div>
          <MapView
            listings={[listing]}
            single
            onInspect={() => setDirections(true)}
          />
          <div className="location-label">
            <MapPin size={20} />
            <strong>{listing.location}</strong>
          </div>
          <div className="button-pair">
            <button
              className="secondary"
              onClick={() => setDirections((s) => !s)}
            >
              <ExternalLink size={18} />
              {directions ? "Hide directions" : "Get demo directions"}
            </button>
          </div>
          {directions ? (
            <div className="directions-panel">
              <h3>Demo pickup instructions</h3>
              <ol>
                <li>Start at the fixed Jumeirah demo centre.</li>
                <li>Follow the map to {listing.location.split(" · ")[1]}.</li>
                <li>{listing.pickup}</li>
              </ol>
              <Note>This is a fictional route for the prototype.</Note>
            </div>
          ) : null}
        </div>
        <aside>
          <MiniCard listing={listing} />
          <div className="collection-fact">
            <Clock />
            <span>
              Collection time
              <strong>
                {listing.day}, {formatTime(listing.collectionTime)}
              </strong>
              <small>Be on time to collect</small>
            </span>
          </div>
          <div className="collection-fact">
            <MapPin />
            <span>
              Collection location
              <strong>{listing.location.split(" · ")[0]}</strong>
              <small>Fictional demo point</small>
            </span>
          </div>
          <h3>At the collection point</h3>
          <p className="muted">{listing.pickup}</p>
        </aside>
      </div>
    </div>
  );
}
