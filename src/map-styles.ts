import { NestedKeys } from "./utils";

const MAPBASE = "mapbox://styles/mapbox";
const GITBASE = "https://raw.githubusercontent.com/";
const GISHUB = "https://raw.githubusercontent.com/GIShub4/map-styles/main/";

export const VECTOR_STYLES = {
  mb: {
    light: `${MAPBASE}/light-v10`,
    dark: `${MAPBASE}/dark-v10`,
    street: `${MAPBASE}/streets-v11`,
    outdoor: `${MAPBASE}/outdoors-v11`,
    sat: `${MAPBASE}/satellite-v9`,
    "sat-street": `${MAPBASE}/satellite-streets-v11`,
    nav: `${MAPBASE}/navigation-guidance-day-v4`,
    "nav-night": `${MAPBASE}/navigation-guidance-night-v4`,
    basic: `${MAPBASE}/cjf4m44iw0uza2spb3q0a7s41`,
    monochrome: `${MAPBASE}/cjv6rzz4j3m4b1fqcchuxclhb`,
    leshine: `${MAPBASE}/cjcunv5ae262f2sm9tfwg8i0w`,
    icecream: `${MAPBASE}/cj7t3i5yj0unt2rmt3y4b5e32`,
    cali: `${MAPBASE}/cjerxnqt3cgvp2rmyuxbeqme7`,
    northstar: `${MAPBASE}/cj44mfrt20f082snokim4ungi`,
    mineral: `${MAPBASE}/cjtep62gq54l21frr1whf27ak`,
    moonlight: `${MAPBASE}/cj3kbeqzo00022smj7akz3o1e`,
    frank: `${MAPBASE}-map-design/ckshxkppe0gge18nz20i0nrwq`,
    minimo: `${MAPBASE}-map-design/cksjc2nsq1bg117pnekb655h1`,
    decimal: `${MAPBASE}-map-design/ck4014y110wt61ctt07egsel6`,
    standard: `${MAPBASE}-map-design/ckr0svm3922ki18qntevm857n`,
    blueprint: `${MAPBASE}-map-design/cks97e1e37nsd17nzg7p0308g`,
    bubble: `${MAPBASE}-map-design/cksysy2nl62zp17quosctdtcc`,
    pencil: `${MAPBASE}-map-design/cks9iema71es417mlrft4go2k`,
  },
  gitbase: {
    "swiss-ski": `${GITBASE}mapbox/mapbox-gl-swiss-ski-style/master/cij1zoclj002y8rkkdjl69psd.json`,
    vintage: `${GITBASE}mapbox/mapbox-gl-vintage-style/master/cif5p01n202nisaktvljx9mv3.json`,
    whaam: `${GITBASE}mapbox/mapbox-gl-whaam-style/master/cii8323c8004w0nlvtss3dbm2.json`,
    neon: `${GITBASE}NatEvatt/awesome-mapbox-gl-styles/master/styles/Neon/style.json`,
    camoflauge: `${GITBASE}jingsam/mapbox-gl-styles/master/Camouflage.json`,
    emerald: `${GITBASE}jingsam/mapbox-gl-styles/master/Emerald.json`,
    runner: `${GITBASE}jingsam/mapbox-gl-styles/master/Runner.json`,
    "x-ray": `${GITBASE}jingsam/mapbox-gl-styles/master/X-ray.json`,
  },
  esri: {
    blueprint: `${GISHUB}esri:blueprint.json`,
    "charted-territory": `${GISHUB}esri:charted-territory.json`,
    "colored-pencil": `${GISHUB}esri:colored-pencil.json`,
    community: `${GISHUB}esri:community.json`,
    "mid-century": `${GISHUB}esri:mid-century.json`,
    "modern-antique": `${GISHUB}esri:modern-antique.json`,
    "nat-geo": `${GISHUB}esri:national-geographic.json`,
    newspaper: `${GISHUB}esri:newspaper.json`,
    "open-street-map": `${GISHUB}esri:open-street-map.json`,
    "light-gray-canvas": `${GISHUB}esri:light-gray-canvas.json`,
    "dark-gray-canvas": `${GISHUB}esri:dark-gray-canvas.json`,
    "human-geo-light": `${GISHUB}esri:human-geography-light.json`,
    "human-geo-dark": `${GISHUB}esri:human-geography-dark.json`,
    "world-navigation": `${GISHUB}esri:world-navigation.json`,
    "world-street": `${GISHUB}esri:world-street.json`,
    "world-street_night": `${GISHUB}esri:world-street-night.json`,
    "world-terrain": `${GISHUB}esri:world-terrain.json`,
    "world-terrain-hybrid": `${GISHUB}esri:world-terrain-hybrid.json`,
    "world-topographic": `${GISHUB}esri:world-topographic.json`,
    chromium: `${GISHUB}esri:chromium.json`,
    dreamcatcher: `${GISHUB}esri:dreamcatcher.json`,
    seahaven: `${GISHUB}esri:seahaven.json`,
    sangria: `${GISHUB}esri:sangria.json`,
    mercurial: `${GISHUB}esri:mercurial.json`,
    imagery: `${GISHUB}esri:imagery.json`,
    "imagery-hybrid": `${GISHUB}esri:imagery-hybrid.json`,
    firefly: `${GISHUB}esri:firefly.json`,
    "firefly-hybrid": `${GISHUB}esri:firefly-hybrid.json`,
    oceans: `${GISHUB}esri:oceans.json`,
  },
};

const CARTO = "https://{s}.basemaps.cartocdn.com/rastertiles/";
const STAMEN = "https://stamen-tiles-{s}.a.ssl.fastly.net/";
const TF = "https://{s}.tile.thunderforest.com/";

export const RASTER_STYLES = {
  osm: {
    org: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    human: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    cycle: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    topo: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    _copy: '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap</a>',
  },
  carto: {
    voyager: `${CARTO}voyager_labels_under/{z}/{x}/{y}{r}.png`,
    positron: `${CARTO}light_all/{z}/{x}/{y}{r}.png`,
    dark: `${CARTO}dark_all/{z}/{x}/{y}{r}.png`,
    _copy: '<a href="https://carto.com/attribution" target="_blank">&copy; Carto</a>',
  },
  stamen: {
    toner: `${STAMEN}toner/{z}/{x}/{y}{r}.png`,
    toner_lite: `${STAMEN}toner-lite/{z}/{x}/{y}{r}.png`,
    watercolor: `${STAMEN}watercolor/{z}/{x}/{y}.png`,
    terrain: `${STAMEN}terrain/{z}/{x}/{y}{r}.png`,
    _copy: '<a href="https://stamen.com/privacy-policy" target="_blank">&copy; Stamen Design</a>',
  },
  tf: {
    cycle: `${TF}cycle/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    trans: `${TF}transport/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    trans_dark: `${TF}transport-dark/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    landscape: `${TF}landscape/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    outdoors: `${TF}outdoors/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    neighbourhood: `${TF}neighbourhood/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    spinal: `${TF}spinal-map/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    pioneer: `${TF}pioneer/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    atlas: `${TF}atlas/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    mobile: `${TF}mobile-atlas/{z}/{x}/{y}{r}.png?apikey={apikey}`,
    _copy: '<a href="https://thunderforest.com/privacy" target="_blank">&copy; Thunderforest</a>',
  },
};

export type VectorStyle = NestedKeys<typeof VECTOR_STYLES>;
export type RasterStyle = NestedKeys<typeof RASTER_STYLES>;
export type MapStyle = VectorStyle | RasterStyle | (string & {});
