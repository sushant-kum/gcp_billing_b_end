/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-08 19:04:00
 * @modify date 2019-12-08 19:04:00
 * @desc Contains models for User
 */

import { model as mongoose__model, Document } from 'mongoose';

import { UserSchema } from '@app/schemas/mongoose-db/user.schema';

export const Model = mongoose__model('user', UserSchema);

/**
 * Get all users with optional `limit`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {(err: any, res: Document[]) => void} callback
 * @param {number} [limit]
 */
export function get(callback: (err: any, res: Document[]) => void, limit?: number): void {
  if (limit) {
    Model.find(callback).limit(limit);
  } else {
    Model.find(callback);
  }
}

/**
 * Interface MongooseDocumentSchema for User, extends mongoose.Document
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @interface MongooseDocumentSchema
 * @extends {Document}
 */
export interface MongooseDocumentSchema extends Document {
  username: string;
  password_hash: string;
  app_permissions: {
    app: string;
    permissions: string[];
  }[];
  name: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | 'others';
  created_date?: Date;
  is_active?: boolean;
}

/**
 * Interface NativeScehma for User
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @interface NativeScehma
 */
export interface NativeScehma {
  username?: string;
  password_hash: string;
  app_permissions: {
    app: string;
    permissions: string[];
  }[];
  name: string;
  email: string;
  phone?: string;
  gender?: 'male' | 'female' | 'others';
  created_date?: Date;
  is_active?: boolean;
}
