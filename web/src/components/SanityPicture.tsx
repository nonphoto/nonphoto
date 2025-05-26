import { defaultWidths, imageProps } from "@nonphoto/sanity-image";
import { splitProps } from "solid-js";
import { Img, MediaElementProps } from "solid-picture";
import { sanityClient } from "~/lib/sanity";
import { SanityImageMetadata } from "../../sanity.types";

export interface SanityPictureProps extends MediaElementProps {
  color?: string | null;
  image?: {
    asset: {
      metadata: SanityImageMetadata;
    } | null;
  } | null;
  video?: {
    asset?: {
      playbackId?: string | null;
    } | null;
  } | null;
}

export default function SanityPicture(props: SanityPictureProps) {
  const [, elementProps] = splitProps(props, ["video", "image", "color"]);
  const playbackId = () => props.video?.asset?.playbackId;
  const imgProps = () => {
    const imageValue = props.image;
    if (imageValue) {
      return imageProps({
        image: imageValue,
        client: sanityClient,
        widths: defaultWidths,
      });
    }
  };
  const videoSrc = () =>
    playbackId() ? `https://stream.mux.com/${playbackId()}` : undefined;
  return (
    <Img
      {...elementProps}
      src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
      style={{
        width: "3.1rem",
        height: "1.5rem",
        "background-color":
          props.image?.asset?.metadata.palette?.dominant?.background,
      }}
      // srcset={imgProps()?.srcset}
      // placeholderSrc={imgProps()?.src}
    />
  );
}
