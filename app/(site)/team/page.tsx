import type { Metadata } from "next";
import { teamContent } from "@/lib/config";
import { getPage, getSiteSettings, getTeam } from "@/lib/sanity/fetch";
import { urlForImage } from "@/lib/sanity/image";
import { breadcrumbJsonLd, buildMetadata, personJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { LeaderSpotlight } from "@/components/sections/team/LeaderSpotlight";
import { CrewGrid } from "@/components/sections/team/CrewGrid";
import { GearStrip } from "@/components/sections/team/GearStrip";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("team");
  return buildMetadata({
    seo: page.seo,
    title: "Our Team | The People Behind The Lens | REELCLICKS.IN",
    description:
      "Meet Huzef Shaikh (Founder), Adil Shaikh (CEO) and the REELCLICKS.IN crew of cinematographers, editors and drone operators in North Maharashtra.",
    path: "/team",
    absoluteTitle: true,
  });
}

export default async function TeamPage() {
  const [team, page, settings] = await Promise.all([getTeam(), getPage("team"), getSiteSettings()]);
  const leaders = team.filter((m) => m.isLeader);
  const crew = team.filter((m) => !m.isLeader);
  const gear = page.gear?.length ? page.gear : teamContent.gear;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Team", path: "/team" }])} />
      {personJsonLd(
        leaders.slice(0, 2).map((m) => ({
          name: m.name,
          role: m.role,
          phone: m.phone,
          instagram: m.instagram,
          image: urlForImage(m.photo, 800),
        })),
      ).map((p) => (
        <JsonLd key={p["@id"]} data={p} />
      ))}

      <section className="container-cinema pt-40 pb-16 md:pt-52 md:pb-24">
        <SectionLabel>The Team</SectionLabel>
        <RevealText
          as="h1"
          trigger="mount"
          className="mt-8 max-w-6xl font-display text-[52px] leading-[0.92] font-light text-ivory md:text-[110px] xl:text-[150px]"
        >
          The People
          <br />
          <em className="text-gold-soft">Behind The Lens.</em>
        </RevealText>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">{teamContent.intro}</p>
      </section>

      <div className="container-cinema" aria-label="Leadership">
        {leaders.map((m, i) => (
          <LeaderSpotlight key={m._id} member={m} index={i} />
        ))}
      </div>

      <CrewGrid crew={crew} roles={teamContent.crewRoles} />
      <GearStrip gear={gear} />

      <section className="py-28 md:py-44" aria-labelledby="work-with-us">
        <div className="container-cinema flex flex-col items-center text-center">
          <SectionLabel line={false}>Work With Us</SectionLabel>
          <RevealText as="h2" className="mt-8 max-w-4xl font-display text-[48px] leading-[0.95] font-light md:text-[110px]">
            <span id="work-with-us">
              Let&apos;s make something <em className="text-gold-soft">timeless.</em>
            </span>
          </RevealText>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button href="/contact" size="lg">
              Work with us
            </Button>
            <Button href={settings.instagramUrl} newTab variant="outline" size="lg">
              See our latest on Instagram
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
