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

### Auth(config)
We need to use this class to initialize an auth object using which we can authenticate users.

`options`:

* `accessSecret`: string which is used to sign/verify access tokens
* `refreshSecret`:  string which is used to sign/verify refresh tokens
* `mapUserToPayload`: function which receives the user as an argument and returns a payload which then can be signed as token
* `mapUserToHashed`: function which receives the user as an argument and returns password
* `mapPayloadToUser`: function

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
