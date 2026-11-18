import { describe, it, expect } from "vitest";
import {
  computeDailyScore,
  computeAverageScore,
  getProductivityLevel,
  PRODUCTIVITY_LEVELS,
} from "./score.js";

describe("computeDailyScore", () => {
  it("returns 70 for 100% routines and habits with no other activity", () => {
    expect(
      computeDailyScore({
        routinePct: 100,
        habitPct: 100,
        roadmapDoneToday: 0,
        pomodoroToday: 0,
      }),
    ).toBe(70);
  });
  it("returns 0 when all productivity inputs are zero", () => {
    expect(
      computeDailyScore({
        routinePct: 0,
        habitPct: 0,
        roadmapDoneToday: 0,
        pomodoroToday: 0,
      }),
    ).toBe(0);
  });

  it("returns 0 when all inputs are omitted", () => {
    expect(computeDailyScore({})).toBe(0);
  });

  it("returns 100 when all categories reach their maximum", () => {
    expect(
      computeDailyScore({
        routinePct: 100,
        habitPct: 100,
        roadmapDoneToday: 4,
        pomodoroToday: 4,
      }),
    ).toBe(100);
  });

  it("applies the correct weights to routines and habits", () => {
    expect(
      computeDailyScore({
        routinePct: 50,
        habitPct: 50,
        roadmapDoneToday: 0,
        pomodoroToday: 0,
      }),
    ).toBe(35);
  });

  it("awards 5 weighted points for one roadmap completion", () => {
    expect(computeDailyScore({ roadmapDoneToday: 1 })).toBe(5);
  });

  it("awards 2.5 weighted points for one Pomodoro session, rounded to 3", () => {
    expect(computeDailyScore({ pomodoroToday: 1 })).toBe(3);
  });

  it("caps roadmap contributions at 20 weighted points", () => {
    expect(computeDailyScore({ roadmapDoneToday: 4 })).toBe(20);
    expect(computeDailyScore({ roadmapDoneToday: 10 })).toBe(20);
  });

  it("caps Pomodoro contributions at 10 weighted points", () => {
    expect(computeDailyScore({ pomodoroToday: 4 })).toBe(10);
    expect(computeDailyScore({ pomodoroToday: 10 })).toBe(10);
  });

  it("rounds fractional daily scores to the nearest integer", () => {
    expect(computeDailyScore({ routinePct: 51 })).toBe(20);
    expect(computeDailyScore({ routinePct: 52 })).toBe(21);
  });
});

describe("computeAverageScore", () => {
  it("rounds an average of 1.5 up to 2", () => {
    expect(computeAverageScore([1, 2])).toBe(2);
  });
  it("returns 0 for an empty array", () => {
    expect(computeAverageScore([])).toBe(0);
  });

  it("returns the original score for a single-day array", () => {
    expect(computeAverageScore([75])).toBe(75);
  });

  it("calculates the arithmetic mean of daily scores", () => {
    expect(computeAverageScore([40, 60, 80])).toBe(60);
  });

  it("rounds fractional averages to the nearest integer", () => {
    expect(computeAverageScore([50, 51])).toBe(51);
  });

  it("supports a seven-day scoring window", () => {
    expect(computeAverageScore([10, 20, 30, 40, 50, 60, 70])).toBe(40);
  });
});

describe("getProductivityLevel", () => {
  it("defines the expected productivity level thresholds", () => {
    expect(PRODUCTIVITY_LEVELS.map(({ min }) => min)).toEqual([
      0, 25, 75, 150, 300, 500, 1000,
    ]);
  });

  it("starts at level 1 with zero completed items", () => {
    expect(getProductivityLevel(0)).toMatchObject({
      level: 1,
      title: "Getting Started",
      progressToNext: 0,
    });
  });

  it.each([
    [24, 1],
    [25, 2],
    [74, 2],
    [75, 3],
    [149, 3],
    [150, 4],
    [299, 4],
    [300, 5],
    [499, 5],
    [500, 6],
    [999, 6],
    [1000, 7],
  ])("assigns %i completed items to level %i", (completed, expectedLevel) => {
    expect(getProductivityLevel(completed).level).toBe(expectedLevel);
  });

  it("calculates progress toward the next level", () => {
    expect(getProductivityLevel(50)).toMatchObject({
      level: 2,
      progressToNext: 50,
      next: { level: 3, min: 75 },
    });
  });

  it("returns 100 percent progress at the maximum level", () => {
    expect(getProductivityLevel(1000)).toMatchObject({
      level: 7,
      progressToNext: 100,
      next: null,
    });

    expect(getProductivityLevel(1500).level).toBe(7);
  });
});
