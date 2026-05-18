import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/posts" }),
    schema: z.object({
      title: z.string(),
      media: z.array(
        z.union([
          z.object({
            type: z.literal("uc-video"),
            uuid: z.string(),
          }),
        ]),
      ),
    }),
  }),
};
