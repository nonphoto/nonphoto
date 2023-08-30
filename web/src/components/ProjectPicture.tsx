import { ComponentProps, createSignal } from "solid-js";
import {
  rectPosition,
  rectSize,
  rectCreate,
  rectFromPositionSize,
} from "@chloranthy/core";
import { vec2Create } from "@chloranthy/gl-matrix";
import { useLayoutModel } from "@chloranthy/layout-model";
import {
  createMaybeMemo,
  createSetRect,
  createTransition,
} from "@chloranthy/solid";
import SanityPicture from "./SanityPicture.js";

export default function ProjectPicture(
  props: ComponentProps<typeof SanityPicture>
) {
  const [element, setElement] = createSignal<
    HTMLImageElement | HTMLVideoElement
  >();

  const layoutModel = useLayoutModel();
  const targetRect = layoutModel.useRect(element);
  const targetPosition = createMaybeMemo(rectPosition, vec2Create, targetRect);
  const targetSize = createMaybeMemo(rectSize, vec2Create, targetRect);
  const position = createTransition(targetPosition, 150);
  const size = createTransition(targetSize, 300);
  const transitionRect = createMaybeMemo(
    rectFromPositionSize,
    rectCreate,
    () => position()?.p,
    () => size()?.p
  );

  createSetRect(element, transitionRect);

  return <SanityPicture {...props} ref={setElement} />;
}
