import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { SessionPostResponse } from "../../utils/types";
import { getUser } from "../../utils/auth";

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

  if (req.method === "POST") {
    const existingSession = await prisma.session.findFirst({
      where: {
        owner: user.info.walletPublicKey,
        complete: false,
      },
    });

    if (existingSession) {
      // Return existing session
      const response: SessionPostResponse = {
        success: false,
        id: existingSession.id,
      };

      res.status(200).json(response);
      return;
    }

    const count = await prisma.game.count();

    const game = (await prisma.game.findMany({
      skip: count === 1 ? 0 : Math.floor(Math.random() * count),
    }))[0];

    // Get a random game for this new session
    const session = await prisma.session.create({
      data: {
        gameId: game.id,
        owner: user.info.walletPublicKey,
      },
    });

    const response: SessionPostResponse = {
      success: true,
      id: session.id,
    };

    res.status(201).json(response);
  } else {
    res.status(405).json({ message: "Bad request." });
  }
}
