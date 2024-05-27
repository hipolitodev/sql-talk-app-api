require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { login } = require('../src/services/auth.service');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token when login is successful', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
    };
    const password = 'password';

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fakeToken');

    const result = await login(mockUser, password);

    expect(result).toBe('fakeToken');
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, isPremium: false },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
  });

  it('should return null when password is incorrect', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
    };
    const password = 'wrongPassword';

    bcrypt.compare.mockResolvedValue(false);

    const result = await login(mockUser, password);

    expect(result).toBe(null);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
  });
});
