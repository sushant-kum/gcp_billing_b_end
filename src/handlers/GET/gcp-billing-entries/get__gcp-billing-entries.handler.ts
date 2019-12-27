/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-16 11:02:48
 * @modify date 2019-12-16 11:02:48
 * @desc Handle `GET /api/gcp-billing-entries`
 */

import { BigQuery, JobResponse, PagedResponse } from '@google-cloud/bigquery';
import * as moment from 'moment';

import * as logger from '@app/helpers/logger.helper';
import { AppNames, AppPermissions } from '@app/configs/apps.config';
import { checkAppPermission } from '@app/helpers/check_app_permission.helper';
import { Response } from 'express';
import { gcp_config_bigquery } from '@app/configs/gcp-billing.config';

const bigquery = new BigQuery({
  projectId: gcp_config_bigquery.project_id,
  keyFilename: gcp_config_bigquery.key_file_path
});

/**
 * Handler for handling `GET /api/gcp-billing-entries`
 * Get all gcp-billing-entries
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @export
 * @param {*} req
 * @param {Response} res
 * @returns {Response}
 */
export function handler(req: any, res: Response): Response {
  try {
    checkAppPermission(AppNames.gcp_billing_entries, AppPermissions.read, req.user.username, (error, is_permitted) => {
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
          let query: string;
          if (req.query.startdate || req.query.enddate) {
            if (req.query.startdate && req.query.enddate) {
              const startdate = moment(req.query.startdate, 'YYYY-MM-DD', true);
              const enddate = moment(req.query.enddate, 'YYYY-MM-DD', true);
              if (startdate.isValid() && enddate.isValid() && startdate.isSameOrBefore(enddate)) {
                query = `
                SELECT * FROM
                (
                  SELECT service.description AS service_description, sku.description AS sku_description, SUM(cost) AS cost_sum, currency, CAST(usage_start_time AS DATE) as cost_date, SUM(usage.amount) AS usage_amount, usage.unit AS usage_unit
                  FROM \`${gcp_config_bigquery.table_name}\`
                  GROUP BY sku_description, service_description, cost_date, currency, usage.unit
                  ORDER BY cost_date ASC
                )
                WHERE cost_date >= "${startdate.format('YYYY-MM-DD')}" AND cost_date <= "${enddate.format(
                  'YYYY-MM-DD'
                )}"
                `;
              } else {
                return res.status(400).json({
                  status: 'invalid_request',
                  message: 'Invalid arguments.',
                  user_id: req.user._id,
                  token: req.user.token
                });
              }
            } else {
              return res.status(400).json({
                status: 'invalid_request',
                message: 'Invalid arguments.',
                user_id: req.user._id,
                token: req.user.token
              });
            }
          } else {
            query = `
            SELECT service.description AS service_description, sku.description AS sku_description, SUM(cost) AS cost_sum, currency, CAST(usage_start_time AS DATE) as cost_date, SUM(usage.amount) AS usage_amount, usage.unit AS usage_unit
            FROM \`${gcp_config_bigquery.table_name}\`
            GROUP BY sku_description, service_description, cost_date, currency, usage.unit
            ORDER BY cost_date ASC
            `;
          }

          bigquery
            .createQueryJob({ query })
            .then((job: JobResponse) => {
              job[0]
                .getQueryResults()
                .then((rows: any) => {
                  console.log(rows[0][0]);
                  for (const row of rows[0]) {
                    row.cost_date = row.cost_date.value;
                  }

                  return res.json({
                    status: 'success',
                    message: 'GCP Billing Entries fetched',
                    data: rows[0],
                    user_id: req.user._id,
                    token: req.user.token
                  });
                })
                .catch((errorgetQueryResults: any) => {
                  logger.error([errorgetQueryResults], { log_to_console: true });
                  return res.status(500).json({
                    status: 'error',
                    message: errorgetQueryResults,
                    user_id: req.user._id,
                    token: req.user.token
                  });
                });
            })
            .catch((errorcreateQueryJob: any) => {
              logger.error([errorcreateQueryJob], { log_to_console: true });
              return res.status(500).json({
                status: 'error',
                message: errorcreateQueryJob,
                user_id: req.user._id,
                token: req.user.token
              });
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
