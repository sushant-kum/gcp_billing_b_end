/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-12 11:45:17
 * @modify date 2019-12-12 11:45:17
 * @desc Controller for operations on GcpBillingEntry(s)
 */

import { Document } from 'mongoose';
import * as GcpBillingEntry from '@app/models/mongoose-db/gcp-billing-entry.model';

/**
 * Find one gcpbillingentry with given `query`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {*} query
 * @param {((err: any, gcpbillingentry?: GcpBillingEntry.MongooseDocumentSchema | null) => void)} callback
 */
export function findOne(
  query: any,
  callback: (err: any, gcpbillingentry?: GcpBillingEntry.MongooseDocumentSchema | null) => void
): void {
  GcpBillingEntry.Model.findOne(query, (error: any, gcpbillingentry: GcpBillingEntry.MongooseDocumentSchema) => {
    if (error) {
      callback(error);
    } else {
      callback(null, gcpbillingentry);
    }
  });
}

/**
 * Find all gcpbillingentries with given `query`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {*} query
 * @param {(err: any, gcpbillingentries?: GcpBillingEntry.MongooseDocumentSchema[]) => void} callback
 */
export function find(
  query: any,
  callback: (err: any, gcpbillingentries?: GcpBillingEntry.MongooseDocumentSchema[]) => void
): void {
  GcpBillingEntry.Model.find(query, (error: any, gcpbillingentries: GcpBillingEntry.MongooseDocumentSchema[]) => {
    if (error) {
      callback(error);
    } else {
      callback(null, gcpbillingentries);
    }
  });
}

/**
 * Get list of all gcpbillingentries
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {(err: any, gcpbillingentries?: GcpBillingEntry.MongooseDocumentSchema[]) => void} callback
 */
export function index(
  callback: (err: any, gcpbillingentries?: GcpBillingEntry.MongooseDocumentSchema[]) => void
): void {
  GcpBillingEntry.get((error: any, gcpbillingentries: Document[]) => {
    if (error) {
      callback(error);
    } else {
      callback(null, gcpbillingentries as GcpBillingEntry.MongooseDocumentSchema[]);
    }
  });
}

/**
 * Create new gcpbillingentry
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {GcpBillingEntry.NativeSchema} new_gcpbillingentry
 * @param {(err: any, gcpbillingentry?: GcpBillingEntry.MongooseDocumentSchema) => void} callback
 */
export function create(
  new_gcpbillingentry: GcpBillingEntry.NativeSchema,
  callback: (err: any, gcpbillingentry?: GcpBillingEntry.MongooseDocumentSchema) => void
): void {
  const gcpbillingentry = new GcpBillingEntry.Model(new_gcpbillingentry);
  gcpbillingentry.save(error => {
    if (error) {
      callback(error);
    } else {
      callback(null, gcpbillingentry as GcpBillingEntry.MongooseDocumentSchema);
    }
  });
}

export function getEntrymax_date(callback: (err: any, date?: Date | null) => void): void {
  const query = GcpBillingEntry.Model.find()
    .sort({ endTime: -1 })
    .limit(1);
  query.exec((error: any, gcpbillingentries: GcpBillingEntry.MongooseDocumentSchema[]) => {
    if (error) {
      callback(error);
    } else {
      if (gcpbillingentries.length <= 0) {
        callback(null, null);
      } else {
        callback(null, new Date(gcpbillingentries[0].endTime));
      }
    }
  });
}
