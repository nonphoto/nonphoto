import { defineType } from "sanity";

export default defineType({
  name: "project",
  type: "document",
  fields: [
    { name: "title", type: "string", validation: (Rule) => Rule.required() },
    {
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    },
    { name: "date", type: "date", validation: (Rule) => Rule.required() },
    {
      name: "backgroundColor",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
});
