import { assetUrl } from "./assets";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import {
  Home as HomeIcon,
  ClipboardCheck,
  Plus,
  User,
  Store,
  Sprout,
  GraduationCap,
  PanelsTopLeft,
  RefreshCcw,
  Check,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Info,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { DemoProvider, useDemo, filterListings, type Claim } from "./state";
import { type Role, type Listing, formatTime } from "./data/mockListings";
import { Brand, ChoicePills, MiniCard, Note } from "./ui";
import Home from "./Home";
import { Details, CollectionLocation } from "./Details";
import Claims from "./Claims";
import Share from "./Share";
import { BusinessHome, MyListings } from "./Business";
import Profile, { type ProfilePage } from "./Profile";
type Screen =
  | "home"
  | "browse"
  | "food"
  | "claims"
  | "collection"
  | "location"
  | "share"
  | "listings"
  | "claimed"
  | "collected"
  | "published"
  | ProfilePage;
interface Route {
  screen: Screen;
  id?: string;
  claimId?: string;
}
type Modal = {
  kind: "claim" | "collect" | "donor" | "delete" | "reset";
  listing?: Listing;
  claim?: Claim;
  mode?: string;
} | null;
const profileScreens: Screen[] = [
  "profile",
  "demo-details",
  "edit-profile",
  "preferences",
  "notifications",
  "settings",
  "privacy",
  "location-settings",
  "impact",
  "help",
];
type EntryRole = Role | "teacher";
function RoleSelector({ onChoose }: { onChoose: (r: EntryRole) => void }) {
  return (
    <div className="role-page">
      <header className="role-header">
        <Brand />
        <span className="demo-badge">School prototype</span>
      </header>
      <main className="role-main">
        <div className="role-intro">
          <span className="eyebrow">
            A little less waste. A little more good.
          </span>
          <h1>How will you use FoodLoop?</h1>
          <p>Choose a role to explore the demo.</p>
        </div>
        <div className="role-cards">
          {[
            {
              id: "student" as EntryRole,
              title: "Student",
              image: "/images/student.jpg",
              icon: GraduationCap,
              description:
                "Find surplus food available nearby, view food details, claim available food, and keep track of your collections.",
              action: "Continue as Student",
              alt: "Stock photograph of a student with a backpack and books",
            },
            {
              id: "business" as EntryRole,
              title: "Business / Donor",
              image: "/images/bakery.jpg",
              icon: Store,
              description:
                "Share surplus food that would otherwise go to waste, create food listings, and manage food collections.",
              action: "Continue as Business",
              alt: "Stock photograph of a welcoming bakery interior",
            },
            {
              id: "teacher" as EntryRole,
              title: "Ms. Watson",
              image: "/images/sandwiches.jpg",
              icon: PanelsTopLeft,
              description:
                "Explore both the Student and Business interfaces. Switch between finding food and sharing food while reviewing the prototype.",
              action: "Continue as Ms. Watson",
              alt: "Stock photograph of sandwiches for the FoodLoop prototype",
            },
          ].map((r) => (
            <article className="role-card" key={r.id}>
              <div className="role-photo">
                <img src={assetUrl(r.image)} alt={r.alt} />
                <span className="role-icon">
                  <r.icon />
                </span>
              </div>
              <div className="role-body">
                <h2>{r.title}</h2>
                <p>{r.description}</p>
                <button className="primary" onClick={() => onChoose(r.id)}>
                  {r.action}
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
function Success({
  kind,
  listing,
  onPrimary,
  onHome,
}: {
  kind: "claimed" | "collected" | "published";
  listing: Listing;
  onPrimary: () => void;
  onHome: () => void;
}) {
  const copy = {
    claimed: {
      title: "Food claimed!",
      text: `You’ve successfully claimed one demo portion of ${listing.title}.`,
      primary: "View collection details",
    },
    collected: {
      title: "Marked as collected!",
      text: "This simulated collection has been moved to your Past Claims.",
      primary: "View My Claims",
    },
    published: {
      title: "Listing published!",
      text: "Your demo listing has been added to this browser. Switch to Student to explore it.",
      primary: "View listing",
    },
  }[kind];
  return (
    <div className="success-page">
      <div className="success-confetti" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 31) % 100}%`,
              top: `${(i * 23) % 90}%`,
              transform: `rotate(${i * 42}deg)`,
            }}
          />
        ))}
      </div>
      <div className="success-inner">
        <span className="success-check">
          <Check size={53} strokeWidth={2.5} />
        </span>
        <h1>{copy.title}</h1>
        <p>{copy.text}</p>
        <MiniCard
          listing={listing}
          portions={kind === "published" ? listing.quantity : 1}
        />
        <button className="primary dark-primary" onClick={onPrimary}>
          {copy.primary}
        </button>
        <button className="secondary" onClick={onHome}>
          Back to home
        </button>
        <span className="subtle-label">
          School prototype · Demo interaction only
        </span>
      </div>
    </div>
  );
}
interface ModelContext {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
}
function FoodLoop() {
  const { state, dispatch, storageAvailable } = useDemo();
  const [role, setRole] = useState<Role | null>(null);
  const [teacherMode, setTeacherMode] = useState(false);
  const [route, setRoute] = useState<Route>({ screen: "home" });
  const [history, setHistory] = useState<Route[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [claimTab, setClaimTab] = useState("upcoming");
  const [editing, setEditing] = useState<Listing | undefined>();
  const [donorMessage, setDonorMessage] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  function navigate(next: Route) {
    setHistory((h) => [...h, route]);
    setRoute(next);
    setModal(null);
    window.scrollTo({ top: 0 });
  }
  function back() {
    setHistory((h) => {
      const prev = h.at(-1);
      setRoute(prev ?? { screen: "home" });
      return h.slice(0, -1);
    });
    setModal(null);
    window.scrollTo({ top: 0 });
  }
  function choose(r: EntryRole) {
    setTeacherMode(r === "teacher");
    viewAs(r === "teacher" ? "student" : r);
  }
  function viewAs(r: Role) {
    window.scrollTo({ top: 0 });
    setRole(r);
    setRoute({ screen: "home" });
    setHistory([]);
    setEditing(undefined);
    setModal(null);
  }
  function switchRole() {
    window.scrollTo({ top: 0 });
    setRole(null);
    setTeacherMode(false);
    setRoute({ screen: "home" });
    setHistory([]);
    setEditing(undefined);
    setModal(null);
  }
  function openFood(l: Listing) {
    navigate({ screen: "food", id: l.id });
  }
  function openClaim(c: Claim) {
    navigate({ screen: "collection", claimId: c.id, id: c.listing.id });
  }
  function share(l?: Listing) {
    setEditing(l);
    navigate({ screen: "share" });
  }
  const selectedClaim = state.claims.find((c) => c.id === route.claimId);
  const listing =
    route.screen === "collection" || route.screen === "collected"
      ? selectedClaim?.listing
      : (state.listings.find((l) => l.id === route.id) ??
        selectedClaim?.listing);
  const currentClaim = listing
    ? state.claims.find(
        (c) => c.listing.id === listing.id && c.status === "upcoming",
      )
    : undefined;
  function confirmClaim() {
    const l = modal?.listing;
    if (!l) return;
    const id = "claim-" + crypto.randomUUID();
    dispatch({
      type: "claim",
      listingId: l.id,
      id,
      date: new Date().toISOString(),
    });
    navigate({ screen: "claimed", id: l.id, claimId: id });
  }
  function confirmCollected() {
    const c = modal?.claim;
    if (!c) return;
    dispatch({ type: "collect", id: c.id, date: new Date().toISOString() });
    navigate({ screen: "collected", id: c.listing.id, claimId: c.id });
    setClaimTab("collected");
  }
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.preferences.dark);
    return () => document.documentElement.classList.remove("dark");
  }, [state.preferences.dark]);
  useEffect(() => {
    const h = screenRef.current?.querySelector<HTMLElement>("h1");
    if (h) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
    }
  }, [route, role]);
  const bridge = useRef({
    state,
    role,
    choose,
    openFood,
    startClaim: (id: string) => {
      const l = state.listings.find((x) => x.id === id);
      if (role !== "student") throw new Error("Choose Student first.");
      if (!l || l.quantity < 1 || l.availability !== "available")
        throw new Error("Demo food is unavailable.");
      if (
        state.claims.some((c) => c.listing.id === id && c.status === "upcoming")
      )
        throw new Error("This food already has an upcoming demo claim.");
      setModal({ kind: "claim", listing: l });
    },
  });
  bridge.current = {
    state,
    role,
    choose,
    openFood,
    startClaim: (id: string) => {
      const l = state.listings.find((x) => x.id === id);
      if (role !== "student") throw new Error("Choose Student first.");
      if (!l || l.quantity < 1 || l.availability !== "available")
        throw new Error("Demo food is unavailable.");
      if (
        state.claims.some((c) => c.listing.id === id && c.status === "upcoming")
      )
        throw new Error("This food already has an upcoming demo claim.");
      setModal({ kind: "claim", listing: l });
    },
  };
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const life = new AbortController();
    const add = (tool: Parameters<ModelContext["registerTool"]>[0]) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: life.signal }),
        ).catch(() => {});
      } catch {
        /* Unsupported optional browser API. */
      }
    };
    add({
      name: "search_demo_food",
      title: "Search demo food",
      description:
        "Read matching fictional FoodLoop listings using the current category and distance filters.",
      inputSchema: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        const q = (input as { query?: unknown })?.query;
        if (typeof q !== "string") throw new Error("query must be a string");
        return filterListings(bridge.current.state, q).map((l) => ({
          id: l.id,
          title: l.title,
          quantity: l.quantity,
          distance: l.distance,
          category: l.category,
        }));
      },
    });
    add({
      name: "choose_demo_role",
      title: "Choose demo role",
      description:
        "Enter the Student, Business or Ms. Watson review interface without an account.",
      inputSchema: {
        type: "object",
        properties: { role: { enum: ["student", "business", "teacher"] } },
        required: ["role"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const r = (input as { role?: unknown })?.role;
        if (r !== "student" && r !== "business" && r !== "teacher")
          throw new Error("role must be student, business or teacher");
        flushSync(() => bridge.current.choose(r));
        return { role: r, screen: "home" };
      },
    });
    add({
      name: "open_demo_food_details",
      title: "Open demo food details",
      description:
        "Navigate to details for a fictional demo listing. Does not claim food.",
      inputSchema: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const id = (input as { id?: unknown })?.id;
        if (typeof id !== "string") throw new Error("id must be a string");
        if (!bridge.current.role) throw new Error("Choose a demo role first");
        const l = bridge.current.state.listings.find((l) => l.id === id);
        if (!l) throw new Error("Unknown demo listing");
        flushSync(() => bridge.current.openFood(l));
        return { id, screen: "food-details" };
      },
    });
    add({
      name: "start_demo_claim",
      title: "Start demo claim",
      description:
        "Open the simulated claim confirmation for a demo listing. Confirmation still requires the visible Confirm claim control.",
      inputSchema: {
        type: "object",
        properties: { id: { type: "string" } },
        required: ["id"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const id = (input as { id?: unknown })?.id;
        if (typeof id !== "string") throw new Error("id must be a string");
        flushSync(() => bridge.current.startClaim(id));
        return { id, state: "awaiting-demo-confirmation" };
      },
    });
    return () => life.abort();
  }, []);
  const navItems =
    role === "business"
      ? [
          { screen: "home" as Screen, title: "Home", icon: HomeIcon },
          { screen: "share" as Screen, title: "Share Food", icon: Plus },
          { screen: "listings" as Screen, title: "My Listings", icon: Store },
          { screen: "profile" as Screen, title: "Profile", icon: User },
        ]
      : [
          { screen: "home" as Screen, title: "Home", icon: HomeIcon },
          {
            screen: "claims" as Screen,
            title: "My Claims",
            icon: ClipboardCheck,
          },
          { screen: "profile" as Screen, title: "Profile", icon: User },
        ];
  const activeScreen = profileScreens.includes(route.screen)
    ? "profile"
    : ["food", "browse", "claimed", "published"].includes(route.screen)
      ? "home"
      : ["collection", "collected", "location"].includes(route.screen)
        ? role === "student"
          ? "claims"
          : "home"
        : route.screen;
  const goMain = (screen: Screen) =>
    screen === "share" ? share() : navigate({ screen });
  let content;
  if (route.screen === "home")
    content =
      role === "business" ? (
        <BusinessHome
          onShare={() => share()}
          onListings={() => navigate({ screen: "listings" })}
          onOpen={openFood}
          onBrowse={() => navigate({ screen: "browse" })}
        />
      ) : (
        <Home onOpen={openFood} />
      );
  else if (route.screen === "browse") content = <Home onOpen={openFood} />;
  else if (route.screen === "claims")
    content = (
      <Claims
        tab={claimTab}
        onTabChange={setClaimTab}
        onOpen={openClaim}
        onHome={() => navigate({ screen: "home" })}
      />
    );
  else if (route.screen === "food" || route.screen === "collection")
    content = listing ? (
      <Details
        key={route.screen + "-" + listing.id}
        listing={listing}
        claim={route.screen === "collection" ? selectedClaim : undefined}
        onBack={back}
        onClaim={() => {
          if (currentClaim) openClaim(currentClaim);
          else setModal({ kind: "claim", listing });
        }}
        onCollect={() =>
          setModal({ kind: "collect", claim: selectedClaim, listing })
        }
        onLocation={() =>
          navigate({
            screen: "location",
            id: listing.id,
            claimId: selectedClaim?.id,
          })
        }
        onDonor={(mode) => {
          setDonorMessage(false);
          setModal({ kind: "donor", listing, mode });
        }}
        canClaim={role === "student"}
        onEdit={
          role === "business" && listing.owner === "business"
            ? () => share(listing)
            : undefined
        }
      />
    ) : (
      <Note>
        This demo listing is no longer available. Use Home to explore other
        food.
      </Note>
    );
  else if (route.screen === "location")
    content = listing ? (
      <CollectionLocation listing={listing} onBack={back} />
    ) : null;
  else if (["claimed", "collected", "published"].includes(route.screen))
    content = listing ? (
      <Success
        kind={route.screen as "claimed" | "collected" | "published"}
        listing={listing}
        onHome={() => navigate({ screen: "home" })}
        onPrimary={() => {
          if (route.screen === "claimed") {
            const c = state.claims.find((c) => c.id === route.claimId);
            if (c) openClaim(c);
          } else if (route.screen === "collected") {
            setClaimTab("collected");
            navigate({ screen: "claims" });
          } else openFood(listing);
        }}
      />
    ) : null;
  else if (route.screen === "share")
    content = (
      <Share
        key={editing?.id ?? "new"}
        editing={editing}
        onCancel={() => navigate({ screen: "home" })}
        onPublish={(l) => {
          dispatch({ type: "publish", listing: l });
          navigate({ screen: "published", id: l.id });
        }}
      />
    );
  else if (route.screen === "listings")
    content = (
      <MyListings
        onShare={() => share()}
        onOpen={openFood}
        onEdit={share}
        onDelete={(l) => setModal({ kind: "delete", listing: l })}
      />
    );
  else
    content = (
      <Profile
        key={route.screen + "-" + role}
        page={route.screen as ProfilePage}
        role={role ?? "student"}
        onNav={(screen) => navigate({ screen })}
        onBack={back}
        onSwitch={switchRole}
        onReset={() => setModal({ kind: "reset" })}
        onClaims={() => navigate({ screen: "claims" })}
        onListings={() => navigate({ screen: "listings" })}
        onExplore={() =>
          navigate({ screen: role === "business" ? "browse" : "home" })
        }
      />
    );
  return (
    <>
      {!role ? (
        <RoleSelector onChoose={choose} />
      ) : (
        <SidebarProvider
          className="foodloop-shell"
          style={{ "--sidebar-width": "218px" } as CSSProperties}
        >
          <Sidebar className="app-sidebar" collapsible="none">
            <SidebarHeader>
              <button
                className="brand-button"
                onClick={() => navigate({ screen: "home" })}
                aria-label="FoodLoop Home"
              >
                <Brand />
              </button>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((n) => (
                  <SidebarMenuItem key={n.screen}>
                    <SidebarMenuButton
                      isActive={activeScreen === n.screen}
                      onClick={() => goMain(n.screen)}
                      className="side-nav-button"
                    >
                      <n.icon size={21} />
                      <span>{n.title}</span>
                      {n.screen === "claims" ? (
                        <b>
                          {
                            state.claims.filter((c) => c.status === "upcoming")
                              .length
                          }
                        </b>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <div className="sidebar-note">
                <Sprout size={22} />
                <p>Good food should be used.</p>
                <span>School CS prototype</span>
              </div>
            </SidebarContent>
            <SidebarFooter>
              <button
                className="sidebar-person"
                onClick={() => navigate({ screen: "profile" })}
              >
                <span>
                  <User size={20} />
                </span>
                <div>
                  <strong>
                    {teacherMode
                      ? "Ms. Watson"
                      : role === "student"
                        ? "Student Demo"
                        : "Local Bakery Demo"}
                  </strong>
                  <small>
                    {teacherMode
                      ? "Reviewing both interfaces"
                      : role === "student"
                        ? "Student"
                        : "Business / Donor"}
                  </small>
                </div>
              </button>
              <button className="switch-role" onClick={switchRole}>
                <RefreshCcw size={15} />
                Switch role
              </button>
            </SidebarFooter>
          </Sidebar>
          <main className="app-main">
            <div className="app-status">
              <span>
                <Sprout size={14} />
                FoodLoop demo
              </span>
              <span>
                {role === "student" ? "Student" : "Business / Donor"} <i>·</i>{" "}
                Fictional content
              </span>
            </div>
            <div className="mobile-brand">
              <Brand />
              <span className="demo-badge">Demo</span>
            </div>
            {teacherMode ? (
              <section
                className="teacher-toolbar"
                aria-label="Ms. Watson review mode"
              >
                <div>
                  <strong>Ms. Watson</strong>
                  <span>Explore both interfaces</span>
                </div>
                <ChoicePills
                  label="Interface to review"
                  value={role}
                  onChange={(next) => {
                    if (next === "student" || next === "business") viewAs(next);
                  }}
                  options={[
                    { value: "student", label: "Student" },
                    { value: "business", label: "Business / Donor" },
                  ]}
                />
              </section>
            ) : null}
            <div ref={screenRef} className="screen-content">
              {content}
            </div>
            {!storageAvailable ? (
              <Note>
                Browser storage is unavailable. This demo will last for the
                current session.
              </Note>
            ) : null}
          </main>
          <nav className="mobile-nav" aria-label="Main navigation">
            {navItems.map((n) => (
              <button
                key={n.screen}
                className={
                  (activeScreen === n.screen ? "active " : "") +
                  (n.screen === "share" ? "share-nav" : "")
                }
                onClick={() => goMain(n.screen)}
                aria-current={activeScreen === n.screen ? "page" : undefined}
              >
                <span>
                  <n.icon size={22} />
                </span>
                {n.title}
              </button>
            ))}
          </nav>
        </SidebarProvider>
      )}
      <Dialog
        open={!!modal && ["claim", "collect", "donor"].includes(modal.kind)}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent className="prototype-dialog">
          {modal?.kind === "claim" && modal.listing ? (
            <>
              <span className="modal-symbol">
                <ClipboardCheck size={34} />
              </span>
              <DialogTitle>Confirm claim</DialogTitle>
              <DialogDescription>
                Reserve one demo portion and collect it within the example
                collection window.
              </DialogDescription>
              <MiniCard listing={modal.listing} portions={1} />
              <div className="modal-facts">
                <span>
                  <Clock size={19} />
                  {modal.listing.day},{" "}
                  {formatTime(modal.listing.collectionTime)}
                </span>
                <span>
                  <MapPin size={19} />
                  {modal.listing.location}
                </span>
              </div>
              <Note>
                This is a simulated claim, not a real food reservation.
              </Note>
              <button className="primary" onClick={confirmClaim}>
                Confirm claim
              </button>
              <button className="secondary" onClick={() => setModal(null)}>
                Cancel
              </button>
            </>
          ) : modal?.kind === "collect" && modal.listing ? (
            <>
              <span className="modal-symbol">
                <Check size={36} />
              </span>
              <DialogTitle>Mark as collected?</DialogTitle>
              <DialogDescription>
                Confirm this simulated food collection to move it to Past
                Claims.
              </DialogDescription>
              <MiniCard
                listing={modal.listing}
                portions={modal.claim?.portions ?? 1}
              />
              <button className="primary" onClick={confirmCollected}>
                Yes, mark as collected
              </button>
              <button className="secondary" onClick={() => setModal(null)}>
                Cancel
              </button>
            </>
          ) : modal?.kind === "donor" && modal.listing ? (
            <>
              <span className="modal-symbol">
                {modal.mode === "call" ? (
                  <Phone size={30} />
                ) : modal.mode === "message" ? (
                  <MessageCircle size={30} />
                ) : (
                  <Store size={30} />
                )}
              </span>
              <DialogTitle>
                {modal.mode === "call"
                  ? "Demo donor call"
                  : modal.mode === "message"
                    ? "Demo donor message"
                    : "Donor information"}
              </DialogTitle>
              <DialogDescription>
                {modal.listing.donor} is a fictional donor used in the FoodLoop
                school prototype.
              </DialogDescription>
              {modal.mode === "call" ? (
                <div className="simulated-call">
                  <Phone size={25} />
                  <strong>Example call connected</strong>
                  <p>
                    “Please collect your demo food from the marked collection
                    counter.”
                  </p>
                  <small>No real phone call is made.</small>
                </div>
              ) : modal.mode === "message" ? (
                <div className="simulated-message">
                  <p>
                    <strong>Fictional donor</strong>
                    <br />
                    “Your example food is ready at the demo collection point.”
                  </p>
                  {donorMessage ? (
                    <p className="outgoing">
                      “Thank you! I’ll collect it within the demo window.”
                    </p>
                  ) : (
                    <button
                      className="secondary"
                      onClick={() => setDonorMessage(true)}
                    >
                      Try example reply
                    </button>
                  )}
                  <small>Messages stay in this demonstration dialog.</small>
                </div>
              ) : (
                <>
                  <MiniCard listing={modal.listing} />
                  <Note>
                    Example rating: 4.8. Collection point:{" "}
                    {modal.listing.location}.
                  </Note>
                </>
              )}
              <button className="primary" onClick={() => setModal(null)}>
                {modal.mode === "call" ? "End demo call" : "Done"}
              </button>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!modal && ["reset", "delete"].includes(modal.kind)}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <AlertDialogContent className="prototype-dialog">
          <AlertDialogTitle>
            {modal?.kind === "reset"
              ? "Reset the demo?"
              : "Delete this demo listing?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {modal?.kind === "reset"
              ? "Restore the original fictional food, claims and settings. Temporary demo changes in this browser will be cleared."
              : `Remove ${modal?.listing?.title ?? "this listing"} from this local prototype. Claims already made remain in My Claims.`}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="secondary">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="primary"
              onClick={() => {
                if (modal?.kind === "reset") {
                  dispatch({ type: "reset" });
                  switchRole();
                } else if (modal?.listing) {
                  dispatch({ type: "delete", id: modal.listing.id });
                  setModal(null);
                }
              }}
            >
              {modal?.kind === "reset" ? "Reset Demo" : "Delete demo listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export default function App() {
  return (
    <DemoProvider>
      <FoodLoop />
    </DemoProvider>
  );
}
