import { defineQuery } from "next-sanity";

const video = `{ provider, "id": coalesce(bunnyId, muxPlaybackId), url }`;
const image = `{ asset, hotspot, crop, alt, "lqip": asset->metadata.lqip }`;

export const siteSettingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  tagline, email, founder, ceo, instagramHandle, instagramUrl,
  serviceArea, locations, businessHours, logo,
  showreel${video}, showreelMobile${video}, showreelPoster${image}
}`);

export const pageQuery = defineQuery(
  `*[_id == "page-" + $key][0]{
    title, manifesto, finalCtaTitle, story, heroImage, vision, mission, values, gallery, gear, seo
  }`,
);

export const categoriesQuery = defineQuery(
  `*[_type == "category"] | order(orderRank){ _id, title, "slug": slug.current }`,
);

export const servicesQuery = defineQuery(`*[_type == "service"] | order(orderRank){
  _id, title, "slug": slug.current, shortLine, hook, description,
  "included": coalesce(included, []), "idealFor": coalesce(idealFor, []),
  "categorySlug": category->slug.current,
  thumbnail${image}, previewVideo${video},
  "showPackages": coalesce(showPackages, false),
  "packages": coalesce(packages[]{ name, price, "features": coalesce(features, []) }, [])
}`);

const portfolioFields = `
  _id, title, "slug": slug.current,
  "category": category->{ title, "slug": slug.current },
  thumbnail${image}, video${video}, previewVideo${video},
  "aspectRatio": coalesce(aspectRatio, "16:9"),
  "featured": coalesce(featured, false),
  location, date, client, story
`;

export const portfolioQuery = defineQuery(
  `*[_type == "portfolioItem"] | order(orderRank){ ${portfolioFields} }`,
);

export const portfolioItemQuery = defineQuery(`*[_type == "portfolioItem" && slug.current == $slug][0]{
  ${portfolioFields},
  brief,
  "bts": bts[]${image},
  "testimonial": testimonial->{ _id, quote, name, eventType, city },
  seo
}`);

export const portfolioSlugsQuery = defineQuery(`*[_type == "portfolioItem" && defined(slug.current)].slug.current`);

export const cityPageQuery = defineQuery(`*[_type == "cityPage" && slug.current == $slug][0]{
  _id, city, "slug": slug.current, headline, intro, body,
  "portfolio": portfolio[]->{ ${portfolioFields} },
  seo
}`);

export const cityPagesQuery = defineQuery(
  `*[_type == "cityPage" && defined(slug.current)] | order(city asc){ _id, city, "slug": slug.current }`,
);

export const featuredPortfolioQuery = defineQuery(
  `*[_type == "portfolioItem" && featured == true] | order(orderRank)[0...6]{ ${portfolioFields} }`,
);

export const teamQuery = defineQuery(`*[_type == "teamMember"] | order(orderRank){
  _id, name, role, "isLeader": coalesce(isLeader, false), photo${image},
  bio, quote, phone, whatsapp, instagram
}`);

export const testimonialsQuery = defineQuery(
  `*[_type == "testimonial"] | order(orderRank){ _id, quote, name, eventType, city }`,
);

export const statsQuery = defineQuery(
  `*[_type == "stat"] | order(orderRank){ _id, label, value, suffix }`,
);

export const faqsQuery = defineQuery(
  `*[_type == "faq"] | order(orderRank){ _id, question, answer }`,
);
