/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-08 19:05:45
 * @modify date 2019-12-08 19:05:45
 * @desc Contains mongoose.Schema for User
 */

import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: true
  },
  app_permissions: {
    type: [
      {
        app: String,
        permissions: [String]
      }
    ],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  gender: String,
  created_date: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  }
});
