import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import config from "../sanity.config";

export default defineConfig({
  ...config,
  name: "default",
  title: "nonphoto",
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
