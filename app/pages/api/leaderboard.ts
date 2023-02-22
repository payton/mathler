import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { LeaderboardGetResponse } from "../../utils/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const topPlayers = await prisma.session.groupBy({
      by: ["owner"],
      _count: {
        owner: true,
        _all: true,
      },
      where: {
        complete: true,
        won: true,
      },
      orderBy: {
        _count: {
          won: "desc",
        },
      },
      take: 10,
    });
    // Return top 10 players based on win count and irregardless of game ID
    const response: LeaderboardGetResponse = {
      leaderboard: topPlayers.map((player) => {
        return {
          owner: player.owner,
          count: player._count.owner,
        };
      }),
    };
    res.status(201).json(response);
  } else {
    res.status(400).json({ message: "Bad request." });
  }
}
