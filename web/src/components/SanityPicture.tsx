import {
  defaultWidths,
  imageProps,
  ImagePropsOptions,
} from "@nonphoto/sanity-image";
import { splitProps } from "solid-js";
import { Img, MediaElementProps } from "solid-picture";
import { sanityClient } from "~/lib/sanity";

export interface SanityPictureProps extends MediaElementProps {
  color?: string | null;
  image?: ImagePropsOptions["image"] | null;
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
      srcset={imgProps()?.srcset}
      placeholderSrc={imgProps()?.src}
    />
  );
}
