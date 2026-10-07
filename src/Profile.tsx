import { useState } from "react";
import {
  User,
  Store,
  GraduationCap,
  ClipboardCheck,
  Leaf,
  Bell,
  Settings,
  RefreshCcw,
  BarChart3,
  HelpCircle,
  Shield,
  MapPin,
  Globe,
  Moon,
  Sun,
  Trash2,
  ChevronRight,
  Sprout,
  Users,
  Cloud,
  Camera,
  Check,
  Search,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useDemo } from "./state";
import { allergenOptions, categories, type Role } from "./data/mockListings";
import {
  Back,
  MenuRow,
  Note,
  PageHeading,
  SelectField,
  ChoicePills,
  allergenIcons,
} from "./ui";
const personas = {
  student: ["Student Demo", "FoodLoop Student", "Campus Explorer Demo"],
  business: ["Local Bakery Demo", "FoodLoop Donor", "Community Café Demo"],
};
const helpItems = [
  [
    "How FoodLoop works",
    "Choose Student to find fictional food and simulate a claim. Choose Business / Donor to create an example listing. Switch roles from Profile or the sidebar to explore both interfaces.",
  ],
  [
    "Sharing food guidelines",
    "Use an included demo photo, add a fictional title and description, choose portions and allergens, then select a collection window and a fixed demo point. Review your listing before publishing it locally.",
  ],
  [
    "Collection and safety tips",
    "Open My Claims and select an upcoming claim to inspect its time, demo location and fictional donor. Mark it as collected and confirm to move it to Past Claims. No real food is reserved or collected.",
  ],
  [
    "Payments and payouts",
    "All food in this school prototype is free. The application has no card details, bank details, payment service or real transactions.",
  ],
  [
    "Resetting the demo",
    "Open Settings and choose Reset Demo. This restores the original fictional listings, claims and preferences, then returns to Choose Role.",
  ],
  [
    "Privacy and local data",
    "The prototype has no accounts and requests no personal details or location permissions. Claims, settings and demo listings stay in browser storage. Example image files are processed locally.",
  ],
  [
    "Contact and support",
    "This is a Computer Science school project. Donor calls and messages are illustrated locally. They never contact a real person or send a message.",
  ],
];
export type ProfilePage =
  | "profile"
  | "demo-details"
  | "edit-profile"
  | "preferences"
  | "notifications"
  | "settings"
  | "privacy"
  | "location-settings"
  | "impact"
  | "help";
export default function Profile({
  page,
  role,
  onNav,
  onBack,
  onSwitch,
  onReset,
  onClaims,
  onListings,
  onExplore,
}: {
  page: ProfilePage;
  role: Role;
  onNav: (p: ProfilePage) => void;
  onBack: () => void;
  onSwitch: () => void;
  onReset: () => void;
  onClaims: () => void;
  onListings: () => void;
  onExplore: () => void;
}) {
  const { state, dispatch, storageAvailable } = useDemo();
  const prefs = state.preferences;
  const [nameChoice, setNameChoice] = useState(prefs.persona);
  const [avatar, setAvatar] = useState(prefs.avatar ?? 0);
  const [diet, setDiet] = useState(prefs.diet);
  const [avoid, setAvoid] = useState(prefs.avoid);
  const [types, setTypes] = useState(prefs.types);
  const [period, setPeriod] = useState("Last 3 months");
  const [helpQuery, setHelpQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const completed = state.claims.filter((c) => c.status === "collected").length;
  const custom = state.listings.filter((l) => l.id.startsWith("demo-")).length;
  const name = personas[role][prefs.persona % 3];
  const stats = [
    { icon: Sprout, value: 12 + custom, label: "Foods shared" },
    {
      icon: Users,
      value: 8 + Math.max(0, completed - 1),
      label: "Foods collected",
    },
    {
      icon: Cloud,
      value: 20 + custom * 2 + Math.max(0, completed - 1) + " kg",
      label: "Demo CO₂ saved",
    },
  ];
  function savePrefs() {
    dispatch({ type: "preferences", preferences: { diet, avoid, types } });
    setSaved(true);
  }
  return (
    <div className="page-pad profile-page">
      {page !== "profile" ? <Back onClick={onBack} /> : null}
      {page === "profile" ? (
        <>
          <PageHeading title="Profile" />
          <div className="profile-identity">
            <span className={"profile-avatar avatar-" + (prefs.avatar ?? 0)}>
              <Sprout size={44} />
            </span>
            <div>
              <h2>{name}</h2>
              <p>
                {role === "student" ? "Student demo" : "Business / Donor demo"}
              </p>
              <button
                className="secondary"
                onClick={() => onNav("edit-profile")}
              >
                <User size={16} />
                Edit demo profile
              </button>
            </div>
            <span className="demo-badge">Fictional profile</span>
          </div>
          <div className="stats-row">
            {stats.map((s) => (
              <div key={s.label}>
                <span>
                  <s.icon />
                </span>
                <strong>{s.value}</strong>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
          <button className="impact-banner" onClick={() => onNav("impact")}>
            <Sprout size={29} />
            <span>
              <strong>Making a difference</strong>
              <small>Explore the example impact of reducing food waste.</small>
            </span>
            <ChevronRight size={20} />
          </button>
          <div className="profile-menu">
            <MenuRow
              icon={User}
              title="Demo details"
              subtitle="Fictional profile information"
              onClick={() => onNav("demo-details")}
            />
            <MenuRow
              icon={role === "student" ? ClipboardCheck : Store}
              title={role === "student" ? "My Claims" : "My Listings"}
              onClick={role === "student" ? onClaims : onListings}
            />
            <MenuRow
              icon={Leaf}
              title="Food preferences"
              onClick={() => onNav("preferences")}
            />
            <MenuRow
              icon={Bell}
              title="Notifications"
              onClick={() => onNav("notifications")}
            />
            <MenuRow
              icon={BarChart3}
              title="My impact"
              onClick={() => onNav("impact")}
            />
            <MenuRow
              icon={Settings}
              title="Settings"
              onClick={() => onNav("settings")}
            />
            <MenuRow
              icon={HelpCircle}
              title="Help & support"
              onClick={() => onNav("help")}
            />
            <MenuRow icon={RefreshCcw} title="Switch role" onClick={onSwitch} />
          </div>
          <p className="page-disclaimer">
            All profile information and statistics are demonstration data.
          </p>
        </>
      ) : null}
      {page === "edit-profile" ? (
        <>
          <PageHeading
            title="Edit demo profile"
            subtitle="Choose a fictional profile for the prototype."
          />
          <div className="edit-profile-layout">
            <div>
              <span className={"profile-avatar avatar-" + avatar}>
                <Sprout size={52} />
              </span>
              <button
                className="secondary"
                onClick={() => setAvatar((a) => (a + 1) % 3)}
              >
                <Camera size={17} />
                Change demo avatar
              </button>
            </div>
            <div>
              <label className="form-field">
                Demo display name
                <SelectField
                  label="Demo display name"
                  value={String(nameChoice)}
                  onChange={(v) => {
                    setNameChoice(Number(v));
                    setSaved(false);
                  }}
                  options={personas[role].map((label, i) => ({
                    value: String(i),
                    label,
                  }))}
                />
              </label>
              <label className="form-field">
                About this demo
                <textarea
                  readOnly
                  rows={3}
                  value={
                    role === "student"
                      ? "A fictional student exploring surplus food and simulated collections around Jumeirah, Dubai."
                      : "A fictional local bakery sharing example surplus food through this school prototype."
                  }
                />
              </label>
              <Note>
                No personal information is requested. The selected name and
                avatar are fictional.
              </Note>
              <button
                className="primary"
                onClick={() => {
                  dispatch({
                    type: "preferences",
                    preferences: { persona: nameChoice, avatar },
                  });
                  setSaved(true);
                }}
              >
                Save changes
              </button>
              {saved ? (
                <p className="saved-message" role="status">
                  <Check size={17} />
                  Demo profile saved
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
      {page === "demo-details" ? (
        <>
          <PageHeading
            title="Demo details"
            subtitle="Information used to illustrate the FoodLoop interface."
          />
          <div className="details-record">
            <div>
              <span>Display name</span>
              <strong>{name}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>
                {role === "student" ? "Student" : "Business / Donor"}
              </strong>
            </div>
            <div>
              <span>
                {role === "student" ? "School / university" : "Business type"}
              </span>
              <strong>
                {role === "student"
                  ? "Example Campus · Fictional"
                  : "Local Bakery · Fictional"}
              </strong>
            </div>
            <div>
              <span>Demo location</span>
              <strong>Jumeirah, Dubai</strong>
            </div>
          </div>
          <Note>
            These are preset fictional details. The prototype does not collect
            names, emails, phone numbers or addresses.
          </Note>
          <button className="primary" onClick={() => onNav("edit-profile")}>
            Edit demo profile
          </button>
        </>
      ) : null}
      {page === "preferences" ? (
        <>
          <PageHeading
            title="Food Preferences"
            subtitle="Set local preferences for the demo listings."
          />
          <section className="preferences-section">
            <h2>Dietary restrictions</h2>
            <ChoicePills
              label="Dietary preference"
              value={diet}
              options={["None", "Vegetarian", "Vegan", "Halal", "Gluten free"]}
              onChange={(value) => {
                setDiet(value);
                setSaved(false);
              }}
            />
          </section>
          <section className="preferences-section">
            <h2>Allergens to avoid</h2>
            <div className="allergen-options">
              {allergenOptions.map((a) => {
                const Icon = allergenIcons[a];
                return (
                  <label
                    className={avoid.includes(a) ? "selected" : ""}
                    key={a}
                  >
                    <Checkbox
                      checked={avoid.includes(a)}
                      onCheckedChange={(checked) => {
                        setAvoid((x) =>
                          checked ? [...x, a] : x.filter((v) => v !== a),
                        );
                        setSaved(false);
                      }}
                    />
                    <Icon size={18} />
                    {a}
                  </label>
                );
              })}
            </div>
          </section>
          <section className="preferences-section">
            <h2>Preferred food types</h2>
            <div className="preference-types">
              {categories.map((c) => (
                <label
                  className={"choice " + (types.includes(c) ? "selected" : "")}
                  key={c}
                >
                  <Checkbox
                    checked={types.includes(c)}
                    onCheckedChange={(checked) => {
                      setTypes((x) =>
                        checked ? [...x, c] : x.filter((v) => v !== c),
                      );
                      setSaved(false);
                    }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </section>
          <div className="button-pair">
            <button className="primary" onClick={savePrefs}>
              Save preferences
            </button>
            <button
              className="secondary"
              onClick={() => {
                savePrefs();
                dispatch({
                  type: "filters",
                  filters: { ...state.filters, usePreferences: true },
                });
                onExplore();
              }}
            >
              Apply to demo food
            </button>
          </div>
          {saved ? (
            <p className="saved-message" role="status">
              <Check size={17} />
              Preferences saved
            </p>
          ) : null}
          <p className="page-disclaimer">
            Example allergen and dietary information only.
          </p>
        </>
      ) : null}
      {page === "notifications" ? (
        <>
          <PageHeading
            title="Notifications"
            subtitle="Choose which prototype notifications to illustrate."
          />
          <div className="setting-list">
            {[
              [
                "nearby",
                "New food near me",
                "Example alerts when demo food is available.",
              ],
              [
                "claims",
                "Claim updates",
                "Illustrate updates about simulated claims.",
              ],
              [
                "reminders",
                "Collection reminders",
                "Example reminders before the demo collection time.",
              ],
              [
                "messages",
                "Messages",
                "Illustrate fictional donor message alerts.",
              ],
              [
                "tips",
                "Tips and news",
                "Example sustainability tips and app updates.",
              ],
            ].map(([id, title, subtitle]) => (
              <div className="switch-row" key={id}>
                <Bell size={22} />
                <span>
                  <strong>{title}</strong>
                  <small>{subtitle}</small>
                </span>
                <Switch
                  aria-label={title}
                  checked={!!prefs.notifications[id]}
                  onCheckedChange={(checked) =>
                    dispatch({
                      type: "preferences",
                      preferences: {
                        notifications: {
                          ...prefs.notifications,
                          [id]: checked,
                        },
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>
          <Note>
            These switches store local preferences. No emails, push
            notifications or messages are sent.
          </Note>
        </>
      ) : null}
      {page === "settings" ? (
        <>
          <PageHeading
            title="Settings"
            subtitle="Manage the prototype and your local preferences."
          />
          <div className="setting-list">
            <MenuRow
              icon={User}
              title="Demo profile information"
              onClick={() => onNav("demo-details")}
            />
            <MenuRow
              icon={Bell}
              title="Notifications"
              onClick={() => onNav("notifications")}
            />
            <MenuRow
              icon={Shield}
              title="Privacy and demo data"
              onClick={() => onNav("privacy")}
            />
            <MenuRow
              icon={MapPin}
              title="Location settings"
              value="Jumeirah"
              onClick={() => onNav("location-settings")}
            />
            <div className="switch-row">
              <Globe size={22} />
              <span>
                <strong>Language</strong>
                <small>The prototype is presented in English.</small>
              </span>
              <em>English</em>
            </div>
            <div className="switch-row">
              <MapPin size={22} />
              <span>
                <strong>Distance unit</strong>
              </span>
              <SelectField
                label="Distance unit"
                value={prefs.unit}
                onChange={(v) =>
                  dispatch({
                    type: "preferences",
                    preferences: { unit: v as "km" | "mi" },
                  })
                }
                options={[
                  { value: "km", label: "Kilometres" },
                  { value: "mi", label: "Miles" },
                ]}
              />
            </div>
            <div className="switch-row">
              <Moon size={22} />
              <span>
                <strong>Dark appearance</strong>
              </span>
              <Switch
                aria-label="Dark appearance"
                checked={prefs.dark}
                onCheckedChange={(dark) =>
                  dispatch({ type: "preferences", preferences: { dark } })
                }
              />
            </div>
            <MenuRow
              icon={RefreshCcw}
              title="Switch role"
              subtitle="Explore Student or Business / Donor"
              onClick={onSwitch}
            />
          </div>
          <button className="reset-demo" onClick={onReset}>
            <Trash2 size={20} />
            Reset Demo <span>Restore the original prototype data</span>
          </button>
          <p className="page-disclaimer">
            {storageAvailable
              ? "Demo changes are saved in this browser."
              : "Browser storage is unavailable. Demo changes last for this session."}
          </p>
        </>
      ) : null}
      {page === "privacy" ? (
        <>
          <PageHeading title="Privacy and demo data" />
          <div className="plain-info">
            <Shield size={35} />
            <h2>A local school prototype</h2>
            <p>
              FoodLoop uses fictional profiles, food, businesses, claims,
              collection points and impact statistics. There are no accounts or
              authentication.
            </p>
            <p>
              Demo claims, listings, saved food and preferences are kept in this
              browser’s local storage. Example images selected in Share Food are
              prepared locally and never uploaded.
            </p>
            <p>
              The prototype does not request your real location, personal
              information, card details or bank details.
            </p>
            <button className="secondary" onClick={onReset}>
              Reset local demo data
            </button>
          </div>
        </>
      ) : null}
      {page === "location-settings" ? (
        <>
          <PageHeading
            title="Location settings"
            subtitle="A fixed area for every prototype interaction."
          />
          <div className="plain-info">
            <MapPin size={35} />
            <h2>Jumeirah, Dubai</h2>
            <p>
              FoodLoop uses a fixed demo centre and fictional collection points
              around Jumeirah and Al Wasl. The displayed distances are mock
              values.
            </p>
            <p>
              No location permission is requested. Map markers illustrate the
              demo dataset.
            </p>
            <button className="primary" onClick={onExplore}>
              Explore demo map
            </button>
          </div>
        </>
      ) : null}
      {page === "impact" ? (
        <>
          <PageHeading
            title="My impact"
            subtitle="Example statistics for the school prototype."
            action={
              <SelectField
                label="Impact period"
                value={period}
                onChange={setPeriod}
                options={["Last 3 months", "This month", "This demo session"]}
              />
            }
          />
          <div className="stats-row">
            {stats.map((s) => (
              <div key={s.label}>
                <span>
                  <s.icon />
                </span>
                <strong>
                  {period === "This demo session"
                    ? s.label === "Foods shared"
                      ? custom
                      : s.label === "Foods collected"
                        ? Math.max(0, completed - 1)
                        : `${custom * 2 + Math.max(0, completed - 1)} kg`
                    : s.value}
                </strong>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="impact-layout">
            <div className="impact-chart">
              <h2>Impact over time</h2>
              <div className="bars" aria-label="Fictional impact chart">
                {(period === "Last 3 months"
                  ? [
                      ["Jul", 4],
                      ["Aug", 8],
                      ["Sep", 12],
                    ]
                  : period === "This month"
                    ? [
                        ["Week 1", 2],
                        ["Week 2", 4],
                        ["Week 3", 6],
                      ]
                    : [
                        ["Shared", custom],
                        ["Collected", Math.max(0, completed - 1)],
                        ["Saved", custom * 2 + Math.max(0, completed - 1)],
                      ]
                ).map(([label, value]) => (
                  <div key={label as string}>
                    <span
                      style={{ height: `${Math.max(4, Number(value) * 10)}px` }}
                    />
                    <strong>{value}</strong>
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="extra-impact">
              <h2>Extra impact</h2>
              <p>
                <Users />
                12 fictional people helped
              </p>
              <p>
                <Leaf />
                20 kg example CO₂ savings
              </p>
              <p>
                <Heart />
                {completed} demo collections completed
              </p>
            </div>
          </div>
          <Note>
            The baseline figures are fictional. Current session counts respond
            to your simulated collections and listings.
          </Note>
        </>
      ) : null}
      {page === "help" ? (
        <>
          <PageHeading
            title="Help & support"
            subtitle="Find answers about this FoodLoop prototype."
          />
          <label className="search-box help-search">
            <Search size={20} />
            <input
              aria-label="Search help"
              placeholder="Search for help..."
              value={helpQuery}
              onChange={(e) => setHelpQuery(e.target.value)}
            />
          </label>
          <div className="help-items">
            {helpItems
              .filter(([title, text]) =>
                (title + " " + text)
                  .toLowerCase()
                  .includes(helpQuery.toLowerCase()),
              )
              .map(([title, text]) => (
                <details key={title}>
                  <summary>
                    <HelpCircle size={21} />
                    {title}
                    <ChevronRight size={18} />
                  </summary>
                  <p>{text}</p>
                </details>
              ))}
          </div>
          {!helpItems.some(([title, text]) =>
            (title + " " + text)
              .toLowerCase()
              .includes(helpQuery.toLowerCase()),
          ) ? (
            <p className="muted">
              No matching help topics. Try “claims” or “sharing”.
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
