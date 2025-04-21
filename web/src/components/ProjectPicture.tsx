import { ComponentProps } from "solid-js";
import SanityPicture, { sanityPictureFragment } from "./SanityPicture.js";

export const projectPictureFragment = sanityPictureFragment;

export default function ProjectPicture(
  props: ComponentProps<typeof SanityPicture>
) {
  return <SanityPicture {...props} />;
}
