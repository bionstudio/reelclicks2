import type { Metadata } from "next";
import { aboutContent } from "@/lib/config";
import { getPage, getSiteSettings, getTeam } from "@/lib/sanity/fetch";
import { urlForImage } from "@/lib/sanity/image";
import { breadcrumbJsonLd, buildMetadata, organizationJsonLd, personJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { LeaderCard } from "@/components/team/LeaderCard";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { Story } from "@/components/sections/about/Story";
import { VisionValues } from "@/components/sections/about/VisionValues";
import { BtsStrip } from "@/components/sections/about/BtsStrip";
import { FinalCta } from "@/components/sections/home/FinalCta";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about");
  return buildMetadata({
    seo: page.seo,
    title: "About REELCLICKS.IN | Cinematic Video Studio in Nashik, Maharashtra",
    description:
      "Born in North Maharashtra, REELCLICKS.IN is a premium cinematic storytelling studio turning real moments into timeless wedding films, reels and brand stories.",
    path: "/about",
    absoluteTitle: true,
  });
}

export default async function AboutPage() {
  const [page, team, settings] = await Promise.all([getPage("about"), getTeam(), getSiteSettings()]);
  const leaders = team.filter((m) => m.isLeader).slice(0, 2);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <JsonLd data={organizationJsonLd(settings)} />
      {personJsonLd(
        leaders.map((m) => ({
          name: m.name,
          role: m.role,
          phone: m.phone,
          instagram: m.instagram,
          image: urlForImage(m.photo, 800),
        })),
      ).map((p) => (
        <JsonLd key={p["@id"]} data={p} />
      ))}

      <AboutHero intro={aboutContent.intro} image={page.heroImage} />
      <Story blocks={page.story} fallback={aboutContent.story} />
      <VisionValues
        vision={page.vision || aboutContent.vision}
        mission={page.mission || aboutContent.mission}
        values={page.values?.length ? page.values : aboutContent.values}
      />

      <section className="border-t border-hairline py-28 md:py-40" aria-labelledby="leaders-title">
        <div className="container-cinema">
          <SectionLabel>Leadership</SectionLabel>
          <RevealText as="h2" className="mt-6 max-w-4xl font-display text-[44px] leading-[0.95] font-light md:text-7xl">
            <span id="leaders-title">
              The people <em className="text-gold-soft">behind every frame.</em>
            </span>
          </RevealText>
          <div className="mt-16 grid gap-20 md:mt-24 md:grid-cols-2 md:gap-12 lg:gap-20">
            {leaders.map((m, i) => (
              <div key={m._id} className={i === 1 ? "md:mt-32" : undefined}>
                <LeaderCard member={m} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <BtsStrip images={page.gallery ?? []} />
      <FinalCta title="Let's create your film." whatsapp={settings.founder.whatsapp} />
    </>
  );
}
