/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-08 18:10:23
 * @modify date 2019-12-08 18:10:23
 * @desc Handle `GET /api/users/:user_id`
 */

import * as logger from '@app/helpers/logger.helper';
import { AppNames, AppPermissions } from '@app/configs/apps.config';
import { checkAppPermission } from '@app/helpers/check_app_permission.helper';
import * as UserController from '@app/controllers/user.controller';
import { Response } from 'express';

/**
 * Handler for handling `GET /api/users/:user_id`
 * Get user details for _id = `:user_id`
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
          let valid_arguments_flag = false;
          if (req.params.user_id) {
            valid_arguments_flag = true;
          }

          if (valid_arguments_flag) {
            UserController.view(req.params.user_id, (errorUserControllerview, user = null) => {
              if (errorUserControllerview) {
                return res.status(500).json({
                  status: 'error',
                  message: errorUserControllerview,
                  user_id: req.user._id,
                  token: req.user.token
                });
              } else {
                return res.json({
                  status: 'success',
                  message: 'User retrieved successfully',
                  data: user,
                  user_id: req.user._id,
                  token: req.user.token
                });
              }
            });
          } else {
            return res.status(400).json({
              status: 'invalid_request',
              message: 'Invalid arguments.',
              user_id: req.user._id,
              token: req.user.token
            });
          }
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
