import { defaultWidths, imageProps } from "@nonphoto/sanity-image";
import { createHydratableSingletonRoot } from "@solid-primitives/rootless";
import { TypeFromSelection, q, sanityImage } from "groqd";
import {
  ComponentProps,
  Show,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js";
import { Img, Picture, Source } from "solid-picture";
import { client as sanityClient } from "~/lib/sanity";

export const sanityPictureSelection = {
  image: sanityImage("image").nullable(),
  video: q("video.asset")
    .deref()
    .grab({
      playbackId: q.string(),
    })
    .nullable(),
};

export const useHlsResource = createHydratableSingletonRoot(() => {
  const [mounted, setMounted] = createSignal(false);
  const [resource] = createResource(mounted, () => import("hls.js"));

  onMount(() => {
    setMounted(true);
  });

  return resource;
});

function Video(props: ComponentProps<"video">) {
  const [localProps, otherProps] = splitProps(props, ["src"]);
  const [element, setElement] = createSignal<HTMLVideoElement>();
  const [ready, setReady] = createSignal(false);
  const hlsResource = useHlsResource();

  createEffect(() => {
    if (hlsResource() && element() && localProps.src) {
      const Hls = hlsResource()!.default;
      const hls = new Hls();
      hls.loadSource(localProps.src);
      hls.attachMedia(element()!);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setReady(true);
      });
      onCleanup(() => {
        hls.destroy();
      });
    }
  });

  createEffect(() => {
    if (ready() && element()) {
      element()!.play();
    }
  });

  return <video {...otherProps} ref={setElement} autoplay={false} />;
}

export default function SanityPicture(
  props: TypeFromSelection<typeof sanityPictureSelection>
) {
  const hlsResource = useHlsResource();

  return (
    <Picture>
      <Show when={hlsResource.state === "ready" && props.video?.playbackId}>
        {(playbackId) => (
          <Source
            src={`https://stream.mux.com/${playbackId()}`}
            type="video/mux"
          />
        )}
      </Show>
      <Img
        {...imageProps({
          image: props.image!,
          client: sanityClient,
          widths: defaultWidths,
        })}
        sizes="100vw"
        videoComponent={Video}
      />
    </Picture>
  );
}
