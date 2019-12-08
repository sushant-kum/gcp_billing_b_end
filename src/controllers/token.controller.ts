/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-07 22:58:23
 * @modify date 2019-12-07 22:58:23
 * @desc Controller for operations on Token(s)
 */

import { Document } from 'mongoose';
import * as Token from '@app/models/mongoose-db/token.model';

/**
 * Find one token with given `query`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {*} query
 * @param {((err: any, token?: Token.MongooseDocumentSchema | null) => void)} callback
 */
export function findOne(query: any, callback: (err: any, token?: Token.MongooseDocumentSchema | null) => void): void {
  Token.Model.findOne(query, (error: any, token: Token.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      callback(null, token);
    }
  });
}

/**
 * Find all tokens with given `query`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {*} query
 * @param {(err: any, tokens?: Token.MongooseDocumentSchema[]) => void} callback
 */
export function find(query: any, callback: (err: any, tokens?: Token.MongooseDocumentSchema[]) => void): void {
  Token.Model.find(query, (error: any, tokens: Token.MongooseDocumentSchema[]) => {
    if (error) {
      callback(error);
    } else {
      callback(null, tokens);
    }
  });
}

/**
 * Get list of all tokens
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {(err: any, tokens?: Token.MongooseDocumentSchema[]) => void} callback
 */
export function index(callback: (err: any, tokens?: Token.MongooseDocumentSchema[]) => void): void {
  Token.get((error: any, tokens: Document[]) => {
    if (error) {
      callback(error);
    } else {
      callback(null, tokens as Token.MongooseDocumentSchema[]);
    }
  });
}

/**
 * Create new token
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {Token.NativeSchema} new_token
 * @param {(err: any, token?: Token.MongooseDocumentSchema) => void} callback
 */
export function create(
  new_token: Token.NativeSchema,
  callback: (err: any, token?: Token.MongooseDocumentSchema) => void
): void {
  const token = new Token.Model({
    username: new_token.username,
    token: new_token.token,
    uuid: new_token.uuid
  });
  token.save(error => {
    if (error) {
      callback(error);
    } else {
      callback(null, token as Token.MongooseDocumentSchema);
    }
  });
}

/**
 * Update existing token with _id: `token_id`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} token_id
 * @param {Token.NativeSchema} updated_token
 * @param {(err: any, token?: Token.MongooseDocumentSchema) => void} callback
 */
export function update(
  token_id: string,
  updated_token: Token.NativeSchema,
  callback: (err: any, token?: Token.MongooseDocumentSchema) => void
): void {
  Token.Model.findById(token_id, (error, token: Token.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      token.token = updated_token.token;
      token.last_updated_timestamp = new Date(Date.now());
      token.uuid = updated_token.uuid;
      token.save(error_save => {
        if (error_save) {
          callback(error_save);
        } else {
          callback(null, token);
        }
      });
    }
  });
}

/**
 * Make a token with _id: `token_id` inactive
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} token_id
 * @param {(err: any, token?: Token.MongooseDocumentSchema) => void} callback
 */
export function make_inactive(
  token_id: string,
  callback: (err: any, token?: Token.MongooseDocumentSchema) => void
): void {
  Token.Model.findById(token_id, (error, token: Token.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      token.is_active = false;
      token.save(error_save => {
        if (error) {
          callback(error_save);
        } else {
          callback(null, token);
        }
      });
    }
  });
}

/**
 * Delete a token with _id: `token_id`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} token_id
 * @param {(err: any) => void} callback
 */
export function remove(token_id: string, callback: (err: any) => void): void {
  Token.Model.deleteOne(
    {
      _id: token_id
    },
    error => {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    }
  );
}
