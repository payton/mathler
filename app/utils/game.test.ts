import { describe, expect, test } from "@jest/globals";
import {
  getLastGuessBounds,
  verifyGuessAgainstTarget,
  validateGuess,
  isValidMove,
  getUpdatedColors,
  isValidBoard,
  getGameState,
} from "./game";
import { GameState } from "./types";

describe("getLastGuessBounds", () => {
  test("identifies new game boundary", () => {
    expect(
      getLastGuessBounds("????????????????????????????????????")
    ).toStrictEqual({ start: 0, end: 0 });
  });

  test("identifies first play game boundary", () => {
    expect(
      getLastGuessBounds("111111??????????????????????????????")
    ).toStrictEqual({ start: 0, end: 6 });
  });

  test("identifies last play game boundary", () => {
    expect(
      getLastGuessBounds("111111111111111111111111111111111111")
    ).toStrictEqual({ start: 30, end: 36 });
  });

  test("identifies middle game boundary", () => {
    expect(
      getLastGuessBounds("111111111111111111??????????????????")
    ).toStrictEqual({ start: 12, end: 18 });
  });
});

describe("verifyGuessAgainstTarget", () => {
  test("identifies correct guess", () => {
    expect(verifyGuessAgainstTarget("1+1", 2)).toBe(true);
    expect(verifyGuessAgainstTarget("1-1", 0)).toBe(true);
    expect(verifyGuessAgainstTarget("1*1", 1)).toBe(true);
    expect(verifyGuessAgainstTarget("1/1", 1)).toBe(true);

    expect(verifyGuessAgainstTarget("4*3/2+1", 7)).toBe(true);
    expect(verifyGuessAgainstTarget("3*1/4+3", 3.75)).toBe(true);
  });

  test("identifies incorrect guess", () => {
    expect(verifyGuessAgainstTarget("1+1", 10)).toBe(false);
    expect(verifyGuessAgainstTarget("1-1", 10)).toBe(false);
    expect(verifyGuessAgainstTarget("1*1", 10)).toBe(false);
    expect(verifyGuessAgainstTarget("1/1", 10)).toBe(false);

    expect(verifyGuessAgainstTarget("4*3/2+1", 10)).toBe(false);
    expect(verifyGuessAgainstTarget("3*1/4+3", 10)).toBe(false);
  });
});

describe("validateGuess", () => {
  test("identifies valid guesses", () => {
    expect(validateGuess("1+1")).toBe(true);
    expect(validateGuess("1-1")).toBe(true);
    expect(validateGuess("1*1")).toBe(true);
    expect(validateGuess("1/1")).toBe(true);

    expect(validateGuess("4*3/2+1")).toBe(true);
    expect(validateGuess("3*1/4+3")).toBe(true);

    expect(validateGuess("1/1/10")).toBe(true);
    expect(validateGuess("1-1-10")).toBe(true);
  });

  test("fails on trailing operators", () => {
    expect(validateGuess("/1/")).toBe(false);
    expect(validateGuess("*1*")).toBe(false);
    expect(validateGuess("+1+")).toBe(false);
    expect(validateGuess("-1-")).toBe(false);
  });

  test("fails on invalid characters", () => {
    expect(validateGuess("a")).toBe(false);
    expect(validateGuess("^")).toBe(false);
    expect(validateGuess("")).toBe(false);
    expect(validateGuess("1/(1-10)")).toBe(false);
  });

  test("fails on subsequent operators", () => {
    expect(validateGuess("1//1")).toBe(false);
    expect(validateGuess("1**1")).toBe(false);
    expect(validateGuess("1++1")).toBe(false);
    expect(validateGuess("1--1")).toBe(false);

    expect(validateGuess("1+++1")).toBe(false);
  });
});

describe("getUpdatedColors", () => {
  test("all no-op", () => {
    const newBoard = "????????????????????????????????????";
    const oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    const answer = "1/2+10";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
    );
  });

  test("no-op on premature color progression", () => {
    const newBoard = "??????????????????????????????1/1210";
    const oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    const answer = "7/32/2";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
    );
  });

  test("all incorrect guesses", () => {
    const newBoard = "777777??????????????????????????????";
    const oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    const answer = "1/2+10";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "RRRRRRWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
    );
  });

  test("all misplaced guesses", () => {
    const newBoard = "2+10/1??????????????????????????????";
    const oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    const answer = "1/2+10";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "YYYYYYWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
    );
  });

  test("all correct guesses", () => {
    const newBoard = "1/2+10??????????????????????????????";
    const oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    const answer = "1/2+10";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "GGGGGGWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
    );
  });

  test("de-duplicates misplaced guesses with FIFO", () => {
    const newBoard = "1/1210??????????????????????????????";
    const oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    const answer = "7/32/2";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "RGRGRRWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
    );
  });

  test("mix of incorrect, misplaced, and correct guesses", () => {
    const newBoard = "7/1/10??????????????????????????????";
    const oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    const answer = "72/2/2";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "GYRYRRWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
    );
  });

  test("complex case correctness in middle of board", () => {
    let newBoard = "11111111111111117/1/10??????????????";
    let oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    let answer = "72/2/2";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "WWWWWWWWWWWWWWWWGYRYRRWWWWWWWWWWWWWW"
    );

    newBoard = "11111111111111117/1/10??????????????";
    oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    answer = "72/2/2";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "WWWWWWWWWWWWWWWWGYRYRRWWWWWWWWWWWWWW"
    );
  });

  test("complex case correctness at end of board", () => {
    let newBoard = "1111111111111111111111111111117/1/10";
    let oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    let answer = "72/2/2";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWGYRYRR"
    );

    newBoard = "1111111111111111111111111111117/1/10";
    oldColors = "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW";
    answer = "72/2/2";
    expect(getUpdatedColors(newBoard, oldColors, answer)).toBe(
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWGYRYRR"
    );
  });
});

describe("isValidBoard", () => {
  test("incorrect board size", () => {
    expect(isValidBoard("?????????????????")).toBe(false);
  });

  test("premature modification", () => {
    expect(isValidBoard("?????????????????????????z??????????")).toBe(false);
    expect(isValidBoard("??????????????111111????????????????")).toBe(false);
    expect(isValidBoard("??????????????????????????????12/3*5")).toBe(false);
  });

  test("bad operator placement", () => {
    expect(isValidBoard("1//2*4??????????????????????????????")).toBe(false);
    expect(isValidBoard("1/2*4+??????????????????????????????")).toBe(false);
    expect(isValidBoard("*1/243??????????????????????????????")).toBe(false);
  });

  test("valid modification", () => {
    expect(isValidBoard("111111??????????????????????????????")).toBe(true);
    expect(isValidBoard("111111111111111111111111????????????")).toBe(true);
    expect(isValidBoard("111111111111111111111111111111111111")).toBe(true);
    expect(isValidBoard("1/2*451/2*45/23?????????????????????")).toBe(true);
  });
});

describe("isValidMove", () => {
  test("corrupt board manipulation is rejected", () => {
    expect(
      isValidMove(
        "?????????????????",
        "????????????????????????????????????",
        10
      )
    ).not.toBeUndefined();
    expect(
      isValidMove(
        "?????????????????????????z??????????",
        "????????????????????????????????????",
        10
      )
    ).not.toBeUndefined();
    expect(
      isValidMove(
        "??????????????111111????????????????",
        "????????????????????????????????????",
        10
      )
    ).not.toBeUndefined();
    expect(
      isValidMove(
        "111111111111111?????????????????????",
        "111111111111????????????????????????",
        10
      )
    ).not.toBeUndefined();
  });

  test("no-op board submission is rejected", () => {
    expect(
      isValidMove(
        "????????????????????????????????????",
        "????????????????????????????????????",
        10
      )
    ).not.toBeUndefined();
  });
});

describe("getGameState", () => {
  test("in progress", () => {
    expect(getGameState("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")).toBe(GameState.IN_PROGRESS);
    expect(getGameState("RGRGRGWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")).toBe(GameState.IN_PROGRESS);
    expect(getGameState("RRRRRRRRRRRRWWWWWWWWWWWWWWWWWWWWWWWW")).toBe(GameState.IN_PROGRESS);
    expect(getGameState("RRRRRRYYYYYYWWWWWWWWWWWWWWWWWWWWWWWW")).toBe(GameState.IN_PROGRESS);
  });

  test("won", () => {
    expect(getGameState("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGGGGGG")).toBe(GameState.WON);
    expect(getGameState("YYYYYYYYYYYYGGGGGGWWWWWWWWWWWWWWWWWW")).toBe(GameState.WON);
    expect(getGameState("GGGGGGWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW")).toBe(GameState.WON);
    expect(getGameState("RGRGYRGGGGGGWWWWWWWWWWWWWWWWWWWWWWWW")).toBe(GameState.WON);
  });

  test("lost", () => {
    expect(getGameState("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")).toBe(GameState.LOST);
    expect(getGameState("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")).toBe(GameState.LOST);
    expect(getGameState("RGYRGYRGYRGYRGYRGYRGYRGYRGYRGYRGYRGY")).toBe(GameState.LOST);
    expect(getGameState("GGYYGGYYGGYYGGGYYYGGGYYYGGGYYYGRYGYY")).toBe(GameState.LOST);
  });
});