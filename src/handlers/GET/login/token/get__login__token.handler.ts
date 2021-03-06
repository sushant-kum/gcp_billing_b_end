/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-08 18:05:59
 * @modify date 2019-12-08 18:05:59
 * @desc Handle `GET /api/login/token`
 */

import * as logger from '@app/helpers/logger.helper';
import { AppNames, AppPermissions } from '@app/configs/apps.config';
import { checkAppPermission } from '@app/helpers/check_app_permission.helper';
import { Response } from 'express';

/**
 * Handler for handling `GET /api/login/token`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {*} req
 * @param {Response} res
 * @returns {Response}
 */
export function handler(req: any, res: Response): Response {
  try {
    checkAppPermission(AppNames.token, AppPermissions.read, req.user.username, (error, is_permitted) => {
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
          return res.json({
            status: 'success',
            message: 'Login Successful via token',
            data: {
              app_permissions: req.user.app_permissions
            },
            user_id: req.user._id,
            token: req.user.token
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
