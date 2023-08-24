import { defaultWidths, imageProps } from "@nonphoto/sanity-image";
import { TypeFromSelection, q, sanityImage } from "groqd";
import { Img } from "solid-picture";
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
  props: TypeFromSelection<typeof sanityPictureSelection>
) {
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
      srcset={imgProps()?.srcset}
      naturalSize={
        size() ? { width: size()!.width, height: size()!.height } : undefined
      }
      placeholderSrc={imgProps().src}
      videoSrc={
        playbackId() ? `https://stream.mux.com/${playbackId()}` : undefined
      }
      videoMode="hls"
      width="400px"
    />
  );
}
