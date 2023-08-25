import { defaultWidths, imageProps } from "@nonphoto/sanity-image";
import { TypeFromSelection, q, sanityImage } from "groqd";
import { createEffect, splitProps } from "solid-js";
import { Img, MediaElementProps } from "solid-picture";
import { client as sanityClient } from "~/lib/sanity";

export const sanityPictureSelection = {
  image: sanityImage("image").nullable(),
  metadata: q("image.asset")
    .deref()
    .grab({
      metadata: q("metadata").grab({
        dimensions: q("dimensions").grab({
          height: q.number(),
          width: q.number(),
        }),
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
  props: TypeFromSelection<typeof sanityPictureSelection> & MediaElementProps
) {
  const [, elementProps] = splitProps(props, ["video", "metadata", "image"]);
  const playbackId = () => props.video?.playbackId;
  const size = () => props.metadata?.metadata.dimensions;
  const imgProps = () =>
    imageProps({
      image: props.image!,
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
    />
  );
}
