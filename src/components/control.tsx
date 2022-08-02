import { onCleanup, Component, ParentProps, onMount } from "solid-js";
import { useMap } from "./map";
import MBX from "mapbox-gl";

const CONTROLS = {
  attribution: MBX.AttributionControl,
  fullscreen: MBX.FullscreenControl,
  geolocate: MBX.GeolocateControl,
  navigation: MBX.NavigationControl,
  scale: MBX.ScaleControl,
};

type ControlType = keyof typeof CONTROLS;

interface ControlProps<T extends ControlType> extends ParentProps {
  options?: ConstructorParameters<typeof CONTROLS[T]>[0];
  position?: Parameters<MBX.Map["addControl"]>[1];
}

type ControlComponent<T extends ControlType> = Component<ControlProps<T>>;

const createControl = <T extends ControlType>(type: ControlType): ControlComponent<T> => {
  return (props) => {
    const map = useMap();
    const control = new CONTROLS[type]();

    // Add Control
    onMount(() => map().addControl(control, props.position));

    // Remove Control
    onCleanup(() => map().removeControl(control));

    return props.children;
  };
};

export const Control = {
  Attribution: createControl("attribution"),
  Navigation: createControl("navigation"),
  Fullscreen: createControl("fullscreen"),
  Geolocate: createControl("geolocate"),
  Scale: createControl("scale"),
};
