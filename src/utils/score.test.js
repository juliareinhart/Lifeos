import { describe, it, expect } from "vitest";
import { computeDailyScore } from "./score.js";

describe("computeDailyScore", () => {
  it("returns 0 when all productivity inputs are zero", () => {
    const result = computeDailyScore({
      routinePct: 0,
      habitPct: 0,
      roadmapDoneToday: 0,
      pomodoroToday: 0,
    });

    expect(result).toBe(0);
  });
});
