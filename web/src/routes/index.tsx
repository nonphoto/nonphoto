import { createAsync, query } from "@solidjs/router";
import clsx from "clsx";
import groq from "groq";
import { For, Suspense } from "solid-js";
import SanityPicture from "~/components/SanityPicture";
import { sanityClient } from "~/lib/sanity.ts";
import { typography } from "~/lib/typography.ts";
import { ProjectsQueryResult } from "../../sanity.types";
import classes from "./index.module.css";

const projectsQuery = groq`*[_type == 'project'] | order(date, desc) {
  title,
  slug,
  pictures,
}`;

const getProjects = query(async () => {
  "use server";
  const result = await sanityClient.fetch<ProjectsQueryResult>(projectsQuery);
  return result;
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
                  {(picture, index) => (
                    <div>
                      {project.slug}
                      <SanityPicture {...picture} />
                    </div>
                  )}
                </For>
              </li>
            )}
          </For>
        </Suspense>
      </ul>
      <h1 class={clsx(classes.title, typography.title)}>
        <span>Jonas Luebbers</span>
        <span>Creative Developer</span>
      </h1>
    </main>
  );
}
