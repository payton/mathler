import { Game, Session } from "@prisma/client";
import { evaluate } from "mathjs";
import { GuessBounds, GameState } from "./types";

export function validateGuess(guess: string) {
  try {
    evaluate(guess);
  } catch (e) {
    return false;
  }

  return /^[0-9]([+\/*-]?[0-9])+([+\/*-][0-9])?$/.test(guess);
}

export function verifyGuessAgainstTarget(guess: string, target: number) {
  return evaluate(guess) === target;
}

export function getLastGuessBounds(board: string): GuessBounds {
  const end = board.indexOf("?") == -1 ? board.length : board.indexOf("?");
  const start = end - 6;

  if (end === 0) {
    return {
      start: end,
      end: end,
    };
  }

  return {
    start,
    end,
  };
}

/**
 * Asserts that general board structure is valid outside of the context of the current game.
 * @param board board state to validate
 * @returns true if valid, false otherwise
 */
export function isValidBoard(board: string): boolean {
  return (
    board.length === 36 &&
    /^([0-9]([+\/*-]?[0-9])+([+\/*-][0-9])?)?\?*$/.test(board)
  );
}

/**
 * Checks if new board state is valid compared to the old one. If not, returns an error message to be displayed to the user.
 *
 * @param newBoard proposed board state from player
 * @param oldBoard current board state
 * @param target expression evaluation target
 * @returns undefined if valid, otherwise returns error message to be displayed to user
 */
export function isValidMove(
  newBoard: string,
  oldBoard: string,
  target: number
): string | undefined {
  if (!isValidBoard(newBoard)) {
    return "Invalid guess. Expression must be a valid.";
  }

  const { start, end } = getLastGuessBounds(newBoard);

  // The board is empty
  if (start == end) {
    return "Invalid guess. You must fill in the entire row.";
  }

  // Check that start and end are in bounds and that the new guess is immediately after the last guess
  if (
    start < 0 ||
    end > newBoard.length ||
    (start > 0 && newBoard[start - 1] === "?")
  ) {
    return "Invalid guess. You must fill in the entire row.";
  }

  // Check that the new guess is not overwriting an old guess
  if (oldBoard.substring(start, end) !== "??????") {
    return "Invalid guess. Input overwrites old input.";
  }

  const newGuess = newBoard.substring(start, end);

  if (!validateGuess(newGuess)) {
    return "Expression must be valid. Valid operators are +, -, *, and /.";
  }

  if (!verifyGuessAgainstTarget(newGuess || "", target)) {
    return `Expression must add up to the target number: ${target}.`;
  }

  return undefined;
}

export function getUpdatedColors(
  newBoard: string,
  oldColors: string,
  answer: string
): string {
  const bounds = getLastGuessBounds(newBoard);
  const guess = newBoard.substring(bounds.start, bounds.end);

  let remainingLetters = answer;

  let color = "";
  for (var i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      const idx = remainingLetters.indexOf(guess[i]);
      remainingLetters =
        remainingLetters.substring(0, idx) +
        remainingLetters.substring(idx + 1);
      color += "G";
    } else if (remainingLetters.includes(guess[i])) {
      color += "Y";
    } else {
      color += "R";
    }
  }

  return (
    oldColors.substring(0, bounds.start) +
    color +
    oldColors.substring(bounds.end)
  );
}

export function getGameState(colors: string): GameState {
    const end = colors.indexOf("W") == -1 ? colors.length : colors.indexOf("W");
    const start = end - 6;

    if (start < 0) {
        return GameState.IN_PROGRESS;
    }

    const lastColors = colors.substring(start, end);

    if (lastColors === "GGGGGG") {
        return GameState.WON;
    } else if ((/^(R|Y|G){6}$/).test(colors.substring(colors.length - 6, colors.length))) {
        return GameState.LOST;
    } else {
        return GameState.IN_PROGRESS;
    }
}
