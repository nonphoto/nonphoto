import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: file("./src/posts.json"),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { posts };
