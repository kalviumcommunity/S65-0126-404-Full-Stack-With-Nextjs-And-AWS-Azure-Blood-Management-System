/**
 * @jest-environment node
 */
import request from 'supertest';
import { createTestServer } from '../utils/testServer';
import { prismaMock } from '../utils/prismaMock';
import * as UserHandlers from '@/app/api/users/route';

const app = createTestServer(UserHandlers);

describe('Integration — /api/users', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET Method', () => {
        it('returns a 401 Unauthorized if the Bearer token is missing', async () => {
            const response = await request(app).get('/api/users');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: 'Unauthorized token missing',
            });
        });

        it('returns a 200 JSON listing of users mapped out from Prisma', async () => {
            const fakeUsers: any[] = [
                { id: '1', email: 'alice@blood.org', role: 'USER' },
                { id: '2', email: 'bob@blood.org', role: 'ADMIN' },
            ];
            prismaMock.user.findMany.mockResolvedValue(fakeUsers);

            const response = await request(app)
                .get('/api/users?limit=5')
                .set('Authorization', 'Bearer valid-jwt-token');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.users).toHaveLength(2);
            expect(response.body.users[0].email).toBe('alice@blood.org');

            expect(prismaMock.user.findMany).toHaveBeenCalledWith({
                take: 5,
                select: { id: true, email: true, role: true },
            });
        });
    });

    describe('POST Method', () => {
        it('returns a 400 Bad Request if the Zod schema payload lacks required fields', async () => {
            const payload = { email: 'invalid-email' };

            const response = await request(app)
                .post('/api/users')
                .send(payload)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('Validation failed');
            expect(response.body.details).toBeDefined();
        });

        it('returns a 201 Created Status mapping new insertion metrics to the mocked database', async () => {
            const validPayload = {
                email: 'jane@blood.org',
                password: 'secure-password-123',
            };

            const mockedNewUser: any = { id: 'usr-999', ...validPayload };
            prismaMock.user.create.mockResolvedValue(mockedNewUser);

            const response = await request(app)
                .post('/api/users')
                .send(validPayload)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.id).toBe('usr-999');

            expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: validPayload,
            });
        });
    });

});
