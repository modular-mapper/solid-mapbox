import { createEffect, onCleanup } from "solid-js";
import { useMap } from "./map";

interface ImageProps {
  id: string;
  url?: string;
  image: Parameters<mapboxgl.Map["updateImage"]>[1];
  options?: { pixelRatio?: number | undefined; sdf?: boolean | undefined };
}

export function Image(props: ImageProps) {
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
}
