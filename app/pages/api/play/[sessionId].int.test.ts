import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import play from './[sessionId]';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();


jest.mock('../../../utils/auth', () => ({
    getUser: (authorizationHeader: string | undefined) => {
        return {
            iss: authorizationHeader,
            info: {
                walletPublicKey: '0x0'
            }
        };
    }
}));


describe('/api/play/:sessionId API Endpoint', () => {

    let gameId = 1;
    let sessionId = 1;

    function mockRequestResponse(method: RequestMethod = 'GET', sessionIdOverride: string | undefined = undefined) {
        const {
            req,
            res,
        }: { req: NextApiRequest; res: NextApiResponse } = createMocks({ method });
        req.headers = {
            'Content-Type': 'application/json',
        };
        req.query = {
            sessionId: sessionIdOverride || sessionId.toString(),
        }
        return { req, res };
    }

    beforeEach(async () => {
        await client.session.deleteMany({});
        await client.game.deleteMany({});
        const game = await client.game.create({
            data: {
                answer: '119-41'
            },
        })
        gameId = game.id;
        const session = await client.session.create({
            data: {
                gameId: gameId,
                owner: `0x0`,
                complete: false,
                won: false,
            }
        });
        sessionId = session.id;
        await new Promise(process.nextTick);
    });

    it('should 400 if a non-existent sessionId is assigned', async () => {
        const { req, res } = mockRequestResponse('PUT', "-1");
        await play(req, res);
        expect(res.statusCode).toBe(400);
    });

    it('should succeed on a winning submission', async () => {
        const { req, res } = mockRequestResponse('PUT');
        req.body = {
            board: "119-41??????????????????????????????"
        }
        await play(req, res);
        expect(res.statusCode).toBe(200);

        const resBody = res._getJSONData();
        expect(resBody.success).toBe(true);
        expect(resBody.complete).toBe(true);
        expect(resBody.won).toBe(true);
        expect(resBody.board).toBe("119-41??????????????????????????????");
        expect(resBody.colors).toBe("GGGGGGWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
    });

    it('should accept partially correct answers', async () => {
        const { req, res } = mockRequestResponse('PUT');
        req.body = {
            board: "120-42??????????????????????????????"
        }
        await play(req, res);
        expect(res.statusCode).toBe(200);

        const resBody = res._getJSONData();
        expect(resBody.success).toBe(true);
        expect(resBody.complete).toBe(false);
        expect(resBody.won).toBe(false);
        expect(resBody.board).toBe("120-42??????????????????????????????");
        expect(resBody.colors).toBe("GRRGGRWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
    });

    it('should accept incorrect answers that sum to target', async () => {
        const { req, res } = mockRequestResponse('PUT');
        req.body = {
            board: "0+0+78??????????????????????????????"
        }
        await play(req, res);
        expect(res.statusCode).toBe(200);

        const resBody = res._getJSONData();
        expect(resBody.success).toBe(true);
        expect(resBody.complete).toBe(false);
        expect(resBody.won).toBe(false);
        expect(resBody.board).toBe("0+0+78??????????????????????????????");
        expect(resBody.colors).toBe("RRRRRRWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
    });

    it('should end game without winning status', async () => {
        let { req, res } = mockRequestResponse('PUT');

        req.body = {
            board: "0+0+78??????????????????????????????"
        }
        await play(req, res);
        req.body = {
            board: "0+0+780+0+78????????????????????????"
        }
        await play(req, res);
        req.body = {
            board: "0+0+780+0+780+0+78??????????????????"
        }
        await play(req, res);
        req.body = {
            board: "0+0+780+0+780+0+780+0+78????????????"
        }
        await play(req, res);
        req.body = {
            board: "0+0+780+0+780+0+780+0+780+0+78??????"
        }
        await play(req, res);

        let { req: reqFinal, res: resFinal } = mockRequestResponse('PUT');
        reqFinal.body = {
            board: "0+0+780+0+780+0+780+0+780+0+780+0+78"
        }
        await play(reqFinal, resFinal);
        const resBody = resFinal._getJSONData();
        expect(resBody.success).toBe(true);
        expect(resBody.complete).toBe(true);
        expect(resBody.won).toBe(false);
        expect(resBody.board).toBe("0+0+780+0+780+0+780+0+780+0+780+0+78");
        expect(resBody.colors).toBe("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
    });

    it('should end game with winning status', async () => {
        let { req, res } = mockRequestResponse('PUT');

        req.body = {
            board: "0+0+78??????????????????????????????"
        }
        await play(req, res);
        req.body = {
            board: "0+0+780+0+78????????????????????????"
        }
        await play(req, res);
        req.body = {
            board: "0+0+780+0+780+0+78??????????????????"
        }
        await play(req, res);
        req.body = {
            board: "0+0+780+0+780+0+780+0+78????????????"
        }
        await play(req, res);
        req.body = {
            board: "0+0+780+0+780+0+780+0+780+0+78??????"
        }
        await play(req, res);

        let { req: reqFinal, res: resFinal } = mockRequestResponse('PUT');
        reqFinal.body = {
            board: "0+0+780+0+780+0+780+0+780+0+78119-41"
        }
        await play(reqFinal, resFinal);
        const resBody = resFinal._getJSONData();
        expect(resBody.success).toBe(true);
        expect(resBody.complete).toBe(true);
        expect(resBody.won).toBe(true);
        expect(resBody.board).toBe("0+0+780+0+780+0+780+0+780+0+78119-41");
        expect(resBody.colors).toBe("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRGGGGGG");
    });

    it('should soft fail on invalid board', async () => {
        const { req, res } = mockRequestResponse('PUT');
        req.body = {
            board: "119-4???????????????????????????????"
        }
        await play(req, res);
        expect(res.statusCode).toBe(200);
        const resBody = res._getJSONData();
        expect(resBody.success).toBe(false);
    });

    it('should return the active game', async () => {
        const { req, res } = mockRequestResponse('GET');
        await play(req, res);
        expect(res.statusCode).toBe(200);
        const resBody = res._getJSONData();
        expect(resBody.colors).toBe("WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
        expect(resBody.board).toBe("????????????????????????????????????");
        expect(resBody.target).toBe(78);
    });

    it('should 400 if no session ID is present', async () => {
        const { req, res } = mockRequestResponse('PUT');
        req.query = {};
        await play(req, res);
        expect(res.statusCode).toBe(400);
    });

    it('should 400 if no board is present', async () => {
        const { req, res } = mockRequestResponse('PUT');
        await play(req, res);
        expect(res.statusCode).toBe(400);
    });

    it('should 405 on POST requests', async () => {
        const { req, res } = mockRequestResponse('POST');
        await play(req, res);
        expect(res.statusCode).toBe(405);
    });

    it('should 405 on DELETE requests', async () => {
        const { req, res } = mockRequestResponse('DELETE');
        await play(req, res);
        expect(res.statusCode).toBe(405);
    });
});