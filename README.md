# node-jwt-auth
 
This module lets you authenticate users in your Node applications.

This lib aims to solve the following points.

1. Provide a simple way for authenticating users which can be used in any kind of Node framework.
2. Provide a way for refreshing tokens when access token is expired.
3. Invalidate refresh token when user's password is changed. This way we can be confident that when password is changed all logged in devices will stay logged in as long as their access token hasn't been expired.

## Install

```
npm install node-jwt-auth
```

## Usage

This module represents a single class which is exported as default.

```js
import 'Auth' from 'node-jwt-auth';
```

### new Auth(config)
We need to use this class to initialize an auth object using which we can authenticate users.

`config`:

* `accessSecret`: string that will be used to sign/verify access tokens
* `refreshSecret`:  string that will be used to sign/verify refresh tokens
* `mapUserToPayload`: function which receives the user as an argument and returns a payload which then will be signed as  a token
* `mapUserToHashed`: function which receives the user as an argument and returns password to tie it with the refresh token
* `mapPayloadToUser`: async function that takes the payload as an argument and returns the actual user

```js

const mapPayloadToUser = async payload => {
  // retrieve id from payload
   const { id } = payload.user;

 // fetch the user by using above id
   const user = await findUserSomehow(id);

  // if user is not found throw an error
  if (!user) {
   throw new Error();
  }
  
  // if everything was successful then return the user
  return user;
};

const auth = new Auth({
  accessSecret: ACCESS_SECRET,
  refreshSecret: REFRESH_SECRET,
  mapUserToPayload: user => ({ user: { id: user.id } }),
  mapUserToHashed: user => user.password,
  mapPayloadToUser
});

```

### auth.generateAccessToken(user)
Takes a user as an argument and returns the access token

### auth.generateRefreshToken(user)
Takes a user as an argument and returns the refresh token

### auth.verifyAccessToken(accessToken)
Takes access token as an argument and checks whether it has been expired or not. Returns payload if has not been expired yet, otherwise throws an error

### auth.refreshAccessToken(refreshToken)
Takes refresh token as an argument and returns new access token. This also checks whether the password has been ever changed since the time when the refresh token is generated. If so, refresh token won't pass the verification process and this function will throw an error.
