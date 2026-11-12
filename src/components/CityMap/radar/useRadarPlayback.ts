import { useEffect, useRef, useState } from "react";
import { type Map } from "mapbox-gl";

import { type RadarFrame } from "./api/rainViewer";
import { stageRadarFrame } from "./stageRadarFrame";

const FRAME_DURATION_MS = 700;

type Options = { map: Map; frames: RadarFrame[] };

export function useRadarPlayback({ map, frames }: Options) {
  const ACTIVE_LAYER = useRef<string>();
  const LAST_INDEX = frames.length - 1;
  const [selectedIndex, setSelectedIndex] = useState(LAST_INDEX);
  const [displayedIndex, setDisplayedIndex] = useState<number>();
  const [failedIndex, setFailedIndex] = useState<number>();
  const [retryCount, setRetryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const HAS_FRAME_ERROR = failedIndex === selectedIndex;
  const IS_LOADING = !HAS_FRAME_ERROR && displayedIndex !== selectedIndex;

  useEffect(() => {
    if (displayedIndex === selectedIndex) {
      return;
    }

    return stageRadarFrame({
      map,
      frame: frames[selectedIndex],
      previousLayer: ACTIVE_LAYER.current,
      onReady: (layer) => {
        ACTIVE_LAYER.current = layer;
        setDisplayedIndex(selectedIndex);
      },
      onError: () => {
        setFailedIndex(selectedIndex);
        setIsPlaying(false);
      },
    });
  }, [map, frames, selectedIndex, displayedIndex, retryCount]);

  useEffect(() => {
    if (!isPlaying || IS_LOADING || HAS_FRAME_ERROR) {
      return;
    }

    const TIMER = window.setTimeout(() => {
      if (selectedIndex === LAST_INDEX) {
        setIsPlaying(false);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    }, FRAME_DURATION_MS);

    return () => window.clearTimeout(TIMER);
  }, [isPlaying, IS_LOADING, HAS_FRAME_ERROR, selectedIndex, LAST_INDEX]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (selectedIndex === LAST_INDEX) {
      setSelectedIndex(0);
    }
    setFailedIndex(undefined);
    setIsPlaying(true);
  };

  const selectFrame = (index: number) => {
    setIsPlaying(false);
    setFailedIndex(undefined);
    setSelectedIndex(index);
  };

  const retryFrame = () => {
    setFailedIndex(undefined);
    setRetryCount((count) => count + 1);
  };

  return {
    selectedIndex,
    displayedIndex,
    isPlaying,
    hasFrameError: HAS_FRAME_ERROR,
    isLoading: IS_LOADING,
    togglePlayback,
    selectFrame,
    retryFrame,
  };
}
