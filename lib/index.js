'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Auth = function Auth(config) {
  _classCallCheck(this, Auth);

  _initialiseProps.call(this);

  if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object') {
    throw new Error('provide a config object');
  }

  var accessSecret = config.accessSecret,
      refreshSecret = config.refreshSecret,
      mapPayloadToUser = config.mapPayloadToUser,
      mapUserToPayload = config.mapUserToPayload,
      mapUserToHashed = config.mapUserToHashed;


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
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.generateAccessToken = function (user) {
    var _config = _this.config,
        accessSecret = _config.accessSecret,
        mapUserToPayload = _config.mapUserToPayload,
        accessSingingOptions = _config.accessSingingOptions;


    var payload = mapUserToPayload(user);

    return _jsonwebtoken2.default.sign(payload, accessSecret, _extends({
      expiresIn: '1m'
    }, accessSingingOptions || {}));
  };

  this.generateRefreshToken = function (user) {
    var _config2 = _this.config,
        refreshSecret = _config2.refreshSecret,
        mapUserToHashed = _config2.mapUserToHashed,
        mapUserToPayload = _config2.mapUserToPayload,
        refreshSingingOptions = _config2.refreshSingingOptions;


    var payload = mapUserToPayload(user);
    var secret = refreshSecret + mapUserToHashed(user);

    return _jsonwebtoken2.default.sign(payload, secret, _extends({
      expiresIn: '7d'
    }, refreshSingingOptions || {}));
  };

  this.verifyAccessToken = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(accessToken) {
      var _config3, accessSecret, mapPayloadToUser, _payload;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _config3 = _this.config, accessSecret = _config3.accessSecret, mapPayloadToUser = _config3.mapPayloadToUser;
              _context.prev = 1;
              _payload = _jsonwebtoken2.default.verify(accessToken, accessSecret);
              _context.next = 5;
              return mapPayloadToUser(_payload);

            case 5:
              return _context.abrupt('return', _payload);

            case 8:
              _context.prev = 8;
              _context.t0 = _context['catch'](1);
              throw new Error('Access token is invalid');

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[1, 8]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();

  this.refreshAccessToken = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(refreshToken) {
      var _config4, _mapUserToHashed, _mapPayloadToUser, _refreshSecret, _payload2, _user, secret;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _config4 = _this.config, _mapUserToHashed = _config4.mapUserToHashed, _mapPayloadToUser = _config4.mapPayloadToUser, _refreshSecret = _config4.refreshSecret;
              _payload2 = _jsonwebtoken2.default.decode(refreshToken);
              _context2.next = 5;
              return _mapPayloadToUser(_payload2);

            case 5:
              _user = _context2.sent;
              secret = _refreshSecret + _mapUserToHashed(_user);


              _jsonwebtoken2.default.verify(refreshToken, secret);

              return _context2.abrupt('return', _this.generateAccessToken(_user));

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2['catch'](0);
              throw new Error('Refresh token is invalid');

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this, [[0, 11]]);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};

exports.default = Auth;