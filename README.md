# node-jwt-auth
 
This module lets you authenticate users in your Node applications. The key part it's independent of any kind of framework.

This lib solves the following issues.

1. Provides a simple way for authenticating users which can be used in any framework.
2. Implements a functionality for refreshing tokens when they're expired.
3. It's API as simple as we can later add functionality to this mechanism by ourselves (e.g permissions).

## Install

```
npm install node-jwt-auth
```

## Usage

```js
import 'Auth' from 'node-jwt-auth';

const mapPayloadToUser = async payload => {
  const { id } = payload.user;
  const { User } = models;

  const user = await User.findById(id, { raw: true });

  if (!user) {
    throw new Error();
  }

  return user;
};

const auth = new Auth({
  accessSecret: ACCESS_SECRET,
  refreshSecret: REFRESH_SECRET,
  mapUserToPayload: user => ({ user: { id: user.id } }),
  mapUserToHashed: user => user.password,
  mapPayloadToUser
});

export default auth

```
