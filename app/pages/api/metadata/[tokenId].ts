import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        const game = await prisma.game.create({
            data: {
                answer: '62/2*7'
            }
        });

        res.status(201).json({ message: 'Game created.', data: game });
    }

    res.status(404).json({ message: 'Page not found.' });
}