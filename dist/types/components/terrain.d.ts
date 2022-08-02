import { Component } from "solid-js";
import type { TerrainSpecification } from "mapbox-gl";
export declare const Terrain: Component<{
    style: TerrainSpecification;
    visible?: boolean;
    children?: any;
}>;
