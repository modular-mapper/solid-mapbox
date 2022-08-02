import { onCleanup, createEffect } from "solid-js";
import { useMap } from "./map";
export const Image = (props) => {
    const map = useMap();
    // Add Image
    createEffect(() => {
        if (props.url) {
            map().loadImage(props.url, (_, image) => !map().hasImage(props.id) && map().addImage(props.id, image));
        }
        else {
            !map().hasImage(props.id) && map().addImage(props.id, props.image, props.options);
        }
    });
    // Remove Image
    onCleanup(() => map().hasImage(props.id) && map().removeImage(props.id));
    // Update Image
    createEffect(async () => {
        if (props.image && props.url)
            return;
        if (props.url) {
            map().loadImage(props.url, (error, image) => {
                if (error)
                    throw error;
                !map().hasImage(props.id) && map().updateImage(props.id, image);
            });
        }
        else {
            map().style && map().hasImage(props.id) && map().updateImage(props.id, props.image);
        }
    });
    return <></>;
};
