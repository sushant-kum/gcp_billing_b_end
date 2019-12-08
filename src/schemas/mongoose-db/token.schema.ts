/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-08 19:05:18
 * @modify date 2019-12-08 19:05:18
 * @desc Contains mongoose.Schema for Token
 */

import { Schema } from 'mongoose';

export const TokenSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true
  },
  created_timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  last_updated_timestamp: {
    type: Date,
    default: null
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  }
});
