import { assetUrl } from "./assets";
import {
  ClipboardCheck,
  ChevronRight,
  Clock,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDemo, type Claim } from "./state";
import { formatTime, formatDistance } from "./data/mockListings";
import { PageHeading } from "./ui";
export default function Claims({
  tab,
  onTabChange,
  onOpen,
  onHome,
}: {
  tab: string;
  onTabChange: (s: string) => void;
  onOpen: (c: Claim) => void;
  onHome: () => void;
}) {
  const { state } = useDemo();
  return (
    <div className="page-pad">
      <PageHeading
        title="My Claims"
        subtitle="Your demo food collections, all in one place."
      />
      <Tabs value={tab} onValueChange={onTabChange}>
        <TabsList className="wide-tabs">
          <TabsTrigger value="upcoming">
            Upcoming{" "}
            <b>{state.claims.filter((c) => c.status === "upcoming").length}</b>
          </TabsTrigger>
          <TabsTrigger value="collected">
            Past{" "}
            <b>{state.claims.filter((c) => c.status === "collected").length}</b>
          </TabsTrigger>
        </TabsList>
        {["upcoming", "collected"].map((status) => (
          <TabsContent value={status} key={status}>
            <div className="claims-list">
              {state.claims
                .filter((c) => c.status === status)
                .map((c) => (
                  <button
                    className="claim-card"
                    key={c.id}
                    onClick={() => onOpen(c)}
                    aria-label={"Collection details for " + c.listing.title}
                  >
                    <img
                      src={assetUrl(c.listing.image)}
                      alt={c.listing.title}
                    />
                    <div className="claim-info">
                      <h3>{c.listing.title}</h3>
                      <p>{c.listing.donor}</p>
                      <span className="quantity">
                        {c.portions} demo portion
                      </span>
                      <div className="claim-metadata">
                        {status === "upcoming" ? (
                          <>
                            <span>
                              <Clock size={17} />
                              {c.listing.day},{" "}
                              {formatTime(c.listing.collectionTime)}
                            </span>
                            <span>
                              <MapPin size={17} />
                              {formatDistance(
                                c.listing.distance,
                                state.preferences.unit,
                              )}{" "}
                              away
                            </span>
                          </>
                        ) : (
                          <span>
                            <CalendarDays size={17} />
                            Collected on{" "}
                            {new Date(c.collectedAt!).toLocaleDateString(
                              "en-GB",
                              {
                                timeZone: "Asia/Dubai",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={
                        "status-pill " +
                        (status === "collected" ? "collected" : "")
                      }
                    >
                      {status === "upcoming" ? "Upcoming" : "Collected"}
                    </span>
                    <ChevronRight className="claim-chevron" size={21} />
                  </button>
                ))}
            </div>
            {!state.claims.some((c) => c.status === status) ? (
              <div className="empty-state">
                <ClipboardCheck size={40} />
                <h3>
                  {status === "upcoming"
                    ? "No upcoming claims"
                    : "No past claims yet"}
                </h3>
                <p>
                  {status === "upcoming"
                    ? "Find something nearby and simulate your first claim."
                    : "Mark an upcoming demo claim as collected to see it here."}
                </p>
                <button className="primary" onClick={onHome}>
                  Explore food
                </button>
              </div>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
      <p className="page-disclaimer">
        These are fictional claims. No real food is reserved.
      </p>
    </div>
  );
}
