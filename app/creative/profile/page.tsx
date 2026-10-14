"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, Plus, X } from "lucide-react";
import { AppHeader } from "@/components/app-header";

const CURRENCY = "₱";
const TYPES = ["Photographer", "Videographer", "Editor"];
const STYLES = ["Wedding", "Portrait", "Event", "Product", "Documentary", "Fashion"];
const MAX_PHOTOS = 12;
const MIN_PHOTOS = 3;
const BIO_MAX = 400;

type Photo = { id: string; name: string; url: string };
type Errors = Partial<Record<"types" | "studio" | "city" | "price" | "photos", string>>;

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const INPUT =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm placeholder:text-muted-foreground aria-[invalid=true]:border-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600";

export default function CreativeProfilePage() {
  const [types, setTypes] = useState<string[]>([]);
  const [studio, setStudio] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  // Free the preview URLs when leaving the page.
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(
    () => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)),
    []
  );

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, room)
      .map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        url: URL.createObjectURL(f),
      }));
    setPhotos((p) => [...p, ...next]);
  }

  function removePhoto(id: string) {
    const target = photos.find((p) => p.id === id);
    if (target) URL.revokeObjectURL(target.url);
    setPhotos((p) => p.filter((x) => x.id !== id));
  }

  function makeCover(id: string) {
    setPhotos((p) => {
      const pick = p.find((x) => x.id === id);
      return pick ? [pick, ...p.filter((x) => x.id !== id)] : p;
    });
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!types.length) e.types = "Choose at least one type.";
    if (!studio.trim()) e.studio = "Add a studio or display name.";
    if (!city.trim()) e.city = "Add the city you work in.";
    if (!price || Number(price) <= 0) e.price = "Add a starting price.";
    if (photos.length < MIN_PHOTOS)
      e.photos = `Add at least ${MIN_PHOTOS} photos. Explore shows three on each card.`;
    return e;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setSaved(false);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }
    // TODO (Supabase):
    // 1. upload `photos` files to Storage
    // 2. upsert into `creatives` (user_id, types, studio, city, price, styles, bio)
    // 3. insert `portfolio_items` with sort order = array order
    setSaved(true);
  }

  const cover = photos[0];
  const priceNumber = Number(price);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Saving flips this to true so you can see the Client/Creative switch appear. */}
      <AppHeader hasCreativeProfile={saved} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Your creative profile</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          This is what clients see on Explore. You keep your client account and
          can switch between both from the top bar.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <form onSubmit={onSubmit} noValidate className="max-w-2xl">
            {saved && (
              <p
                role="status"
                className="mb-6 rounded-lg border border-border bg-muted px-4 py-3 text-sm"
              >
                Profile saved. Use the switch in the top bar to move between
                Client and Creative.
              </p>
            )}

            {/* Type */}
            <fieldset className="pb-8">
              <legend className="text-base font-medium">What do you offer?</legend>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick everything that applies.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {TYPES.map((t) => {
                  const on = types.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={on}
                      aria-invalid={errors.types ? true : undefined}
                      aria-describedby={errors.types ? "err-types" : undefined}
                      onClick={() => toggle(types, t, setTypes)}
                      className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm ${FOCUS} ${
                        on
                          ? "border-blue-600 bg-blue-600/10 font-medium"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {on && <Check className="h-4 w-4" aria-hidden="true" />}
                      {t}
                    </button>
                  );
                })}
              </div>
              {errors.types && <FieldError id="err-types">{errors.types}</FieldError>}
            </fieldset>

            {/* Basics */}
            <section className="border-t border-border py-8">
              <h2 className="text-base font-medium">Basics</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="studio" className="mb-1.5 block text-sm font-medium">
                    Studio or display name
                  </label>
                  <input
                    id="studio"
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    aria-invalid={errors.studio ? true : undefined}
                    aria-describedby={errors.studio ? "err-studio" : undefined}
                    className={INPUT}
                  />
                  {errors.studio && <FieldError id="err-studio">{errors.studio}</FieldError>}
                </div>

                <div>
                  <label htmlFor="city" className="mb-1.5 block text-sm font-medium">
                    City
                  </label>
                  <input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-invalid={errors.city ? true : undefined}
                    aria-describedby={errors.city ? "err-city" : undefined}
                    className={INPUT}
                  />
                  {errors.city && <FieldError id="err-city">{errors.city}</FieldError>}
                </div>

                <div>
                  <label htmlFor="price" className="mb-1.5 block text-sm font-medium">
                    Starting price per event
                  </label>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                    >
                      {CURRENCY}
                    </span>
                    <input
                      id="price"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      aria-invalid={errors.price ? true : undefined}
                      aria-describedby={errors.price ? "err-price" : undefined}
                      className={`${INPUT} pl-8 tabular-nums`}
                    />
                  </div>
                  {errors.price && <FieldError id="err-price">{errors.price}</FieldError>}
                </div>
              </div>
            </section>

            {/* Styles + bio */}
            <section className="border-t border-border py-8">
              <h2 className="text-base font-medium">Your style</h2>
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Styles">
                {STYLES.map((s) => {
                  const on = styles.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(styles, s, setStyles)}
                      className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm ${FOCUS} ${
                        on
                          ? "border-blue-600 bg-blue-600/10 font-medium"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                      {s}
                    </button>
                  );
                })}
              </div>

              <label htmlFor="bio" className="mb-1.5 mt-6 block text-sm font-medium">
                About you
              </label>
              <textarea
                id="bio"
                rows={4}
                maxLength={BIO_MAX}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />
              <p className="mt-1.5 text-right text-xs tabular-nums text-muted-foreground">
                {bio.length} / {BIO_MAX}
              </p>
            </section>

            {/* Portfolio */}
            <section className="border-t border-border py-8">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-base font-medium">Portfolio</h2>
                <p className="text-sm tabular-nums text-muted-foreground">
                  {photos.length} of {MAX_PHOTOS} photos
                </p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your best work. The first photo is your cover.
              </p>

              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((p, i) => (
                  <li
                    key={p.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                    {i === 0 ? (
                      <span className="absolute bottom-2 left-2 rounded-md bg-background px-2 py-1 text-xs font-medium">
                        Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makeCover(p.id)}
                        className={`absolute bottom-2 left-2 rounded-md bg-background px-2 py-1 text-xs hover:bg-muted ${FOCUS}`}
                      >
                        Make cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      aria-label={`Remove ${p.name}`}
                      className={`absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-background hover:bg-muted ${FOCUS}`}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <li>
                    <label
                      className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground focus-within:ring-2 focus-within:ring-blue-600 ${
                        errors.photos ? "border-red-500" : ""
                      }`}
                    >
                      <Plus className="h-5 w-5" aria-hidden="true" />
                      Add photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        aria-invalid={errors.photos ? true : undefined}
                        aria-describedby={errors.photos ? "err-photos" : undefined}
                        onChange={(e) => {
                          addFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </li>
                )}
              </ul>
              {errors.photos && <FieldError id="err-photos">{errors.photos}</FieldError>}
            </section>

            <div className="border-t border-border pt-6">
              <button
                type="submit"
                className={`inline-flex h-10 items-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 ${FOCUS}`}
              >
                Save profile
              </button>
            </div>
          </form>

          {/* Live preview of the Explore card */}
          <aside aria-label="Explore preview" className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-sm font-medium">How it looks on Explore</p>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative aspect-[4/3] bg-muted">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Camera className="h-8 w-8" aria-hidden="true" />
                  </div>
                )}
                {photos.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex gap-1.5">
                    {photos.slice(0, 3).map((p) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={p.id}
                        src={p.url}
                        alt=""
                        className="h-9 w-9 rounded-md border-2 border-background object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1 p-4">
                <p className="font-medium">{studio.trim() || "Your studio name"}</p>
                <p className="text-sm text-muted-foreground">
                  {[types.join(", "), city.trim()].filter(Boolean).join(" in ") ||
                    "Type and city"}
                </p>
                {styles.length > 0 && (
                  <p className="text-sm text-muted-foreground">{styles.join(", ")}</p>
                )}
                <p className="pt-1 text-sm tabular-nums">
                  {priceNumber > 0
                    ? `From ${CURRENCY}${priceNumber.toLocaleString("en-US")}`
                    : "Add a starting price"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
      {children}
    </p>
  );
}