/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-12 11:30:03
 * @modify date 2019-12-12 11:30:03
 * @desc Contains models for GcpBillingEntry
 */

import { model as mongoose__model, Document } from 'mongoose';

import { GcpBillingEntrySchema } from '@app/schemas/mongoose-db/gcp-billing-entry.schema';

export const Model = mongoose__model('gcp-billing-entries', GcpBillingEntrySchema);

/**
 * Get all gcpbillingentrys with optional `limit`
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
 * Interface for Measurement
 *
 * @author Sushant Kumar
 * @export
 * @interface Measurement
 */
export interface Measurement {
  measurementId: string;
  sum: number;
  unit: string;
}

/**
 * Interface for Credit
 *
 * @author Sushant Kumar
 * @export
 * @interface Credit
 */
export interface Credit {
  creditId: string;
  amount: number;
  currency: string;
}

/**
 * Interface for Cost
 *
 * @author Sushant Kumar
 * @export
 * @interface Cost
 */
export interface Cost {
  amount: number;
  currency: string;
}

/**
 * Interface MongooseDocumentSchema for GcpBillingEntry, extends mongoose.Document
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @interface MongooseDocumentSchema
 * @extends {Document}
 */
export interface MongooseDocumentSchema extends Document {
  accountId: string;
  lineItemId: string;
  description: string;
  startTime: Date;
  endTime: Date;
  projectNumber: number;
  projectId: string;
  projectName: string;
  measurements?: Measurement[];
  credits?: Credit[];
  cost: Cost;
}

/**
 * Interface NativeSchema for GcpBillingEntry
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @interface NativeSchema
 */
export interface NativeSchema {
  accountId: string;
  lineItemId: string;
  description: string;
  startTime: Date;
  endTime: Date;
  projectNumber: number;
  projectId: string;
  projectName: string;
  measurements?: Measurement[];
  credits?: Credit[];
  cost: Cost;
}
