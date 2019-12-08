/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-07 21:55:20
 * @modify date 2019-12-07 21:55:20
 * @desc Controller for user authentication
 */

import { use as passport__use, authenticate as passport__authenticate } from 'passport';
import {
  Strategy as JwtStrategy,
  StrategyOptions as passport_jwt__StrategyOptions,
  ExtractJwt,
  VerifiedCallback
} from 'passport-jwt';
import { BasicStrategy } from 'passport-http';
import { sign as jwt__sign } from 'jsonwebtoken';
import * as uuidv4 from 'uuid/v4';

import * as UserController from './user.controller';
import * as TokenController from './token.controller';
import { jwt_config } from '@app/configs/jwt.config';
import { MongooseDocumentSchema } from '@app/models/mongoose-db/user.model';

/**
 * Class AuthError
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @class AuthError
 * @extends {Error}
 */
class AuthError extends Error {
  status: number;

  constructor(msg = 'Unauthorized', status = 401) {
    super(msg);
    this.status = status;
  }
}

/**
 * Callback function to be used as argument for `new BasicStrategy()`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @param {string} username
 * @param {string} password_hash
 * @param {(err: any, user?: MongooseDocumentSchema) => void} callback
 */
function callbackPassportBasicStrategy(
  username: string,
  password_hash: string,
  callback: (err: any, user?: MongooseDocumentSchema) => void
): void {
  UserController.findOne({ username, password_hash, is_active: true }, (error: any, user: any) => {
    if (error) {
      return callback(error);
    }

    // No user found with that username
    if (!user) {
      return callback(new AuthError());
    }

    return callback(null, user);
  });
}

/**
 * Callback function to be used as argument for `new JwtStrategy()`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @param {*} jwt_payload
 * @param {VerifiedCallback} callback
 */
function callbackPassportJWTStrategy(jwt_payload: any, callback: VerifiedCallback): void {
  UserController.findOne(
    {
      username: jwt_payload.username,
      is_active: true
    },
    (error: any, user: any) => {
      if (error) {
        return callback(error, false);
      }
      if (user) {
        TokenController.findOne(
          {
            username: jwt_payload.username,
            uuid: jwt_payload.uuid,
            is_active: true
          },
          (errorTokenControllerfindOne, token_record) => {
            if (errorTokenControllerfindOne) {
              return callback(errorTokenControllerfindOne, false);
            }
            if (token_record) {
              if (token_record.uuid === jwt_payload.uuid) {
                const uuid = uuidv4();
                const new_token = jwt__sign({ username: user.username, uuid }, jwt_config.token_secret, {
                  expiresIn: jwt_config.token_life
                });
                TokenController.update(
                  token_record._id,
                  {
                    token: new_token,
                    uuid
                  },
                  (errorTokenControllerupdate, new_token_record) => {
                    if (errorTokenControllerupdate) {
                      console.error(errorTokenControllerupdate);
                      return callback(errorTokenControllerupdate, false);
                    } else {
                      user.token = new_token;
                      return callback(null, user);
                    }
                  }
                );
              } else {
                return callback(new AuthError());
              }
            } else {
              return callback(new AuthError());
            }
          }
        );
      } else {
        return callback(new AuthError());
      }
    }
  );
}

// Basic Auth
passport__use(new BasicStrategy(callbackPassportBasicStrategy));

// JWT Based Bearer TokenAuth
const jwt_opts: passport_jwt__StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwt_config.token_secret
};
passport__use(new JwtStrategy(jwt_opts, callbackPassportJWTStrategy));

const isBasicAuthenticated = passport__authenticate('basic', { session: false });
const isJWTAuthenticated = passport__authenticate('jwt', { session: false });

export { isBasicAuthenticated, isJWTAuthenticated };
