import { createMocks, RequestMethod } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import play from './play';
import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();


jest.mock('../../utils/auth', () => ({
    getUser: (authorizationHeader: string | undefined) => {
        return {
            iss: authorizationHeader,
            info: {
                walletPublicKey: '0x0'
            }
        };
    }
}));


describe('/api/play API Endpoint', () => {
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
                id: 1,
                answer: '119-41'
            },
        })
        gameId = game.id;
    });

    beforeEach(async () => {
        await client.session.deleteMany({});
    })

    it('should not create a new session if one exists', async () => {
        const session = await client.session.create({
            data: {
                gameId: gameId,
                owner: `0x0`,
                complete: false,
                won: false,
            }
        });
        const { req, res } = mockRequestResponse('POST');
        await play(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            success: false,
            id: session.id,
        });
    });

    it('should create a new session if one does not exist', async () => {
        const { req, res } = mockRequestResponse('POST');
        await play(req, res);
        const session = await client.session.findFirst({
            where: {
                owner: '0x0',
                complete: false,
            }
        });
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({
            success: true,
            id: session !== null ? session.id : -1,
        });
    });

    it('should 400 on GET requests', async () => {
        const { req, res } = mockRequestResponse('GET');
        await play(req, res);
        expect(res.statusCode).toBe(400);
    });

    it('should 400 on PUT requests', async () => {
        const { req, res } = mockRequestResponse('PUT');
        await play(req, res);
        expect(res.statusCode).toBe(400);
    });

    it('should 400 on DELETE requests', async () => {
        const { req, res } = mockRequestResponse('DELETE');
        await play(req, res);
        expect(res.statusCode).toBe(400);
    });
});