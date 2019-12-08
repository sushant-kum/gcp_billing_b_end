/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-08 18:08:01
 * @modify date 2019-12-08 18:08:01
 * @desc Handle `GET /api/users`
 */

import * as logger from '@app/helpers/logger.helper';
import { AppNames, AppPermissions } from '@app/configs/apps.config';
import { checkAppPermission } from '@app/helpers/check_app_permission.helper';
import * as UserController from '@app/controllers/user.controller';
import { Response } from 'express';

/**
 * Handler for handling `GET /api/users`
 * Get all users
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {*} req
 * @param {Response} res
 * @returns {Response}
 */
export function handler(req: any, res: Response): Response {
  try {
    checkAppPermission(AppNames.system_users, AppPermissions.read, req.user.username, (error, is_permitted) => {
      if (error) {
        logger.error([error], { log_to_console: true });
        return res.status(500).json({
          status: 'error',
          message: error,
          user_id: req.user._id,
          token: req.user.token
        });
      } else {
        if (is_permitted) {
          UserController.index((errorUserControllerindex, users = []) => {
            if (errorUserControllerindex) {
              return res.status(500).json({
                status: 'error',
                message: errorUserControllerindex,
                user_id: req.user._id,
                token: req.user.token
              });
            } else {
              return res.json({
                status: 'success',
                message: 'Users retrieved successfully',
                data: users,
                user_id: req.user._id,
                token: req.user.token
              });
            }
          });
        } else {
          return res.status(403).json({
            status: 'access_denied',
            message: 'Access to this operation is denied',
            user_id: req.user._id,
            token: req.user.token
          });
        }
      }
    });
  } catch (error) {
    logger.error([error], { log_to_console: true });
    return res.status(500).json({
      status: 'error',
      message: error,
      user_id: req.user._id,
      token: req.user.token
    });
  }
}
