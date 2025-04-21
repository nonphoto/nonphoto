import { createAsync, query } from "@solidjs/router";
import clsx from "clsx";
import groq from "groq";
import { For } from "solid-js";
import ProjectPicture, {
  projectPictureFragment,
} from "~/components/ProjectPicture.jsx";
import { sanityClient } from "~/lib/sanity.js";
import { typography } from "~/lib/typography.js";
import classes from "./index.module.css";

const projectsQuery = groq`*[_type == 'project'] | order(date, desc) {
  title,
  slug,
  pictures[]{
    _key,
    "value":${projectPictureFragment},
  },
}`;

const getProjects = query(async () => {
  "use server";
  return await sanityClient.fetch(projectsQuery);
}, "projects");

export const route = {
  preload: () => getProjects(),
};

export default function RootIndex() {
  const projects = createAsync(() => getProjects());
  return (
    <main class={classes.main}>
      <ul class={classes.projectList}>
        <For each={projects()}>
          {(project) => (
            <li class={classes.project}>
              <For each={project.pictures}>
                {(picture, index) => (
                  <a href={`/project/${project.slug}#${index()}`}>
                    <ProjectPicture
                      {...picture}
                      class={classes.picture}
                      background
                    />
                  </a>
                )}
              </For>
            </li>
          )}
        </For>
      </ul>
      <h1 class={clsx(classes.title, typography.title)}>
        <span>Jonas Luebbers</span>
        <span>Creative Developer</span>
      </h1>
    </main>
  );
}
