import { defineType } from "sanity";

export const projectType = defineType({
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
    { name: "roles", type: "array", of: [{ name: "role", type: "string" }] },
    { name: "description", type: "array", of: [{ type: "block" }] },
    {
      name: "credits",
      type: "array",
      of: [
        {
          name: "credit",
          type: "object",
          fields: [
            { name: "role", type: "string" },
            { name: "person", type: "string" },
            { name: "url", type: "url" },
          ],
        },
      ],
    },
    {
      name: "pictures",
      type: "array",
      of: [
        {
          name: "picture",
          type: "object",
          fields: [
            { name: "color", type: "string" },
            {
              name: "image",
              type: "image",
            },
            { name: "video", type: "mux.video" },
          ],
          preview: {
            select: {
              media: "image",
            },
          },
        },
      ],
      options: {
        layout: "grid",
      },
    },
  ],
});
