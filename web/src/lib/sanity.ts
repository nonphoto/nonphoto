import PicoSanity from "picosanity";
import config from "~/../../sanity.config";

export const sanityClient = new PicoSanity({
  ...config,
  apiVersion: "2025-04-01",
  useCdn: true,
});
