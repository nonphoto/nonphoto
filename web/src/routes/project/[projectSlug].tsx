import clsx from "clsx";
import classes from "./[projectSlug].module.css";
import { q } from "groqd";
import { For, createResource } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { fetchQuery } from "~/lib/sanity";
import { typography } from "~/lib/typography";
import ProjectPicture, {
  projectPictureSelection,
} from "~/components/ProjectPicture";

export function routeData() {
  const params = useParams();

  const [project] = createResource(() =>
    fetchQuery(
      q("*")
        .filter(`_type == 'project' && slug.current == $projectSlug`)
        .slice(0)
        .grab({
          title: q.string(),
          pictures: q("pictures")
            .filter()
            .grab(projectPictureSelection)
            .nullable(),
        }),
      params
    )
  );

  return project;
}

export default function ProjectPage() {
  const project = useRouteData<typeof routeData>();

  return (
    <>
      <h1 class={clsx(typography.title, classes.title)}>{project()?.title}</h1>
      <ul class={classes.pictures}>
        <For each={project()?.pictures}>
          {(picture) => (
            <li>
              <ProjectPicture {...picture} class={classes.picture} background />
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
