import { describe, it, expect } from "vitest";
import {
  groupLogsByDate,
  dayCompletionPercent,
  computeStreaks,
  buildHeatmapData,
} from "./streaks.js";

const routines = [{ id: 1 }, { id: 2 }];

function completed(date, routineId) {
  return { date, routineId, completed: true };
}

describe("groupLogsByDate", () => {
  it("ignores incomplete logs and deduplicates completed routine IDs", () => {
    const result = groupLogsByDate([
      completed("2026-11-09", 1),
      completed("2026-11-09", 1),
      completed("2026-11-09", 2),
      { date: "2026-11-09", routineId: 3, completed: false },
      { date: "2026-11-10", routineId: 1, completed: false },
    ]);

    expect(result["2026-11-09"]).toEqual(new Set([1, 2]));
    expect(result["2026-11-09"].size).toBe(2);
    expect(result).not.toHaveProperty("2026-11-10");
  });

  it("keeps completed routines grouped under their respective dates", () => {
    const result = groupLogsByDate([
      completed("2026-11-09", 1),
      completed("2026-11-10", 2),
    ]);

    expect(result["2026-11-09"]).toEqual(new Set([1]));
    expect(result["2026-11-10"]).toEqual(new Set([2]));
  });
});

describe("dayCompletionPercent", () => {
  it("returns zero when there are no routines", () => {
    expect(dayCompletionPercent("2026-11-09", [], {})).toBe(0);
  });

  it("returns zero when there are no completed logs for the date", () => {
    expect(dayCompletionPercent("2026-11-09", routines, {})).toBe(0);
  });

  it("rounds one of three completed routines to 33 percent", () => {
    const threeRoutines = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const logs = groupLogsByDate([completed("2026-11-09", 1)]);

    expect(dayCompletionPercent("2026-11-09", threeRoutines, logs)).toBe(33);
  });

  it("rounds two of three completed routines to 67 percent", () => {
    const threeRoutines = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const logs = groupLogsByDate([
      completed("2026-11-09", 1),
      completed("2026-11-09", 2),
    ]);

    expect(dayCompletionPercent("2026-11-09", threeRoutines, logs)).toBe(67);
  });

  it("does not count duplicate completed logs twice", () => {
    const logs = groupLogsByDate([
      completed("2026-11-09", 1),
      completed("2026-11-09", 1),
    ]);

    expect(dayCompletionPercent("2026-11-09", routines, logs)).toBe(50);
  });
});

describe("computeStreaks", () => {
  it("returns zero streaks when there are no routines", () => {
    expect(computeStreaks([], [], 100, "2026-11-11")).toEqual({
      current: 0,
      longest: 0,
    });
  });

  it("preserves a two-day current streak when today is unfinished", () => {
    const logs = [
      completed("2026-11-09", 1),
      completed("2026-11-09", 2),
      completed("2026-11-10", 1),
      completed("2026-11-10", 2),
    ];

    expect(computeStreaks(routines, logs, 100, "2026-11-11")).toEqual({
      current: 2,
      longest: 2,
    });
  });

  it("breaks the current streak after a missed preceding day but retains the longest", () => {
    const logs = [
      completed("2026-11-07", 1),
      completed("2026-11-07", 2),
      completed("2026-11-08", 1),
      completed("2026-11-08", 2),
    ];

    expect(computeStreaks(routines, logs, 100, "2026-11-11")).toEqual({
      current: 0,
      longest: 2,
    });
  });

  it("counts three half-completed days at a 50 percent threshold", () => {
    const logs = [
      completed("2026-11-08", 1),
      completed("2026-11-09", 1),
      completed("2026-11-10", 1),
    ];

    expect(computeStreaks(routines, logs, 50, "2026-11-11")).toEqual({
      current: 3,
      longest: 3,
    });
  });

  it("does not count half-completed days at a 51 percent threshold", () => {
    const logs = [
      completed("2026-11-08", 1),
      completed("2026-11-09", 1),
      completed("2026-11-10", 1),
    ];

    expect(computeStreaks(routines, logs, 51, "2026-11-11")).toEqual({
      current: 0,
      longest: 0,
    });
  });

  it("includes today when today meets the completion threshold", () => {
    const logs = [
      completed("2026-11-10", 1),
      completed("2026-11-10", 2),
      completed("2026-11-11", 1),
      completed("2026-11-11", 2),
    ];

    expect(computeStreaks(routines, logs, 100, "2026-11-11")).toEqual({
      current: 2,
      longest: 2,
    });
  });
});

describe("buildHeatmapData", () => {
  it("returns chronological dates with their corresponding completion percentages", () => {
    const logs = [
      completed("2026-11-09", 1),
      completed("2026-11-10", 1),
      completed("2026-11-10", 2),
    ];

    expect(buildHeatmapData(routines, logs, 4, "2026-11-11")).toEqual([
      { date: "2026-11-08", percent: 0 },
      { date: "2026-11-09", percent: 50 },
      { date: "2026-11-10", percent: 100 },
      { date: "2026-11-11", percent: 0 },
    ]);
  });

  it("returns an empty heatmap when zero days are requested", () => {
    expect(buildHeatmapData(routines, [], 0, "2026-11-11")).toEqual([]);
  });
});
