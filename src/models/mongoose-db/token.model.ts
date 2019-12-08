/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-08 19:01:07
 * @modify date 2019-12-08 19:01:07
 * @desc Contains models for Token
 */

import { model as mongoose__model, Document } from 'mongoose';

import { TokenSchema } from '@app/schemas/mongoose-db/token.schema';

export const Model = mongoose__model('token', TokenSchema);

/**
 * Get all tokens with optional `limit`
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
 * Interface MongooseDocumentSchema for Token, extends mongoose.Document
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @interface MongooseDocumentSchema
 * @extends {Document}
 */
export interface MongooseDocumentSchema extends Document {
  username?: string;
  token: string;
  uuid: string;
  created_timestamp?: Date;
  last_updated_timestamp?: Date;
  is_active?: boolean;
}

/**
 * Interface NativeSchema for Token
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @interface NativeSchema
 */
export interface NativeSchema {
  username?: string;
  token: string;
  uuid: string;
  created_timestamp?: Date;
  last_updated_timestamp?: Date;
  is_active?: boolean;
}
