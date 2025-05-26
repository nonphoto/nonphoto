import { createAsync, query } from "@solidjs/router";
import clsx from "clsx";
import groq from "groq";
import { For, Suspense } from "solid-js";
import SanityPicture from "~/components/SanityPicture";
import data from "~/data.json";
import { typography } from "~/lib/typography.ts";
import classes from "./index.module.css";

const projectsQuery = groq`*[_type == 'project'] | order(date, desc) {
  title,
  slug,
  pictures[]{
    ...,
    image {
      asset->
    },
    video {
      asset->
    }
  },
}`;

const getProjects = query(async () => {
  "use server";
  // const result = await sanityClient.fetch<ProjectsQueryResult>(projectsQuery);
  return data;
}, "projects");

export const route = {
  preload: () => getProjects(),
};

export default function RootIndex() {
  const projects = createAsync(() => getProjects());
  return (
    <main class={classes.main}>
      <ul class={classes.projectList}>
        <Suspense>
          <For each={projects()}>
            {(project) => (
              <li class={classes.project}>
                <For each={project.pictures}>
                  {(picture) => <SanityPicture {...picture} />}
                </For>
              </li>
            )}
          </For>
        </Suspense>
      </ul>
      <h1 class={clsx(classes.title, typography.large)}>
        <span>I</span> build and design custom websites that are both playful
        and efficient, with meticulous attention to detail. My work has been
        featured on [Awwwards], (Siteinspire), FWA, Hoverstates, and Typewolf.
      </h1>
      <p class={typography.small}>
        Jonas Luebbers <span>I</span> build and design custom websites that are
        both playful and efficient, with meticulous attention to detail. My work
        has been featured on [Awwwards], (Siteinspire), FWA, Hoverstates, and
        Typewolf.
      </p>
    </main>
  );
}
