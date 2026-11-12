import { act, fireEvent, render, screen } from "@testing-library/react";
import { type Map } from "mapbox-gl";

import { getRadarFrames } from "../src/api/radar";
import CityRadar from "../src/components/CityPage/CityRadar";
import { stageRadarFrame } from "../src/components/CityPage/radarLayer";

jest.mock("../src/api/radar");
jest.mock("../src/components/CityPage/radarLayer");

const FRAMES = [
  { time: Date.UTC(2026, 10, 12, 11, 30) / 1_000, tiles: "older" },
  { time: Date.UTC(2026, 10, 12, 11, 40) / 1_000, tiles: "newer" },
];

it("keeps the last visible frame during a tile failure and lets the user retry it", async () => {
  const LOAD_FRAMES = jest.mocked(getRadarFrames);
  const STAGE_FRAME = jest.mocked(stageRadarFrame);
  const MAP = {} as Map;
  LOAD_FRAMES.mockResolvedValue(FRAMES);
  STAGE_FRAME.mockImplementation(() => jest.fn());

  render(<CityRadar map={MAP} />);

  const PLAY = await screen.findByRole("button", { name: "Play" });
  expect(STAGE_FRAME).toHaveBeenLastCalledWith(expect.objectContaining({ map: MAP, frame: FRAMES[1] }));
  act(() => STAGE_FRAME.mock.lastCall![0].onReady("latest"));

  fireEvent.click(PLAY);
  expect(STAGE_FRAME).toHaveBeenLastCalledWith(expect.objectContaining({
    map: MAP, frame: FRAMES[0], previousLayer: "latest",
  }));
  expect(screen.getByRole("status").textContent).toContain("Showing 11:40 UTC");
  act(() => STAGE_FRAME.mock.lastCall![0].onError());
  expect(screen.getByRole("status").textContent).toContain("This radar frame couldn’t load");
  expect(screen.getByRole("button", { name: "Play" }).hasAttribute("disabled")).toBe(true);

  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(STAGE_FRAME).toHaveBeenCalledTimes(3);
  act(() => STAGE_FRAME.mock.lastCall![0].onReady("earlier"));
  expect(screen.getByRole("status").textContent).toContain("Observed radar");
  expect(screen.queryByRole("button", { name: "Retry" })).toBeNull();
});
