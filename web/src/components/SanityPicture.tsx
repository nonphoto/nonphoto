import { defaultWidths, imageProps } from "@nonphoto/sanity-image";
import groq from "groq";
import { Show, splitProps } from "solid-js";
import { Img, MediaElementProps } from "solid-picture";
import { client as sanityClient } from "~/lib/sanity";

export const sanityPictureFragment = groq`{
  color,
  image,
  "metadata": image.asset->,
  "video": video.asset->{
    playbackId,
  },
}`;

export interface SanityPictureProps extends MediaElementProps {}

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
    props.color ?? props.metadata?.palette.background;
  const imgProps = () =>
    imageProps({
      image: props.image!,
      client: sanityClient,
      widths: defaultWidths,
    });

  return (
    <Show
      when={!props.background}
      fallback={
        <img
          {...elementProps}
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
          style={{ "background-color": backgroundColor() }}
        />
      }
    >
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
    </Show>
  );
}
