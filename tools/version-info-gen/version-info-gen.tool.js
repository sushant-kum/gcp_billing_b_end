/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-08 19:10:20
 * @modify date 2019-12-08 19:10:20
 * @desc Tool `version-info-gen`
 */

const { version, name } = require('../..//package.json');
const { join, resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

/**
 * Generate version-info.json file
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 */
function generate() {
  const prod = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? true : false;
  const version_info = {
    name,
    version: prod ? version : `${version}.dev`,
    release_date_time: new Date(),
    env: process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : 'undefined'
  };

  let file;
  if (prod) {
    file = join('/tmp', 'gcp_billing_b_end', 'version-info.json');
  } else {
    file = resolve(__dirname, '..', '..', '.meta', 'version-info.json');
  }
  writeFileSync(
    file,
    `${JSON.stringify(version_info, null, 2)}
  `,
    { encoding: 'utf-8' }
  );

  console.log(`Wrote version info ${version_info.version} to ${relative(resolve('/'), file)}`);
}

exports.generate = generate;
