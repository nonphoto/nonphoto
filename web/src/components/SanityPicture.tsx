import { defaultWidths, imageProps } from "@nonphoto/sanity-image";
import { splitProps } from "solid-js";
import { Img, MediaElementProps } from "solid-picture";
import { sanityClient } from "~/lib/sanity";
import { SanityImageAsset, SanityImageMetadata } from "../../sanity.types";

export interface SanityPictureProps extends MediaElementProps {
  color?: string | null;
  image?: {
    asset?: SanityImageAsset | null;
  } | null;
  metadata?: SanityImageMetadata | null;
  video?: {
    playbackId?: string | null;
  } | null;
}

export default function SanityPicture(props: SanityPictureProps) {
  const [, elementProps] = splitProps(props, [
    "video",
    "metadata",
    "image",
    "color",
  ]);
  const playbackId = () => props.video?.playbackId;
  const size = () => props.metadata?.dimensions;
  const backgroundColor = () =>
    props.color ?? props.metadata?.palette?.dominant;
  const imgProps = () =>
    imageProps({
      image: props.image?.asset,
      client: sanityClient,
      widths: defaultWidths,
    });

  return (
    <Img
      {...elementProps}
      srcset={imgProps()?.srcset}
      placeholderSrc={imgProps().src}
      videoSrc={
        playbackId() ? `https://stream.mux.com/${playbackId()}` : undefined
      }
      videoMode="hls"
      naturalSize={
        size() ? { width: size()!.width, height: size()!.height } : undefined
      }
      style={{
        "background-color": backgroundColor(),
      }}
    />
  );
}
