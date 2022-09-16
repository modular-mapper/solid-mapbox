import { onCleanup, createEffect, Component } from "solid-js";
import { useMap } from "./map";

type Image =
  | HTMLImageElement
  | ImageBitmap
  | ImageData
  | ArrayBufferView
  | {
      width: number;
      height: number;
      data: Uint8Array | Uint8ClampedArray;
    };

export const Image: Component<{
  id: string;
  url?: string;
  image: Image;
  options?: { pixelRatio?: number | undefined; sdf?: boolean | undefined };
}> = (props) => {
  const { map } = useMap();
  // Add Image
  createEffect(() => {
    if (!props.image) return;
    if (props.url) {
      map.loadImage(props.url, (_, image) => !map.hasImage(props.id) && map.addImage(props.id, props.image));
    } else {
      !map.hasImage(props.id) && map.addImage(props.id, props.image, props.options);
    }
  });

  // Remove Image
  onCleanup(() => map.hasImage(props.id) && map.removeImage(props.id));

  // Update Image
  createEffect(async () => {
    if (props.image && props.url) return;

    if (props.url) {
      map.loadImage(props.url, (error, image) => {
        if (error) throw error;
        !map.hasImage(props.id) && map.updateImage(props.id, props.image);
      });
    } else {
      map.getStyle() && map.hasImage(props.id) && map.updateImage(props.id, props.image);
    }
  });

  return <></>;
};
