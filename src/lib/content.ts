/**
 * Content layer. Reads from Sanity when PUBLIC_SANITY_PROJECT_ID is set,
 * otherwise from src/content/seed/*.json so the site builds before a project exists.
 * Every getter returns the same normalized shape either way.
 */
import type { ImageMetadata } from "astro";
import imageUrlBuilder from "@sanity/image-url";
import seedSettings from "../content/seed/siteSettings.json";
import seedServices from "../content/seed/services.json";
import seedReviews from "../content/seed/reviews.json";
import seedLearn from "../content/seed/learn.json";

/** What the ruled caption under a photo says beyond its alt text. */
interface PhotoCaption {
  /** Slug of the service shown, when known; captions look up the price from it. */
  serviceSlug?: string;
  /** What the photo shows: "Healed", "Mapped and healed", "Before and after". */
  detail?: string;
  /** object-position for the crop, e.g. "50% 85%". Every source is square, so a
      cropped placement travels with the photo rather than living in a stylesheet. */
  focus?: string;
}

export type Photo = PhotoCaption &
  (
    | { kind: "local"; image: ImageMetadata; alt: string; source: string }
    | { kind: "remote"; src: string; srcset: string; width: number; height: number; alt: string }
  );

/** A seed Instagram pick: a gallery ref, optionally with its own detail and alt. */
type SeedPick = string | { ref: string; detail?: string; alt?: string; focus?: string };

/** A Sanity portable-text block array. Rendered by PortableText.astro. */
export type PortableBlock = Record<string, any>;

export interface Service {
  title: string;
  slug: string;
  category: string;
  order: number;
  price: number;
  priceUnit?: string;
  touchUpPrice?: number;
  priceNote?: string;
  summary?: string;
  /** Long-form body. Present in the CMS schema as `description`; may be absent. */
  description?: PortableBlock[];
  /** SEO title carried over from the previous site, e.g. "MICROBLADING IN TUSTIN, CA | ...". */
  seoTitle?: string;
  /** The one photograph that represents this service in a card or a page header. */
  cover?: Photo;
  gallery: Photo[];
  showOnHome: boolean;
}

export interface Review {
  quote: string;
  reviewer: string;
  source: string;
  sourceUrl?: string;
  serviceSlug?: string;
  isPlaceholder: boolean;
}

export interface LearnArticle {
  title: string;
  slug: string;
  summary: string;
  /** Long-form body. Defined in the CMS schema and, until now, never requested. */
  body?: PortableBlock[];
  /** SEO title carried over from the previous site. */
  seoTitle?: string;
  /** Chosen per article, not per service: three articles share one service and
      would otherwise show the same picture side by side on the index. */
  cover?: Photo;
  relatedService?: string | null;
  showAsFaq: boolean;
}

export interface Hours {
  days: string;
  opens: string;
  closes: string;
}

export interface SiteSettings {
  businessName: string;
  phone: string;
  phoneTel: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  locationLine: string;
  mapEmbedUrl: string;
  mapLinkUrl: string;
  hours: Hours[];
  hoursNote: string;
  bookingUrl: string;
  bookingHref: string;
  yelpUrl: string;
  yelpReviewCount: number;
  instagramHandle: string;
  instagramUrl: string;
  instagramLiveFeed: boolean;
  instagramPicks: Photo[];
  aboutHeading: string;
  bio: string[];
  bioIsPlaceholder: boolean;
  headshot: Photo | null;
  metaDescription: string;
}

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";
export const usingSanity = Boolean(projectId && projectId !== "placeholder");

// Local gallery imported from the client's MEDIA folder (see scripts/import-media.mjs).
const gallery = import.meta.glob<{ default: ImageMetadata }>("/src/assets/gallery/**/*.jpg", {
  eager: true,
});

const serviceTitles: Record<string, string> = Object.fromEntries(
  (seedServices as any[]).map((s) => [s.slug, s.title])
);

export function localPhoto(ref: string, alt?: string): Photo | null {
  const key = `/src/assets/gallery/${ref}.jpg`;
  const mod = gallery[key];
  if (!mod) return null;
  const folder = ref.split("/")[0];
  const title = serviceTitles[folder] ?? folder;
  return {
    kind: "local",
    image: mod.default,
    alt: alt ?? `${title} by Pomi B. Brow Studio, healed result`,
    source: key,
    serviceSlug: folder in serviceTitles ? folder : undefined,
  };
}

export function localGallery(folder: string): Photo[] {
  return Object.keys(gallery)
    .filter((k) => k.startsWith(`/src/assets/gallery/${folder}/`))
    .sort()
    .map((k) => localPhoto(k.replace("/src/assets/gallery/", "").replace(/\.jpg$/, ""))!)
    .filter(Boolean);
}

function portableToParagraphs(blocks: unknown): string[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b: any) => b?._type === "block")
    .map((b: any) => (b.children ?? []).map((c: any) => c.text ?? "").join(""))
    .filter((t: string) => t.trim().length > 0);
}

/**
 * Sanity picks carry only an `alt` string, so the caption reads it as "Service, what the photo shows":
 * "Lip Tint, before and after" captions as LIP TINT / BEFORE AND AFTER. No comma means no detail.
 */
function captionFromAlt(alt?: string): PhotoCaption {
  if (!alt) return {};
  const comma = alt.indexOf(",");
  if (comma < 0) return {};
  const service = (seedServices as any[]).find((s) => s.title.toLowerCase() === alt.slice(0, comma).trim().toLowerCase());
  return { serviceSlug: service?.slug, detail: alt.slice(comma + 1).trim() || undefined };
}

function remotePhoto(img: any, alt: string): Photo | null {
  if (!img?.asset) return null;
  const builder = imageUrlBuilder({ projectId: projectId!, dataset });
  const base = builder.image(img).auto("format").quality(80);
  const widths = [480, 800, 1200, 1600];
  const dims = img.asset?.metadata?.dimensions ?? { width: 1320, height: 1320 };
  return {
    kind: "remote",
    src: base.width(1200).url(),
    srcset: widths.map((w) => `${base.width(w).url()} ${w}w`).join(", "),
    width: dims.width,
    height: dims.height,
    alt,
  };
}

function normalizeSeedSettings(): SiteSettings {
  const s = seedSettings as any;
  return {
    ...s,
    hours: s.hours ?? [],
    bookingHref: s.bookingUrl || `tel:${s.phoneTel}`,
    instagramLiveFeed: s.instagramLiveFeed !== false,
    instagramPicks: (s.instagramPicks as SeedPick[])
      .map((pick) => {
        const { ref, detail, alt } = typeof pick === "string" ? { ref: pick } : pick;
        const photo = localPhoto(ref, alt);
        return photo && { ...photo, detail };
      })
      .filter((p): p is Photo => Boolean(p)),
    bio: s.bio ?? [],
    bioIsPlaceholder: Boolean(s.bioIsPlaceholder),
    headshot: null,
  };
}

/** Resolve a seed { ref, focus, alt, detail } pick to a Photo carrying its crop point. */
function seedCover(pick: SeedPick | undefined): Photo | undefined {
  if (!pick) return undefined;
  const { ref, detail, alt, focus } = typeof pick === "string" ? { ref: pick } : (pick as any);
  const photo = localPhoto(ref, alt);
  return photo ? { ...photo, detail, focus } : undefined;
}

function normalizeSeedServices(): Service[] {
  return (seedServices as any[])
    .map((s) => ({
      ...s,
      cover: seedCover(s.cover),
      gallery: s.galleryFolder ? localGallery(s.galleryFolder) : [],
      showOnHome: s.showOnHome !== false,
    }))
    .sort((a, b) => a.order - b.order);
}

function normalizeSeedLearn(): LearnArticle[] {
  return (seedLearn as any[]).map((a) => ({ ...a, cover: seedCover(a.cover) }));
}

function normalizeSeedReviews(): Review[] {
  return (seedReviews as any[]).map((r) => ({ ...r, isPlaceholder: Boolean(r.isPlaceholder) }));
}

async function client() {
  const mod = await import("sanity:client");
  return mod.sanityClient;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!usingSanity) return normalizeSeedSettings();
  const c = await client();
  const s = await c.fetch(`*[_type == "siteSettings"][0]{
    ..., instagramPicks[]{..., asset->{url, metadata{dimensions}}}, headshot{..., asset->{url, metadata{dimensions}}}
  }`);
  if (!s) return normalizeSeedSettings();
  const seed = normalizeSeedSettings();
  return {
    ...seed,
    ...s,
    hours: s.hours ?? [],
    bookingHref: s.bookingUrl || `tel:${s.phoneTel ?? seed.phoneTel}`,
    instagramLiveFeed: s.instagramLiveFeed ?? seed.instagramLiveFeed,
    instagramPicks: (s.instagramPicks ?? [])
      .map((img: any) => {
        const photo = remotePhoto(img, img.alt ?? `@${s.instagramHandle} on Instagram`);
        return photo && { ...photo, ...captionFromAlt(img.alt) };
      })
      .filter(Boolean),
    bio: portableToParagraphs(s.bio),
    bioIsPlaceholder: false,
    headshot: remotePhoto(s.headshot, `Pomi, permanent makeup artist`),
  };
}

export async function getServices(): Promise<Service[]> {
  if (!usingSanity) return normalizeSeedServices();
  const c = await client();
  const rows = await c.fetch(`*[_type == "service"] | order(order asc){
    ..., "slug": slug.current,
    cover{..., asset->{url, metadata{dimensions}}},
    gallery[]{..., asset->{url, metadata{dimensions}}}
  }`);
  if (!rows?.length) return normalizeSeedServices();
  return rows.map((s: any) => ({
    ...s,
    gallery: (s.gallery ?? [])
      .map((img: any) => remotePhoto(img, img.caption ? `${s.title}: ${img.caption}` : `${s.title} by Pomi B. Brow Studio`))
      .filter(Boolean),
    showOnHome: s.showOnHome !== false,
  }));
}

export async function getReviews(): Promise<Review[]> {
  if (!usingSanity) return normalizeSeedReviews();
  const c = await client();
  const rows = await c.fetch(`*[_type == "review" && showOnHome == true] | order(order asc){
    ..., "serviceSlug": service->slug.current
  }`);
  if (!rows?.length) return [];
  return rows.map((r: any) => ({ ...r, isPlaceholder: false }));
}

export async function getLearnArticles(): Promise<LearnArticle[]> {
  if (!usingSanity) return normalizeSeedLearn();
  const c = await client();
  const rows = await c.fetch(`*[_type == "learnArticle"]{
    title, "slug": slug.current, summary, body, seoTitle, showAsFaq,
    cover{..., asset->{url, metadata{dimensions}}},
    "relatedService": relatedService->slug.current
  }`);
  return rows?.length ? rows : normalizeSeedLearn();
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/** "$600 + $100" (or "$500 / hr"); the word "touch-up" is added where the caption has room for it. */
export function servicePrice(s: Service, opts: { touchUpWord?: boolean } = {}): string {
  const base = formatPrice(s.price) + (s.priceUnit ? ` / ${s.priceUnit}` : "");
  if (s.touchUpPrice == null) return base;
  return `${base} + ${formatPrice(s.touchUpPrice)}${opts.touchUpWord ? " touch-up" : ""}`;
}

/** The three parts of a photo's ruled caption: service, what it shows, price. */
export function photoCaption(p: Photo, services: Service[]): { service: string; detail?: string; price?: string } {
  const service = p.serviceSlug ? services.find((s) => s.slug === p.serviceSlug) : undefined;
  return {
    service: service?.title ?? p.alt.replace(/ by Pomi B\. Brow Studio.*$/i, "").split(",")[0].trim(),
    detail: p.detail,
    price: service ? servicePrice(service) : undefined,
  };
}
