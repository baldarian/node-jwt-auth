// @flow

import Auth from '../lib';

const testUser = {
  id: 1,
  username: 'john_doe',
  password: 'some_password'
};

const config = {
  accessSecret: 'some_access_secret',
  refreshSecret: 'some_refresh_secret',
  mapPayloadToUser: payload =>
    Promise.resolve({
      ...payload,
      ...testUser
    }),
  mapUserToPayload: user => ({ user: { id: user.id } }),
  mapUserToHashed: user => user.password
};

const setup = (customConfig: any = {}) => {
  const auth = new Auth({ ...config, ...customConfig });
  const accessToken = auth.generateAccessToken(testUser);
  const refreshToken = auth.generateRefreshToken(testUser);

  return {
    auth,
    accessToken,
    refreshToken
  };
};

describe('node-jwt-auth', () => {
  describe('generateRefreshToken', () => {
    it('should generate an access token', () => {
      const { accessToken } = setup();
      expect(typeof accessToken).toBe('string');
    });
  });

  describe('generateAccessToken', () => {
    it('should generate refresh token', () => {
      const { refreshToken } = setup();
      expect(typeof refreshToken).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    it('should reject if token is wrong', () => {
      const { auth } = setup();
      expect(auth.verifyAccessToken('wrong_token')).rejects.toThrow();
    });

    it('should reject if user is not found with given payload', () => {
      const { auth, accessToken } = setup({
        mapPayloadToUser: () => Promise.reject()
      });

      expect(auth.verifyAccessToken(accessToken)).rejects.toThrow();
    });

    it('should verify token and return the payload', async () => {
      const { auth, accessToken } = setup();

      const payload = await auth.verifyAccessToken(accessToken);

      expect(payload).toMatchObject(config.mapUserToPayload(testUser));
    });
  });

  describe('refreshAccessToken', () => {
    it('should instantly reject if refresh token is invalid', () => {
      const { auth } = setup();

      expect(auth.refreshAccessToken('wrong_token')).rejects.toThrow();
    });

    it('should successfully return a new access token', async () => {
      const { auth, refreshToken } = setup();
      const newToken = await auth.refreshAccessToken(refreshToken);

      expect(typeof newToken).toBe('string');
    });
  });
});
