/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-12 11:30:18
 * @modify date 2019-12-12 11:30:18
 * @desc Contains mongoose.Schema for GcpBillingEntry
 */

import { Schema } from 'mongoose';

export const GcpBillingEntrySchema = new Schema({
  accountId: {
    type: String,
    required: true
  },
  lineItemId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  projectNumber: {
    type: Number,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  measurements: {
    type: [
      {
        measurementId: String,
        sum: Number,
        unit: String
      }
    ]
  },
  credits: {
    type: [
      {
        creditId: String,
        amount: Number,
        currency: String
      }
    ]
  },
  cost: {
    type: {
      amount: Number,
      currency: String
    },
    required: true
  }
});
