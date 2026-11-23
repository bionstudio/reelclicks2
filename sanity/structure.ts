import { BarChartIcon } from "@sanity/icons/BarChart";
import { CogIcon } from "@sanity/icons/Cog";
import { CommentIcon } from "@sanity/icons/Comment";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { PinIcon } from "@sanity/icons/Pin";
import { PlayIcon } from "@sanity/icons/Play";
import { TagIcon } from "@sanity/icons/Tag";
import { UsersIcon } from "@sanity/icons/Users";
import { WrenchIcon } from "@sanity/icons/Wrench";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import type { StructureResolver } from "sanity/structure";
import { ENQUIRY_STATUSES } from "./schemas/enquiry";

export const PAGES = [
  { key: "home", title: "Home" },
  { key: "about", title: "About" },
  { key: "services", title: "Services" },
  { key: "portfolio", title: "Portfolio" },
  { key: "team", title: "Team" },
  { key: "contact", title: "Contact" },
] as const;

/** Studio sidebar — written for non-technical editors. */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("REELCLICKS.IN")
    .items([
      // Leads first — what the team checks every day.
      S.listItem()
        .title("Enquiries (Leads)")
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title("Enquiries")
            .items([
              ...ENQUIRY_STATUSES.map((s) =>
                S.listItem()
                  .id(`enquiries-${s.value}`)
                  .title(s.title)
                  .child(
                    S.documentList()
                      .title(s.title)
                      .schemaType("enquiry")
                      .filter('_type == "enquiry" && status == $status')
                      .params({ status: s.value })
                      .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
                  ),
              ),
              S.divider(),
              S.listItem()
                .title("All enquiries")
                .child(
                  S.documentTypeList("enquiry")
                    .title("All enquiries")
                    .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
                ),
            ]),
        ),
      S.divider(),

      orderableDocumentListDeskItem({ type: "portfolioItem", title: "Portfolio Videos", icon: PlayIcon, S, context }),
      orderableDocumentListDeskItem({ type: "category", title: "Portfolio Categories", icon: TagIcon, S, context }),
      orderableDocumentListDeskItem({ type: "service", title: "Services", icon: WrenchIcon, S, context }),
      orderableDocumentListDeskItem({ type: "teamMember", title: "Team", icon: UsersIcon, S, context }),
      orderableDocumentListDeskItem({ type: "testimonial", title: "Testimonials", icon: CommentIcon, S, context }),
      orderableDocumentListDeskItem({ type: "stat", title: "Numbers (Counters)", icon: BarChartIcon, S, context }),
      orderableDocumentListDeskItem({ type: "faq", title: "FAQs", icon: HelpCircleIcon, S, context }),
      S.documentTypeListItem("cityPage").title("City Pages").icon(PinIcon),
      S.divider(),

      S.listItem()
        .title("Pages (Google & texts)")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Pages")
            .items(
              PAGES.map((p) =>
                S.listItem()
                  .id(`page-${p.key}`)
                  .title(p.title)
                  .child(S.document().schemaType("page").documentId(`page-${p.key}`).title(p.title)),
              ),
            ),
        ),
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site Settings")),
    ]);
