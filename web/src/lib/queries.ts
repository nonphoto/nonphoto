import { query } from "@solidjs/router";
import groq from "groq";
import { SiteQueryResult } from "../../sanity.types";
import { sanityClient } from "./sanity";

const siteQuery = groq`*[_type == "site"][0]{
  "projects": projects[]->{
    title,
    slug,
    pictures[]{
      ...,
      image {
        asset->
      },
      video {
        asset->
      },
    },
  },
}`;

export const fetchSiteQuery = query(async () => {
  "use server";
  return sanityClient.fetch<SiteQueryResult>(siteQuery);
}, "site");
