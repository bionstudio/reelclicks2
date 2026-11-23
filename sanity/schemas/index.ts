import { altImage, contactPerson, seo, videoSource } from "./objects";
import { siteSettings } from "./siteSettings";
import {
  category,
  cityPage,
  faq,
  page,
  portfolioItem,
  service,
  stat,
  teamMember,
  testimonial,
} from "./content";
import { enquiry } from "./enquiry";

export const schemaTypes = [
  // objects
  seo,
  videoSource,
  contactPerson,
  altImage,
  // documents
  siteSettings,
  page,
  service,
  category,
  portfolioItem,
  teamMember,
  testimonial,
  stat,
  faq,
  enquiry,
  cityPage,
];

/** One-of-a-kind documents (can't be created or deleted by editors). */
export const SINGLETON_TYPES = new Set(["siteSettings", "page"]);
