/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-13 15:38:13
 * @modify date 2019-12-13 15:38:13
 * @desc Contains config for GCP Billing Dat import
 */

export const gcp_config_bigquery = {
  project_id: 'liquipack',
  key_file_path: process.env.NODE_ENV === 'production' ? '/tmp/gcp_billing_b_end/account.json' : '.meta/account.json',
  table_name: 'liquipack.gcp_billing.gcp_billing_export_v1_01ABB6_619806_E9487F'
};
