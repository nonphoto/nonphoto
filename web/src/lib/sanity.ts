import PicoSanity from "picosanity";
import config from "~/../../sanity.config";
import { GroqdParseError, makeSafeQueryRunner } from "groqd";
import { ServerError } from "solid-start";

export const client = new PicoSanity({
  ...config,
  apiVersion: "2023-08-01",
  useCdn: true,
});

const safeQueryRunner = makeSafeQueryRunner(
  (query: string, params: Record<string, unknown> = {}) =>
    client.fetch(query, params)
);

export const fetchQuery: typeof safeQueryRunner = (...args) =>
  safeQueryRunner(...args).catch((error) => {
    if (error instanceof GroqdParseError) {
      throw new ServerError(error.message);
    } else {
      throw error;
    }
  });
