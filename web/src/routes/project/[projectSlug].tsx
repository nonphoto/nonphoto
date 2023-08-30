import clsx from "clsx";
import classes from "./[projectSlug].module.css";
import { q } from "groqd";
import { For, createResource } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import SanityPicture, {
  sanityPictureSelection,
} from "~/components/SanityPicture";
import { fetchQuery } from "~/lib/sanity";
import { typography } from "~/lib/typography";

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
            .grab(sanityPictureSelection)
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
              <SanityPicture {...picture} class={classes.picture} />
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
