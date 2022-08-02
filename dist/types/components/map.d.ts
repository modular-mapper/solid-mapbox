import { Accessor } from "solid-js";
import MBX from "mapbox-gl";
import type { ComponentProps, Component } from "solid-js";
declare type TransitionType = "flyTo" | "easeTo" | "jumpTo";
declare type ContainerProps = "id" | "class" | "classList" | "ref" | "children";
export declare type Viewport = {
    id?: string;
    center?: MBX.LngLatLike;
    bounds?: MBX.LngLatBounds;
    zoom?: number;
    pitch?: number;
    bearing?: number;
};
export interface MapProps extends Pick<ComponentProps<"div">, ContainerProps> {
    style?: ComponentProps<"div">["style"];
    /** Current Map View */
    viewport: Viewport;
    /** Mapbox Options
     * @see https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters
     */
    options?: Omit<MBX.MapboxOptions, "container">;
    /** Type for pan, move and zoom transitions */
    transitionType?: TransitionType;
    /** Event listener for Viewport updates */
    onViewportChange?: (viewport: Viewport) => void;
    /** Displays Map Tile Borders */
    showTileBoundaries?: boolean;
    /** Displays Wireframe if Terrain is visible */
    showTerrainWireframe?: boolean;
    /** Displays Borders if Padding is set */
    showPadding?: boolean;
    /** Displays Label Collision Boxes */
    showCollisionBoxes?: boolean;
    /** Displays all feature outlines even if normally not drawn by style rules */
    showOverdrawInspector?: boolean;
    /** Mouse Cursor Style */
    cursorStyle?: string;
    /** Dark Map Style */
    darkStyle?: MBX.StyleOptions | string;
    /** Disable automatic map resize */
    disableResize?: boolean;
    /** Debug Mode */
    debug?: boolean;
}
/** Provides the Mapbox Map Object */
export declare const useMap: () => Accessor<MBX.Map>;
/** Creates a new Map Container */
export declare const MapBox: Component<MapProps>;
export {};
