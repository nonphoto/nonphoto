import { q } from "groqd";
import { For, createResource } from "solid-js";
import { useRouteData } from "solid-start";
import { fetchQuery } from "~/lib/sanity";

export function routeData() {
  const [projects] = createResource(() =>
    fetchQuery(
      q("*")
        .filter("_type == 'project'")
        .grab({ title: q.string(), slug: q.slug("slug") })
    )
  );

  return projects;
}

export default function HomePage() {
  const projects = useRouteData<typeof routeData>();

  return (
    <main>
      <ul>
        <For each={projects()}>
          {(project) => (
            <li>
              <a href={`/projects/${project.slug}`}>{project.title}</a>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
