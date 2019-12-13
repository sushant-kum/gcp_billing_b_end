/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-12 12:15:27
 * @modify date 2019-12-12 12:15:27
 * @desc Handle `GET /api/gcp-billing-entries/import`
 */
import { Storage, File, GetFilesOptions } from '@google-cloud/storage';
import * as moment from 'moment';
import * as glob from 'glob';
import * as fs from 'fs';

import * as logger from '@app/helpers/logger.helper';
import { AppNames, AppPermissions } from '@app/configs/apps.config';
import { checkAppPermission } from '@app/helpers/check_app_permission.helper';
import * as GcpBillingEntryController from '@app/controllers/gcp-billing-entry.controller';
import { Response } from 'express';
import { NativeSchema } from '@app/models/mongoose-db/gcp-billing-entry.model';
import { gcp_config } from '@app/configs/gcp-billing.config';

const bucket_name = gcp_config.bucket_name;
const report_file_prefix = gcp_config.report_file_prefix;
const project_id = gcp_config.project_id;
const key_file_path = gcp_config.key_file_path;
const reports_storage_path = gcp_config.reports_storage_path;

const storage = new Storage({
  projectId: project_id,
  keyFilename: key_file_path
});

interface FileMeta {
  name: string;
  created_date: Date;
  entries: NativeSchema[];
}

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
    GcpBillingEntryController.getEntrymax_date((error, max_date) => {
      if (error) {
        logger.error([error], { log_to_console: true });
        return res.status(500).json({
          status: 'error',
          message: error,
          user_id: req.user._id,
          token: req.user.token
        });
      } else {
        const bucket_files_query: GetFilesOptions = {
          prefix: report_file_prefix
        };

        storage
          .bucket(bucket_name)
          .getFiles(bucket_files_query)
          .then((files: File[][]) => {
            const files_meta: FileMeta[] = [];
            for (const file of files[0]) {
              const date_arr = file.name
                .split('--')[1]
                .split('.json')[0]
                .split('-');
              files_meta.push({
                name: file.name,
                created_date: new Date(
                  moment()
                    .utc()
                    .year(Number(date_arr[0]))
                    .month(Number(date_arr[1]))
                    .date(Number(date_arr[2]))
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .format()
                ),
                entries: []
              });
            }

            glob(`${reports_storage_path}${report_file_prefix}*.json`, (errorGlob: any, filesGlob) => {
              if (filesGlob.length && filesGlob.length > 0) {
                for (const fileGlob of filesGlob) {
                  logger.info([`Deleting file ${fileGlob}`], { log_to_console: true });
                  if (filesGlob.indexOf(fileGlob) < filesGlob.length - 1) {
                    fs.unlinkSync(fileGlob);
                  } else {
                    fs.unlink(fileGlob, (errorFsUnlink: Error) => {
                      if (errorFsUnlink) {
                        logger.error([errorFsUnlink], { log_to_console: true });
                        return res.status(500).json({
                          status: 'error',
                          message: errorFsUnlink,
                          user_id: req.user._id,
                          token: req.user.token
                        });
                      } else {
                        downloadAndProcessGcpBillingReports(
                          files_meta,
                          max_date,
                          errorDownloadAndProcessGcpBillingReports => {
                            if (errorDownloadAndProcessGcpBillingReports) {
                              logger.error([errorDownloadAndProcessGcpBillingReports], { log_to_console: true });
                              return res.status(500).json({
                                status: 'error',
                                message: errorDownloadAndProcessGcpBillingReports,
                                user_id: req.user._id,
                                token: req.user.token
                              });
                            } else {
                              return res.json({
                                status: 'success',
                                message: 'File received',
                                data: files_meta,
                                user_id: req.user._id,
                                token: req.user.token
                              });
                            }
                          }
                        );
                      }
                    });
                  }
                }
              } else {
                downloadAndProcessGcpBillingReports(files_meta, max_date, errorDownloadAndProcessGcpBillingReports => {
                  if (errorDownloadAndProcessGcpBillingReports) {
                    logger.error([errorDownloadAndProcessGcpBillingReports], { log_to_console: true });
                    return res.status(500).json({
                      status: 'error',
                      message: errorDownloadAndProcessGcpBillingReports,
                      user_id: req.user._id,
                      token: req.user.token
                    });
                  } else {
                    return res.json({
                      status: 'success',
                      message: 'File received',
                      data: files_meta,
                      user_id: req.user._id,
                      token: req.user.token
                    });
                  }
                });
              }
            });
          })
          .catch((errroGetFiles: any) => {
            logger.error([errroGetFiles], { log_to_console: true });
            return res.status(500).json({
              status: 'error',
              message: errroGetFiles,
              user_id: req.user._id,
              token: req.user.token
            });
          });
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

function downloadAndProcessGcpBillingReports(
  files_meta: FileMeta[],
  max_date: Date,
  callback: (err: any) => void
): void {
  console.log('max_date', max_date);
  for (const file_meta of files_meta) {
    if (
      max_date === null ||
      (max_date !== null && moment(file_meta.created_date).isAfter(moment(max_date).add(1, 'days')))
    ) {
      storage
        .bucket(bucket_name)
        .file(file_meta.name)
        .download({ destination: `${reports_storage_path}${file_meta.name}` })
        .then((value: [Buffer]) => {
          logger.info(
            [`gs://${bucket_name}/${file_meta.name} downloaded to ${reports_storage_path}${file_meta.name}.`],
            { log_to_console: true }
          );
          file_meta.entries = require(`@project-root/${reports_storage_path}${file_meta.name}`);
          for (const entry of file_meta.entries) {
            GcpBillingEntryController.create(entry, (errorGcpBillingEntryControllerCreate, gcpbillingentry) => {
              if (errorGcpBillingEntryControllerCreate) {
                callback(errorGcpBillingEntryControllerCreate);
                return;
              } else {
                if (
                  files_meta.indexOf(file_meta) === files_meta.length - 1 &&
                  file_meta.entries.indexOf(entry) === file_meta.entries.length - 1
                ) {
                  callback(null);
                }
              }
            });
          }
        })
        .catch((err: any) => {
          callback(err);
          return;
        });
    }
  }
}
