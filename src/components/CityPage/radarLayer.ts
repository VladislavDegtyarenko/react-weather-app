import { type Map, type MapboxEvent, type MapDataEvent } from "mapbox-gl";

import { RADAR_MAX_ZOOM, RADAR_TILE_SIZE, type RadarFrame } from "../../api/radar";

const RADAR_OPACITY = 0.8;
const FRAME_TIMEOUT_MS = 8_000;
const RADAR_LAYER_A = "city-radar-a";
const RADAR_LAYER_B = "city-radar-b";

type FrameRequest = {
  map: Map;
  frame: RadarFrame;
  previousLayer: string | undefined;
  onReady: (layer: string) => void;
  onError: () => void;
};

/** Removes a radar source after its layer has released it. */
function removeRadarLayer(map: Map, layer: string) {
  map.removeLayer(layer);
  map.removeSource(layer);
}

/** Loads a raster frame underneath the labels and swaps it in once its visible tiles are ready. */
export function stageRadarFrame({ map, frame, previousLayer, onReady, onError }: FrameRequest) {
  const LAYER = previousLayer === RADAR_LAYER_A ? RADAR_LAYER_B : RADAR_LAYER_A;
  let isPending = true;

  const detachListeners = () => {
    window.clearTimeout(TIMEOUT);
    map.off("sourcedata", handleSourceData);
    map.off("error", handleMapError);
  };

  const discardFrame = () => {
    if (!isPending) {
      return;
    }

    isPending = false;
    detachListeners();
    if (map.getStyle()) {
      removeRadarLayer(map, LAYER);
    }
  };

  const failFrame = () => {
    discardFrame();
    onError();
  };

  const handleSourceData = (event: MapDataEvent) => {
    if (event.dataType !== "source" || event.sourceId !== LAYER) {
      return;
    }

    if (event.sourceDataType === "error") {
      failFrame();
      return;
    }

    if (event.tile && event.isSourceLoaded) {
      isPending = false;
      detachListeners();
      map.setPaintProperty(LAYER, "raster-opacity", RADAR_OPACITY);
      if (previousLayer) {
        removeRadarLayer(map, previousLayer);
      }
      onReady(LAYER);
    }
  };

  const handleMapError = (event: MapboxEvent) => {
    if ("sourceId" in event && event.sourceId === LAYER) {
      failFrame();
    }
  };

  const TIMEOUT = window.setTimeout(failFrame, FRAME_TIMEOUT_MS);
  const FIRST_LABEL = map.getStyle().layers.find((layer) => layer.type === "symbol");

  map.on("sourcedata", handleSourceData);
  map.on("error", handleMapError);
  map.addSource(LAYER, { type: "raster", tiles: [frame.tiles], tileSize: RADAR_TILE_SIZE, maxzoom: RADAR_MAX_ZOOM });
  map.addLayer({
    id: LAYER,
    type: "raster",
    source: LAYER,
    paint: { "raster-opacity": 0, "raster-opacity-transition": { duration: 0 }, "raster-fade-duration": 0 },
  }, FIRST_LABEL?.id);

  return discardFrame;
}
