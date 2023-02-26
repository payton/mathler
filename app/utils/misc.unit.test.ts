import { describe, expect, test } from "@jest/globals";
import { replaceChar } from "./misc";

describe("replaceChar", () => {
  test("standard replacements", () => {
    expect(replaceChar("1234567890", 0, "a")).toBe("a234567890");
    expect(replaceChar("1234567890", 9, "a")).toBe("123456789a");
    expect(replaceChar("1234567890", 4, "a")).toBe("1234a67890");
  });
});
