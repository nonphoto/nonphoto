import { createAsync } from "@solidjs/router";
import clsx from "clsx";
import { For, Suspense } from "solid-js";
import { Main } from "~/components/Main";
import { sanityPictureColor } from "~/components/SanityPicture";
import { fetchSiteQuery } from "~/lib/queries";
import { typography } from "~/lib/typography.ts";
import classes from "./index.module.css";

export const route = {
  preload: () => fetchSiteQuery(),
};

export default function IndexRoute() {
  const site = createAsync(() => fetchSiteQuery());
  return (
    <Main>
      <ul class={classes.projectList}>
        <Suspense>
          <For each={site()?.projects}>
            {(project) => (
              <li class={classes.project}>
                <For each={project.pictures}>
                  {(picture) => (
                    <div
                      class={classes.picture}
                      style={{ background: sanityPictureColor(picture) }}
                    />
                  )}
                </For>
              </li>
            )}
          </For>
        </Suspense>
      </ul>
      <h1 class={clsx(classes.title, typography.size2)}>
        <span>I</span> build and design custom websites that are both playful
        and efficient, with meticulous attention to detail. My work has been
        featured on [Awwwards], (Siteinspire), FWA, Hoverstates, and Typewolf.
      </h1>
      <p>
        Jonas Luebbers <span>I</span> build and design custom websites that are
        both playful and efficient, with meticulous attention to detail. My work
        has been featured on [Awwwards], (Siteinspire), FWA, Hoverstates, and
        Typewolf.
      </p>
    </Main>
  );
}
