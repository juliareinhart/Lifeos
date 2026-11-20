import { describe, it, expect } from "vitest";

describe("CI failure detection verification", () => {
  it("intentionally fails to confirm CI reports test failures", () => {
    expect(1).toBe(2);
  });
});
