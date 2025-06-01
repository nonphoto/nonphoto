import { createAsync, query } from "@solidjs/router";
import clsx from "clsx";
import { For, Suspense } from "solid-js";
import { Main } from "~/components/Main";
import SanityPicture from "~/components/SanityPicture";
import data from "~/data.json";
import { typography } from "~/lib/typography";
import classes from "./list.module.css";

const getProjects = query(async () => {
  "use server";
  // const result = await sanityClient.fetch<ProjectsQueryResult>(projectsQuery);
  return data;
}, "projects");

export const route = {
  preload: () => getProjects(),
};

export default function ListRoute() {
  const projects = createAsync(() => getProjects());
  return (
    <Main>
      <Suspense>
        <ul class={classes.projectList}>
          <For each={projects()}>
            {(project) => (
              <li class={classes.projectListItem}>
                <ul class={classes.pictureList}>
                  <For each={project.pictures}>
                    {(picture, index) => (
                      <li class={classes.pictureListItem}>
                        <SanityPicture {...picture} class={classes.picture} />
                      </li>
                    )}
                  </For>
                </ul>
                <div class={classes.projectText}>
                  <p>{project.title}</p>
                  <p>Lorem ipsum dolor sit amet</p>
                </div>
              </li>
            )}
          </For>
          <li>
            <a class={clsx(typography.size2, classes.backButton)} href="/">
              Back⮍
            </a>
          </li>
        </ul>
      </Suspense>
    </Main>
  );
}
