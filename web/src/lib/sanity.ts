import PicoSanity from "picosanity";
import config from "~/../../sanity.config";
import { GroqdParseError, makeSafeQueryRunner } from "groqd";
import { ServerError } from "solid-start";

const client = new PicoSanity({
  ...config,
  apiVersion: "2023-08-01",
  useCdn: true,
});

type QueryParams = Parameters<typeof client.fetch>[1];

const safeQueryRunner = makeSafeQueryRunner(
  (query: string, params: QueryParams = {}) => client.fetch(query, params)
);

export const fetchQuery = (...args: Parameters<typeof safeQueryRunner>) =>
  safeQueryRunner(...args).catch((error) => {
    if (error instanceof GroqdParseError) {
      throw new ServerError(error.message);
    } else {
      throw error;
    }
  });
