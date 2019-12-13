/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-13 15:38:13
 * @modify date 2019-12-13 15:38:13
 * @desc Contains config for GCP Billing Dat import
 */

export const gcp_config = {
  project_id: 'liquipack',
  bucket_name: 'liquipack-billing',
  key_file_path: process.env.NODE_ENV === 'production' ? '/tmp/gcp_billing_b_end/account.json' : '.meta/account.json',
  report_file_prefix: 'cost-report-',
  reports_storage_path: process.env.NODE_ENV === 'production' ? '/tmp/gcp_billing_b_end/' : '.meta/'
};
