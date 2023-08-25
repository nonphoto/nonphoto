import { q } from "groqd";
import { createResource } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { fetchQuery } from "~/lib/sanity";

export function routeData() {
  const params = useParams();

  const [project] = createResource(() =>
    fetchQuery(
      q("*")
        .filter(`_type == 'project' && slug.current == $projectSlug`)
        .slice(0)
        .grab({ title: q.string() }),
      params
    )
  );

  return project;
}

export default function ProjectPage() {
  const project = useRouteData<typeof routeData>();

  return <h1>{project()?.title}</h1>;
}
