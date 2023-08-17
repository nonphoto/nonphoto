import clsx from "clsx";
import classes from "./index.module.css";
import { q } from "groqd";
import { For, createResource } from "solid-js";
import { useRouteData } from "solid-start";
import { fetchQuery } from "~/lib/sanity";
import { typography } from "~/lib/typography";

export function routeData() {
  const [projects] = createResource(() =>
    fetchQuery(
      q("*")
        .filter("_type == 'project'")
        .grab({
          title: q.string(),
          slug: q.slug("slug"),
          backgroundColor: q.string(),
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
            <li>
              <a
                class={classes.project}
                style={{
                  "background-color": project.backgroundColor,
                }}
                href={`/projects/${project.slug}`}
                title={project.title}
              ></a>
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
