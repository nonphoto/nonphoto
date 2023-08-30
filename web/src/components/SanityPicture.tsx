import { defaultWidths, imageProps } from "@nonphoto/sanity-image";
import { TypeFromSelection, q, sanityImage } from "groqd";
import { Show, splitProps } from "solid-js";
import { Img, MediaElementProps } from "solid-picture";
import { client as sanityClient } from "~/lib/sanity";

export const sanityPictureSelection = {
  image: sanityImage("image").nullable(),
  metadata: q("image.asset")
    .deref()
    .grab({
      dimensions: q("metadata.dimensions").grab({
        height: q.number(),
        width: q.number(),
      }),
      palette: q("metadata.palette.dominant").grab({
        background: q.string(),
        foreground: q.string(),
      }),
    })
    .nullable(),
  video: q("video.asset")
    .deref()
    .grab({
      playbackId: q.string(),
    })
    .nullable(),
};

export default function SanityPicture(
  props: TypeFromSelection<typeof sanityPictureSelection> &
    MediaElementProps & { background?: boolean }
) {
  const [, elementProps] = splitProps(props, ["video", "metadata", "image"]);
  const playbackId = () => props.video?.playbackId;
  const size = () => props.metadata?.dimensions;
  const backgroundColor = () => props.metadata?.palette.background;
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
        <div
          {...elementProps}
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
