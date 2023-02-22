// API Types
export type SessionPostResponse = {
  success: boolean;
  id: number;
};

export type SessionGetResponse = {
  id: number;
  target: number;
  board: string;
  colors: string;
};

export type SessionPutRequest = {
  board: string;
};

export type SessionPutResponse = {
  success: boolean;
  id: number;
  complete: boolean;
  won: boolean;
  message: string;
  board: string;
  colors: string;
};

export type LeaderboardGetResponse = {
  leaderboard: {
    owner: string;
    count: number;
  }[];
};

// Misc Types
export type GuessBounds = {
  start: number;
  end: number;
};

export enum GameState {
  IN_PROGRESS = "IN_PROGRESS",
  LOST = "LOST",
  WON = "WON",
}
