import {
  imageAssetFromSource,
  ImageSource,
  imageSrcset,
} from "@nonphoto/sanity-image";
import {
  SanityImageObject,
  SanityImageSource,
} from "@sanity/image-url/lib/types/types.js";
import { ComponentProps, Show, splitProps } from "solid-js";
import { JSX } from "solid-js/h/jsx-runtime";
import sanityClient from "~/../../sanity.config";

export interface SanityPictureProps extends ComponentProps<"picture"> {
  style?: JSX.CSSProperties;
  sizes?: ComponentProps<"img">["sizes"];
  value: {
    backgroundColor?: string | null;
    image?: ImageSource | null;
    video?: {
      asset?: {
        playbackId?: string | null;
      } | null;
    } | null;
  };
}

export default function SanityPicture(props: SanityPictureProps) {
  const [, elementProps] = splitProps(props, ["value", "sizes"]);
  const imageAsset = () =>
    props.value.image ? imageAssetFromSource(props.value.image) : undefined;
  return (
    <picture
      {...elementProps}
      style={{
        ...elementProps.style,
        "background-color": sanityPictureColor(props),
      }}
    >
      <Show when={imageAsset()}>
        {(imageAssetValue) => (
          <img
            srcset={imageSrcset(sanityClient, imageAssetValue())}
            sizes={props.sizes}
          />
        )}
      </Show>
    </picture>
  );
}

function isSanityImageObject(
  image: SanityImageSource,
): image is SanityImageObject {
  return image != null && typeof image === "object" && "asset" in image;
}

export function sanityPictureColor(
  props: SanityPictureProps,
): string | undefined {
  return props.image != null &&
    isSanityImageObject(props.image) &&
    "metadata" in props.image.asset
    ? props.image.asset.metadata.palette?.dominant?.background
    : undefined;
}
