import { describe, expect, test } from "@jest/globals";
import { getUser } from "./auth";

describe("getUser", () => {
  test("returns null on invalid headers", () => {
    getUser(undefined).then((user) => {
      expect(user).toBeNull();
    });
    getUser("BearerMissingSpace").then((user) => {
      expect(user).toBeNull();
    });
    getUser("NoBearer").then((user) => {
      expect(user).toBeNull();
    });
    getUser("Bearer ThisIsNotAJWT").then((user) => {
      expect(user).toBeNull();
    });
  });
});
