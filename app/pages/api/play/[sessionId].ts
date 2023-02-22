import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import {
  SessionGetResponse,
  SessionPutRequest,
  SessionPutResponse,
} from "../../../utils/types";
import { getUser } from "../../../utils/auth";
import {
  isValidMove,
  getUpdatedColors,
  getGameState,
} from "../../../utils/game";
import { evaluate } from "mathjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user: any = await getUser(req.headers.authorization);
  if (user === null) {
    res.status(401).json({ message: "Unauthorized." });
    return;
  }

  const { sessionId } = req.query;
  if (!sessionId) {
    res.status(400).json({ message: "Bad request." });
    return;
  }

  const session = await prisma.session.findFirstOrThrow({
    where: {
      id: parseInt(sessionId.toString()),
      owner: user.info.walletPublicKey,
      complete: false,
    },
  });

  // TODO: Handle case if there are multiple games
  const game = await prisma.game.findUniqueOrThrow({
    where: {
      id: session.gameId,
    },
  });

  if (req.method === "GET") {
    const response: SessionGetResponse = {
      id: session.id,
      target: evaluate(game.answer),
      board: session.board,
      colors: session.colors,
    };
    res.status(200).json(response);
  } else if (req.method === "PUT") {
    const body: SessionPutRequest = req.body;
    if (!body.board) {
      res.status(400).json({ message: "Bad request." });
      return;
    }

    const errorMessage = isValidMove(
      body.board,
      session.board,
      evaluate(game.answer)
    );
    if (errorMessage) {
      const response: SessionPutResponse = {
        success: false,
        message: errorMessage,
        complete: false,
        won: false,
        id: session.id,
        board: session.board,
        colors: session.colors,
      };
      res.status(200).json(response);
      return;
    }

    const newColors = getUpdatedColors(body.board, session.colors, game.answer);
    const gameState = getGameState(newColors);

    const updatedSession = await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        board: body.board,
        colors: getUpdatedColors(body.board, session.colors, game.answer),
        complete: gameState === "WON" || gameState === "LOST",
        won: gameState === "WON",
      },
    });

    const response: SessionPutResponse = {
      success: true,
      message: "Success",
      complete: updatedSession.complete,
      won: updatedSession.won,
      id: updatedSession.id,
      board: updatedSession.board,
      colors: updatedSession.colors,
    };
    res.status(200).json(response);
  } else {
    res.status(400).json({ message: "Bad request." });
  }
}
