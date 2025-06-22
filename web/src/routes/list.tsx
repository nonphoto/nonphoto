import { createAsync, query } from "@solidjs/router";
import clsx from "clsx";
import { createSignal, For, Suspense } from "solid-js";
import { Main } from "~/components/Main";
import SanityPicture, { SanityPictureProps } from "~/components/SanityPicture";
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
                    {(picture) => (
                      <li class={classes.pictureListItem}>
                        <Picture picture={picture} />
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

function Picture({ picture }: { picture: SanityPictureProps }) {
  const [outerElement, setOuterElement] = createSignal<HTMLDivElement | null>(
    null
  );
  const [innerElement, setInnerElement] = createSignal<HTMLDivElement | null>(
    null
  );

  createEffect(() => {
    const elementValue = outerElement();
    if (elementValue) {
      const timeline = new ViewTimeline({
        subject: elementValue,
        axis: "inline",
        inset: "50% 0%",
        range: "contain 0% cover 100%",
      });

      elementValue.animate(
        {
          transform: ["scaleX(0)", "scaleX(1)"],
        },
        {
          fill: "both",
          timeline,
        }
      );
    }
  });

  return (
    <div
      ref={setOuterElement}
      style={{ "transform-origin": "0% 50%", overflow: "hidden" }}
    >
      <SanityPicture
        ref={setInnerElement}
        {...picture}
        class={classes.picture}
        style={{ "transform-origin": "0% 50%" }}
      />
    </div>
  );
}
