import clsx from "clsx";
import classes from "./index.module.css";
import { q, sanityImage } from "groqd";
import { For, createEffect, createResource } from "solid-js";
import { useRouteData } from "solid-start";
import { fetchQuery, client as sanityClient } from "~/lib/sanity";
import { typography } from "~/lib/typography";
import { Img } from "solid-picture";
import { defaultWidths, imageProps } from "@nonphoto/sanity-image";

export function routeData() {
  const [projects] = createResource(() =>
    fetchQuery(
      q("*")
        .filter("_type == 'project'")
        .grab({
          title: q.string(),
          slug: q.slug("slug"),
          pictures: q("pictures")
            .filter()
            .grab({
              image: sanityImage("image"),
            })
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
            <li>
              <For each={project.pictures}>
                {(picture) => (
                  <Img
                    {...imageProps({
                      image: picture.image,
                      client: sanityClient,
                      widths: defaultWidths,
                      quality: 90,
                    })}
                    sizes="100vw"
                  />
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
