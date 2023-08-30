import clsx from "clsx";
import classes from "./index.module.css";
import { q } from "groqd";
import { For, createResource } from "solid-js";
import { useRouteData } from "solid-start";
import { fetchQuery } from "~/lib/sanity.js";
import { typography } from "~/lib/typography.js";
import ProjectPicture from "~/components/ProjectPicture.jsx";
import { sanityPictureSelection } from "~/components/SanityPicture.jsx";

export function routeData() {
  const [projects] = createResource(() =>
    fetchQuery(
      q("*")
        .filter("_type == 'project'")
        .order("date desc")
        .grab({
          title: q.string(),
          slug: q.slug("slug"),
          pictures: q("pictures")
            .filter()
            .grab(sanityPictureSelection)
            .nullable(),
        })
    )
  );

  return projects;
}

export default function HomePage() {
  const projects = useRouteData<typeof routeData>();

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
