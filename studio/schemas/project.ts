import { defineType } from "sanity";

export default defineType({
  name: "project",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
  ],
});
