jest.doMock('../src/configs/db.config', () => ({
    query: jest.fn(),
}));

const usersService = require('../src/services/users.service');
const pool = require('../src/configs/db.config');

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('creates a user', async () => {
        const user = {
            username: 'testUser',
            name: 'Test User',
            email: 'test@example.com',
            password: 'testPassword',
        };

        pool.query.mockResolvedValue({
            rows: [
                {
                    ...user,
                    password: 'hashedPassword',
                },
            ],
        });

        const result = await usersService.create(user);

        expect(result).toEqual({
            username: 'testUser',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
        });

        expect(pool.query).toHaveBeenCalled();
    });
});