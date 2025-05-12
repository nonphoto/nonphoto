import { ComponentProps } from "solid-js";
import SanityPicture from "./SanityPicture.tsx";

export default function ProjectPicture(
  props: ComponentProps<typeof SanityPicture>
) {
  return <SanityPicture {...props} />;
}
