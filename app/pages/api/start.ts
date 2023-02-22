import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { StartPostResponse } from "../../utils/types";
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
  console.log(user);

  if (req.method === "POST") {
    const existingSession = await prisma.session.findFirst({
      where: {
        owner: user.info.walletPublicKey,
        complete: false,
      },
    });

    if (existingSession) {
      const response: StartPostResponse = {
        success: false,
        id: existingSession.id,
      };

      res.status(200).json(response);
      return;
    }

    const session = await prisma.session.create({
      data: {
        gameId: 1,
        owner: user.info.walletPublicKey,
      },
    });

    const response: StartPostResponse = {
      success: true,
      id: session.id,
    };

    res.status(201).json(response);
  } else {
    res.status(400).json({ message: "Bad request." });
  }
}
