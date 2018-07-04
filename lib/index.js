// @flow

import jwt from 'jsonwebtoken';
import type { SigningOptions } from 'jsonwebtoken';

type Payload = Object;
type User = Object;
type Token = string;

export type Config = {
  accessSecret: string,
  refreshSecret: string,
  mapPayloadToUser: (payload: Payload) => Promise<User>,
  mapUserToPayload: (user: User) => Payload,
  mapUserToHashed: (user: User) => string,
  accessSingingOptions?: SigningOptions<{}>,
  refreshSingingOptions?: SigningOptions<{}>
};

class Auth {
  config: Config;

  constructor(config: Config) {
    if (typeof config !== 'object') {
      throw new Error('provide a config object');
    }

    const {
      accessSecret,
      refreshSecret,
      mapPayloadToUser,
      mapUserToPayload,
      mapUserToHashed
    } = config;

    if (typeof accessSecret !== 'string') {
      throw new Error('Access Secret should be a valid string');
    }

    if (typeof refreshSecret !== 'string') {
      throw new Error('Refresh Secret should be a valid string');
    }

    if (typeof mapPayloadToUser !== 'function') {
      throw new Error('mapPayloadToUser should be a valid function');
    }

    if (typeof mapUserToPayload !== 'function') {
      throw new Error('mapUserToPayload should be a valid function');
    }

    if (typeof mapUserToHashed !== 'function') {
      throw new Error('mapUserToHashed should be a valid function');
    }

    this.config = config;
  }

  generateAccessToken = (user: User): Token => {
    const {
      accessSecret,
      mapUserToPayload,
      accessSingingOptions
    } = this.config;

    const payload = mapUserToPayload(user);

    return jwt.sign(payload, accessSecret, {
      expiresIn: '1m',
      ...(accessSingingOptions || {})
    });
  };

  generateRefreshToken = (user: User): Token => {
    const {
      refreshSecret,
      mapUserToHashed,
      mapUserToPayload,
      refreshSingingOptions
    } = this.config;

    const payload = mapUserToPayload(user);
    const secret = refreshSecret + mapUserToHashed(payload);

    return jwt.sign(payload, secret, {
      expiresIn: '7d',
      ...(refreshSingingOptions || {})
    });
  };

  verifyAccessToken = async (accessToken: string): Promise<Payload> => {
    const { accessSecret, mapPayloadToUser } = this.config;

    try {
      const payload = jwt.verify(accessToken, accessSecret);

      await mapPayloadToUser(payload);

      return payload;
    } catch (e) {
      throw new Error('Access token is invalid');
    }
  };

  refreshAccessToken = async (refreshToken: string): Promise<Token> => {
    try {
      const { mapUserToHashed, mapPayloadToUser, refreshSecret } = this.config;

      const payload = jwt.decode(refreshToken);

      const user = await mapPayloadToUser(payload);

      const secret = refreshSecret + mapUserToHashed(user);

      jwt.verify(refreshToken, secret);

      return this.generateAccessToken(user);
    } catch (e) {
      throw new Error('Refresh token is invalid');
    }
  };
}

export default Auth;
