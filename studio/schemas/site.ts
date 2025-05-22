import { defineArrayMember, defineField, defineType } from "sanity";

export const siteType = defineType({
  name: "site",
  type: "document",
  fields: [
    defineField({
      name: "projects",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
        }),
      ],
    }),
  ],
});
