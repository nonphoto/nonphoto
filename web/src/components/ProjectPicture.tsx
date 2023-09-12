import {
  ComponentProps,
  createEffect,
  createMemo,
  createSignal,
  splitProps,
} from "solid-js";
import {
  rectPosition,
  rectSize,
  rectCreate,
  rectFromPositionSize,
} from "@chloranthy/core";
import { vec2Create } from "@chloranthy/gl-matrix";
import { SingletonMap, useLayoutModel } from "@chloranthy/layout-model";
import {
  createMaybeMemo,
  createSetRect,
  createTransition,
} from "@chloranthy/solid";
import SanityPicture, { sanityPictureSelection } from "./SanityPicture.js";
import { TypeFromSelection, q } from "groqd";
import { createHydratableSingletonRoot } from "@solid-primitives/rootless";

export const projectPictureSelection = {
  _key: q.string(),
  ...sanityPictureSelection,
};

export const useRects = createHydratableSingletonRoot(() => {
  const layoutModel = useLayoutModel();
  return new SingletonMap(() => {
    const [element, setElement] = createSignal<HTMLElement>();
    const layoutRect = layoutModel.useRect(element);
    const rect = createMemo<DOMRect | undefined>(
      (prev) => layoutRect() ?? prev
    );
    const targetPosition = createMaybeMemo(rectPosition, vec2Create, rect);
    const targetSize = createMaybeMemo(rectSize, vec2Create, rect);
    const position = createTransition(targetPosition, 150);
    const size = createTransition(targetSize, 300);
    const transitionRect = createMaybeMemo(
      rectFromPositionSize,
      rectCreate,
      () => position()?.p,
      () => size()?.p
    );
    return { rect: transitionRect, element, setElement };
  });
});

export default function ProjectPicture(
  props: TypeFromSelection<typeof projectPictureSelection> &
    ComponentProps<typeof SanityPicture>
) {
  const [, elementProps] = splitProps(props, ["_key"]);
  const { rect, element, setElement } = useRects().use(props._key);

  createSetRect(element, rect);

  return <SanityPicture {...elementProps} ref={setElement} />;
}
