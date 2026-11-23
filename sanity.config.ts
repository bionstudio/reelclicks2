"use client";

/**
 * Sanity Studio — mounted at /studio (app/studio/[[...tool]]/page.tsx).
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, SINGLETON_TYPES } from "./sanity/schemas";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "reelclicks",
  title: "REELCLICKS.IN Admin",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // Hide singletons from the global "Create new" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted.
    actions: (actions, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETON_TYPES.has(item.templateId)),
  },
  plugins: [
    structureTool({ structure }),
    // GROQ playground for developers — hidden from editors in production.
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
});
