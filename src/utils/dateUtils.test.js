import { describe, it, expect } from "vitest";
import {
  addDays,
  startOfWeek,
  startOfMonth,
  daysInMonth,
  lastNDays,
} from "./dateUtils.js";

describe("addDays", () => {
  it("advances from December 31 to January 1", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("moves backward from January 1 to December 31", () => {
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });

  it("advances from February 28 to February 29 in a leap year", () => {
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
  });

  it("advances from February 29 to March 1 in a leap year", () => {
    expect(addDays("2024-02-29", 1)).toBe("2024-03-01");
  });

  it("advances from February 28 to March 1 in a non-leap year", () => {
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
  });
});

describe("startOfWeek", () => {
  it("uses Sunday as the first day of the week", () => {
    expect(startOfWeek("2026-11-11")).toBe("2026-11-08");
  });

  it("returns the same date when the input is Sunday", () => {
    expect(startOfWeek("2026-11-08")).toBe("2026-11-08");
  });

  it("handles a Sunday-based week that crosses a year boundary", () => {
    expect(startOfWeek("2027-01-01")).toBe("2026-12-27");
  });
});

describe("startOfMonth", () => {
  it("returns the first day of the specified month", () => {
    expect(startOfMonth("2026-11-17")).toBe("2026-11-01");
  });
});

describe("daysInMonth", () => {
  it("returns 29 days for February in a leap year", () => {
    expect(daysInMonth(2024, 1)).toBe(29);
  });

  it("returns 28 days for February in a non-leap year", () => {
    expect(daysInMonth(2026, 1)).toBe(28);
  });
});

describe("lastNDays", () => {
  it("returns chronological dates across a year boundary", () => {
    expect(lastNDays(3, "2027-01-01")).toEqual([
      "2026-12-30",
      "2026-12-31",
      "2027-01-01",
    ]);
  });

  it("returns chronological dates across February 29", () => {
    expect(lastNDays(3, "2024-03-01")).toEqual([
      "2024-02-28",
      "2024-02-29",
      "2024-03-01",
    ]);
  });
});
