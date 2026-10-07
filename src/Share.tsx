import { assetUrl } from "./assets";
import { useRef, useState } from "react";
import {
  Camera,
  Plus,
  X,
  Check,
  ArrowLeft,
  Store,
  Clock,
  MapPin,
  Wheat,
  FileText,
  Pencil,
  Minus,
  ImagePlus,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useDemo } from "./state";
import {
  allergenOptions,
  categories,
  demoLocations,
  photoChoices,
  formatTime,
  mockListings,
  type Listing,
  type Category,
} from "./data/mockListings";
import {
  MapView,
  MiniCard,
  Note,
  SelectField,
  allergenIcons,
  ChoicePills,
} from "./ui";
const steps = ["Photos", "Details", "Allergens", "Time & Location", "Review"];
interface Draft {
  images: string[];
  title: string;
  description: string;
  category: Category;
  quantity: number;
  allergens: string[];
  day: "Today" | "Tomorrow";
  from: string;
  until: string;
  location: string;
}
export default function Share({
  editing,
  onCancel,
  onPublish,
}: {
  editing?: Listing;
  onCancel: () => void;
  onPublish: (l: Listing) => void;
}) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const { state } = useDemo();
  const [draft, setDraft] = useState<Draft>(() =>
    editing
      ? {
          images: editing.images,
          title: editing.title,
          description: editing.description,
          category: editing.category,
          quantity: editing.quantity,
          allergens: editing.allergens,
          day: editing.day,
          from: editing.collectionFrom,
          until: editing.collectionTime,
          location: editing.location,
        }
      : {
          images: [],
          title: "",
          description: "",
          category: "Bakery",
          quantity: 3,
          allergens: [],
          day: "Today",
          from: "14:00",
          until: "18:00",
          location: demoLocations[0],
        },
  );
  const update = (data: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...data }));
    setError("");
  };
  const point = (mockListings.find((l) => l.location === draft.location)
    ?.point ?? [40, 43]) as [number, number];
  const preview: Listing = {
    id: editing?.id ?? "preview",
    title: draft.title || "Your food listing",
    description: draft.description,
    category: draft.category,
    image: draft.images[0] || "/images/pastries.jpg",
    images: draft.images,
    donor: "Local Bakery Demo",
    quantity: draft.quantity,
    allergens: draft.allergens,
    distance: 320,
    collectionTime: draft.until,
    collectionFrom: draft.from,
    day: draft.day,
    location: draft.location,
    pickup:
      "Collect at the marked demo entrance. Show your FoodLoop demo claim at the collection counter.",
    point,
    availability: "available",
    owner: "business",
    dietary:
      draft.category === "Fruit & Veg"
        ? ["Vegan", "Vegetarian", "Gluten free"]
        : [],
    price: 0,
  };
  function next() {
    if (step === 0 && !draft.images.length) {
      setError("Choose at least one example food photo.");
      return;
    }
    if (
      step === 1 &&
      (!draft.title.trim() || draft.description.trim().length < 10)
    ) {
      setError("Add a food name and a description of at least 10 characters.");
      return;
    }
    if (step === 2 && draft.quantity < 1) {
      setError("Choose at least one portion.");
      return;
    }
    if (step === 3 && draft.from >= draft.until) {
      setError("Collection must end after the start time.");
      return;
    }
    setStep((s) => Math.min(4, s + 1));
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function addFiles(files: FileList | null) {
    if (!files) return;
    setBusy(true);
    try {
      const photos: string[] = [];
      for (const file of Array.from(files).slice(0, 5 - draft.images.length)) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 8 * 1024 * 1024
        )
          throw new Error("Use JPG, PNG or WebP example images under 8 MB.");
        const url = URL.createObjectURL(file);
        try {
          const img = new Image();
          img.src = url;
          await img.decode();
          const scale = Math.min(1, 800 / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          canvas
            .getContext("2d")!
            .drawImage(img, 0, 0, canvas.width, canvas.height);
          photos.push(canvas.toDataURL("image/jpeg", 0.8));
        } finally {
          URL.revokeObjectURL(url);
        }
      }
      update({ images: [...draft.images, ...photos].slice(0, 5) });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "This example image could not be read.",
      );
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  function publish() {
    if (
      !draft.images.length ||
      !draft.title.trim() ||
      draft.description.trim().length < 10 ||
      draft.quantity < 1 ||
      draft.from >= draft.until
    ) {
      setError("Some details need updating. Review the earlier steps.");
      return;
    }
    onPublish({
      ...preview,
      id: editing?.id ?? "demo-" + crypto.randomUUID(),
      title: draft.title.trim(),
      description: draft.description.trim(),
    });
  }
  return (
    <div className="share-page page-pad">
      <div
        className="share-progress"
        aria-label={"Share food step " + (step + 1) + " of 5"}
      >
        {steps.map((s, i) => (
          <div key={s} className={i <= step ? "reached" : ""}>
            <span>{i < step ? <Check size={15} /> : i + 1}</span>
            <strong>{s}</strong>
            {i < 4 ? <i /> : null}
          </div>
        ))}
      </div>
      <div className="share-heading">
        <h1>
          {
            [
              "Add photos",
              "Food details",
              "Allergens & quantity",
              "Collection time & location",
              "Review your listing",
            ][step]
          }
        </h1>
        <p>
          {
            [
              "Add clear example photos of the food you want to share.",
              "Tell people about the demo food you’re sharing.",
              "Select any allergens that may be present in the food.",
              "Choose when and where the demo food can be collected.",
              "Check all details before adding this listing to your demo.",
            ][step]
          }
        </p>
      </div>
      <div className={"share-layout " + (step === 1 ? "has-preview" : "")}>
        <div className="share-form">
          {step === 0 ? (
            <>
              <button
                className="upload-zone"
                onClick={() => input.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  void addFiles(e.dataTransfer.files);
                }}
                disabled={busy || draft.images.length >= 5}
              >
                <ImagePlus size={34} />
                <strong>
                  {busy
                    ? "Preparing local photos…"
                    : "Drag and drop example photos here"}
                </strong>
                <span>or click to choose a local image</span>
                <small>Up to 5 photos · stored only in this browser</small>
              </button>
              <input
                ref={input}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                aria-label="Add example food photos"
                onChange={(e) => void addFiles(e.target.files)}
              />
              <div className="photo-uploads">
                {draft.images.map((src, i) => (
                  <div key={i}>
                    <img
                      src={assetUrl(src)}
                      alt={"Example food photo " + (i + 1)}
                    />
                    <button
                      aria-label={"Remove photo " + (i + 1)}
                      onClick={() =>
                        update({
                          images: draft.images.filter((_, j) => j !== i),
                        })
                      }
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))}
                {draft.images.length < 5 ? (
                  <button
                    className="add-photo"
                    onClick={() => setShowPicker((s) => !s)}
                  >
                    <Plus size={24} />
                    <span>Choose demo photo</span>
                  </button>
                ) : null}
              </div>
              <div className="demo-photo-actions">
                <button
                  className="secondary"
                  onClick={() => update({ images: ["/images/pastries.jpg"] })}
                >
                  <Camera size={18} />
                  Use example photo
                </button>
                <button
                  className="text-button"
                  onClick={() => setShowPicker((s) => !s)}
                >
                  {showPicker ? "Hide photo library" : "Browse demo photos"}
                </button>
              </div>
              {showPicker ? (
                <div className="photo-library">
                  {photoChoices.map((p) => (
                    <button
                      key={p.title}
                      aria-label={"Use " + p.title + " photo"}
                      disabled={
                        draft.images.length >= 5 ||
                        draft.images.includes(p.image)
                      }
                      onClick={() =>
                        update({ images: [...draft.images, p.image] })
                      }
                    >
                      <img src={assetUrl(p.image)} alt={p.title} />
                      <span>{p.title}</span>
                    </button>
                  ))}
                </div>
              ) : null}
              <Note>
                Use the included demo photographs. No personal photos or real
                business information are needed.
              </Note>
            </>
          ) : null}
          {step === 1 ? (
            <>
              <label className="form-field">
                Food name
                <input
                  maxLength={60}
                  value={draft.title}
                  placeholder="e.g. Mixed Pastries"
                  onChange={(e) => update({ title: e.target.value })}
                />
              </label>
              <label className="form-field">
                Description
                <textarea
                  maxLength={300}
                  rows={5}
                  value={draft.description}
                  placeholder="Describe this fictional food and what a portion includes."
                  onChange={(e) => update({ description: e.target.value })}
                />
                <small>{draft.description.length}/300</small>
              </label>
              <label className="form-field">
                Category
                <SelectField
                  label="Food category for listing"
                  value={draft.category}
                  options={categories}
                  onChange={(category) =>
                    update({ category: category as Category })
                  }
                />
              </label>
            </>
          ) : null}
          {step === 2 ? (
            <>
              <h2>
                Allergens <span className="muted optional">(optional)</span>
              </h2>
              <div className="allergen-options">
                {allergenOptions.map((a) => {
                  const Icon = allergenIcons[a];
                  return (
                    <label
                      className={draft.allergens.includes(a) ? "selected" : ""}
                      key={a}
                    >
                      <Checkbox
                        aria-label={a}
                        checked={draft.allergens.includes(a)}
                        onCheckedChange={(checked) =>
                          update({
                            allergens: checked
                              ? [...draft.allergens, a]
                              : draft.allergens.filter((x) => x !== a),
                          })
                        }
                      />
                      <Icon size={18} />
                      {a}
                    </label>
                  );
                })}
                <label className={!draft.allergens.length ? "selected" : ""}>
                  <Checkbox
                    checked={!draft.allergens.length}
                    onCheckedChange={() => update({ allergens: [] })}
                  />
                  None of these
                </label>
              </div>
              <h2 className="quantity-heading">Quantity</h2>
              <p className="muted">How many demo portions are available?</p>
              <div className="quantity-control">
                <button
                  aria-label="Decrease portions"
                  disabled={draft.quantity <= 1}
                  onClick={() => update({ quantity: draft.quantity - 1 })}
                >
                  <Minus size={19} />
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  aria-label="Number of portions"
                  value={draft.quantity}
                  onChange={(e) =>
                    update({
                      quantity: Math.max(
                        1,
                        Math.min(99, Number(e.target.value) || 1),
                      ),
                    })
                  }
                />
                <button
                  aria-label="Increase portions"
                  disabled={draft.quantity >= 99}
                  onClick={() => update({ quantity: draft.quantity + 1 })}
                >
                  <Plus size={19} />
                </button>
                <span>portions</span>
              </div>
              <Note>
                Allergen information applies to this example listing only.
              </Note>
            </>
          ) : null}
          {step === 3 ? (
            <>
              <h2>Collection time</h2>
              <div className="time-fields">
                <label className="form-field">
                  Day
                  <SelectField
                    label="Collection day"
                    value={draft.day}
                    options={["Today", "Tomorrow"]}
                    onChange={(day) =>
                      update({ day: day as "Today" | "Tomorrow" })
                    }
                  />
                </label>
                <label className="form-field">
                  From
                  <input
                    type="time"
                    value={draft.from}
                    aria-label="Collection start time"
                    onChange={(e) => update({ from: e.target.value })}
                  />
                </label>
                <label className="form-field">
                  Until
                  <input
                    type="time"
                    value={draft.until}
                    aria-label="Collection deadline"
                    onChange={(e) => update({ until: e.target.value })}
                  />
                </label>
              </div>
              <Note>Choose a collection window for the fictional listing.</Note>
              <h2 className="location-heading">Collection location</h2>
              <p className="muted">
                Select one of the fixed demo collection points.
              </p>
              <SelectField
                label="Demo collection location"
                value={draft.location}
                options={demoLocations}
                onChange={(location) => update({ location })}
              />
              <MapView
                listings={[preview]}
                single
                compact
                onInspect={() =>
                  update({
                    location:
                      demoLocations[
                        (demoLocations.indexOf(draft.location) + 1) %
                          demoLocations.length
                      ],
                  })
                }
              />
              <button
                className="text-button"
                onClick={() =>
                  update({
                    location:
                      demoLocations[
                        (demoLocations.indexOf(draft.location) + 1) %
                          demoLocations.length
                      ],
                  })
                }
              >
                <MapPin size={17} />
                Adjust demo point on map
              </button>
            </>
          ) : null}
          {step === 4 ? (
            <>
              <div className="review-preview">
                <MiniCard listing={preview} />
                <button
                  className="icon-button"
                  aria-label="Edit photos"
                  onClick={() => setStep(0)}
                >
                  <Pencil size={18} />
                </button>
              </div>
              <button className="review-row" onClick={() => setStep(3)}>
                <Clock />
                <span>
                  <small>Collect from</small>
                  <strong>
                    {formatTime(draft.from)} – {formatTime(draft.until)}{" "}
                    {draft.day.toLowerCase()}
                  </strong>
                </span>
                <Pencil size={17} />
              </button>
              <button className="review-row" onClick={() => setStep(3)}>
                <MapPin />
                <span>{draft.location}</span>
                <Pencil size={17} />
              </button>
              <button className="review-row" onClick={() => setStep(2)}>
                <Wheat />
                <span>
                  {draft.allergens.length
                    ? "Contains " + draft.allergens.join(", ").toLowerCase()
                    : "No allergens selected"}{" "}
                  · {draft.quantity} portions
                </span>
                <Pencil size={17} />
              </button>
              <button className="review-row" onClick={() => setStep(1)}>
                <FileText />
                <span>
                  {draft.description}
                  <small>{draft.category}</small>
                </span>
                <Pencil size={17} />
              </button>
              <Note>
                This listing will be added only to the local prototype. Nothing
                is published publicly.
              </Note>
            </>
          ) : null}
        </div>
        {step === 1 ? (
          <aside className="share-preview">
            <MiniCard listing={preview} />
            <span className="info-pill">
              <Store size={17} />
              {draft.category}
            </span>
            <p>Listing preview</p>
          </aside>
        ) : null}
      </div>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <div className="share-footer">
        <button
          className="secondary"
          onClick={() => {
            if (step === 0) onCancel();
            else {
              setStep((s) => s - 1);
              setError("");
            }
          }}
        >
          {step === 0 ? (
            "Cancel"
          ) : (
            <>
              <ArrowLeft size={18} />
              Back
            </>
          )}
        </button>
        <span>Step {step + 1} of 5</span>
        <button
          className="primary"
          disabled={busy}
          onClick={step === 4 ? publish : next}
        >
          {step === 4
            ? editing
              ? "Save demo listing"
              : "Publish listing"
            : "Next"}
        </button>
      </div>
    </div>
  );
}
