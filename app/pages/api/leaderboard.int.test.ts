import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import leaderboard from './leaderboard';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();


describe('/api/leaderboard API Endpoint', () => {
    function mockRequestResponse(method: RequestMethod = 'GET') {
        const {
            req,
            res,
        }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
        req.headers = {
            'Content-Type': 'application/json',
        };
        req.query = {};
        return { req, res };
    }

    let gameId = 1;

    beforeAll(async () => {
        await client.session.deleteMany({});
        await client.game.deleteMany({});
        const game = await client.game.create({
            data: {
                answer: '119-41'
            },
        })
        gameId = game.id;
    });

    beforeEach(async () => {
        await client.session.deleteMany({});
    })

    it('should aggregate two of three winning sessions', async () => {
        await client.session.createMany({
            data: [
                {
                    gameId: gameId,
                    owner: '0x0',
                    complete: true,
                    won: true,
                },
                {
                    gameId: gameId,
                    owner: '0x0',
                    complete: true,
                    won: true,
                },
                {
                    gameId: gameId,
                    owner: '0x1',
                    complete: true,
                    won: true,
                }
            ],
        })
        const { req, res } = mockRequestResponse();
        await leaderboard(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
        expect(res._getJSONData()).toEqual({
            leaderboard: [
                {
                    owner: '0x0',
                    count: 2,
                },
                {
                    owner: '0x1',
                    count: 1,
                }
            ]
        });
    });

    it('should return the top 10 winners', async () => {
        for (var i = 0; i < 20; i++) {
            for (var j = 0; j < i; j++) {
                await client.session.create({
                    data: {
                        gameId: gameId,
                        owner: `0x${i}`,
                        complete: true,
                        won: true,
                    }
                });
            }
        }
        const { req, res } = mockRequestResponse();
        await leaderboard(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
        expect(res._getJSONData()).toEqual({
            leaderboard: [
                {
                    owner: '0x19',
                    count: 19,
                },
                {
                    owner: '0x18',
                    count: 18,
                },
                {
                    owner: '0x17',
                    count: 17,
                },
                {
                    owner: '0x16',
                    count: 16,
                },
                {
                    owner: '0x15',
                    count: 15,
                },
                {
                    owner: '0x14',
                    count: 14,
                },
                {
                    owner: '0x13',
                    count: 13,
                },
                {
                    owner: '0x12',
                    count: 12,
                },
                {
                    owner: '0x11',
                    count: 11,
                },
                {
                    owner: '0x10',
                    count: 10,
                }
            ]
        });
    });

    it('should return an empty leaderboard when there are no sesions', async () => {
        const { req, res } = mockRequestResponse();
        await leaderboard(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.getHeaders()).toEqual({ 'content-type': 'application/json' });
        expect(res._getJSONData()).toEqual({
            leaderboard: []
        });
    });

    it('should 400 on POST requests', async () => {
        const { req, res } = mockRequestResponse('POST');
        await leaderboard(req, res);
        expect(res.statusCode).toBe(400);
    });

    it('should 400 on PUT requests', async () => {
        const { req, res } = mockRequestResponse('PUT');
        await leaderboard(req, res);
        expect(res.statusCode).toBe(400);
    });

    it('should 400 on DELETE requests', async () => {
        const { req, res } = mockRequestResponse('DELETE');
        await leaderboard(req, res);
        expect(res.statusCode).toBe(400);
    });
});