import MapboxGL from "mapbox-gl";
import { Component, onCleanup, onMount, ParentProps } from "solid-js";
import { useMap } from "./map";

const CONTROLS = {
  attribution: MapboxGL.AttributionControl,
  fullscreen: MapboxGL.FullscreenControl,
  geolocate: MapboxGL.GeolocateControl,
  navigation: MapboxGL.NavigationControl,
  scale: MapboxGL.ScaleControl,
};

type ControlType = keyof typeof CONTROLS;

interface ControlProps<T extends ControlType> extends ParentProps {
  options?: ConstructorParameters<typeof CONTROLS[T]>[0];
  position?: Parameters<MapboxGL.Map["addControl"]>[1];
}

type ControlComponent<T extends ControlType> = Component<ControlProps<T>>;

function createControl<T extends ControlType>(type: ControlType): ControlComponent<T> {
  return (props) => {
    const { map } = useMap();
    const control = new CONTROLS[type]();

    // Add Control
    onMount(() => map.addControl(control, props.position));

    // Remove Control
    onCleanup(() => map.removeControl(control));

    return props.children;
  };
}

export const Control = {
  Attribution: createControl("attribution"),
  Navigation: createControl("navigation"),
  Fullscreen: createControl("fullscreen"),
  Geolocate: createControl("geolocate"),
  Scale: createControl("scale"),
};
