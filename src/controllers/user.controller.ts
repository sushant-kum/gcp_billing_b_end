/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-07 23:08:48
 * @modify date 2019-12-07 23:08:48
 * @desc Controller for operation on User(s)
 */

import * as User from '@app/models/mongoose-db/user.model';
import { Document } from 'mongoose';

/**
 * Find one user as per `query`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {*} query
 * @param {(err: any, user?: User.MongooseDocumentSchema) => void} callback
 */
export function findOne(query: any, callback: (err: any, user?: User.MongooseDocumentSchema) => void): void {
  User.Model.findOne(query, (error: any, user: User.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      callback(null, user);
    }
  });
}

/**
 * Get all users
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {(err: any, users?: User.MongooseDocumentSchema[]) => void} callback
 */
export function index(callback: (err: any, users?: User.MongooseDocumentSchema[]) => void): void {
  User.get((error: any, users: Document[]) => {
    if (error) {
      callback(error);
    } else {
      callback(null, users as User.MongooseDocumentSchema[]);
    }
  });
}

/**
 * Create new user
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {User.NativeScehma} new_user
 * @param {(err: any, user?: User.MongooseDocumentSchema) => void} callback
 */
export function create(
  new_user: User.NativeScehma,
  callback: (err: any, user?: User.MongooseDocumentSchema) => void
): void {
  const user = new User.Model({
    username: new_user.username,
    password_hash: new_user.password_hash,
    app_permissions: new_user.app_permissions,
    name: new_user.name,
    gender: new_user.gender ? new_user.gender : null,
    email: new_user.email,
    phone: new_user.phone ? new_user.phone : null
  });
  user.save((error: any) => {
    if (error) {
      callback(error);
    } else {
      callback(null, user as User.MongooseDocumentSchema);
    }
  });
}

/**
 * Get a user with _id: `user_id`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} user_id
 * @param {((err: any, user?: User.MongooseDocumentSchema | null) => void)} callback
 */
export function view(user_id: string, callback: (err: any, user?: User.MongooseDocumentSchema | null) => void): void {
  User.Model.findById(user_id, (error: any, user: User.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      callback(null, user);
    }
  });
}

/**
 * Update existing user with _id: `user_id`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} user_id
 * @param {User.NativeScehma} update_user
 * @param {((err: any, user?: User.MongooseDocumentSchema | null) => void)} callback
 */
export function update(
  user_id: string,
  update_user: User.NativeScehma,
  callback: (err: any, user?: User.MongooseDocumentSchema | null) => void
): void {
  User.Model.findById(user_id, (error: any, user: User.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      user.password_hash = update_user.password_hash;
      user.app_permissions = update_user.app_permissions;
      user.name = update_user.name;
      user.gender = update_user.gender;
      user.email = update_user.email;
      user.phone = update_user.phone;
      user.save((error_save: any) => {
        if (error_save) {
          callback(error_save);
        } else {
          callback(null, user);
        }
      });
    }
  });
}

/**
 * Make user with _id: `user_id` inactive
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} user_id
 * @param {((err: any, user?: User.MongooseDocumentSchema | null) => void)} callback
 */
export function make_inactive(
  user_id: string,
  callback: (err: any, user?: User.MongooseDocumentSchema | null) => void
): void {
  User.Model.findById(user_id, (error: any, user: User.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      user.is_active = false;
      user.save((error_save: any) => {
        if (error_save) {
          callback(error_save);
        } else {
          callback(null, user);
        }
      });
    }
  });
}

/**
 * Make user with _id: `user_id` active
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} user_id
 * @param {((err: any, user?: User.MongooseDocumentSchema | null) => void)} callback
 */
export function make_active(
  user_id: string,
  callback: (err: any, user?: User.MongooseDocumentSchema | null) => void
): void {
  User.Model.findById(user_id, (error: any, user: User.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      user.is_active = true;
      user.save((error_save: any) => {
        if (error_save) {
          callback(error_save);
        } else {
          callback(null, user);
        }
      });
    }
  });
}

/**
 * Delete user with _id: `user_id`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} user_id
 * @param {(err: any) => void} callback
 */
export function remove(user_id: string, callback: (err: any) => void): void {
  User.Model.deleteOne(
    {
      _id: user_id
    },
    (error: any) => {
      if (error) {
        callback(error);
      } else {
        callback(null);
      }
    }
  );
}

/**
 * Check user credentials
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {string} username
 * @param {string} password_hash
 * @param {((err: any, user?: User.MongooseDocumentSchema | null) => void)} callback
 */
export function checkCredentials(
  username: string,
  password_hash: string,
  callback: (err: any, user?: User.MongooseDocumentSchema | null) => void
): void {
  User.Model.findOne(
    {
      username,
      password_hash,
      is_active: true
    },
    'app_permissions',
    (error: any, user: User.MongooseDocumentSchema) => {
      if (error) {
        callback(error);
      } else {
        callback(null, user);
      }
    }
  );
}
