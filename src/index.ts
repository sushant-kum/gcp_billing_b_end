/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-07 20:52:47
 * @modify date 2019-12-07 20:52:47
 * @desc index file for gcp_billing_b_end
 */

if (!process.env.IS_TS_NODE) {
  // tslint:disable-next-line:no-var-requires
  require('module-alias/register');
}

import { Express, Request, Response } from 'express';
const express = require('express');
import * as cors from 'cors';
import * as body_parser from 'body-parser';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as path from 'path';

import { router as api_router } from '@app/routers/api.router';
import { router as apidoc_router } from '@app/routers/api-doc.router';
import * as db_config from '@app/configs/db.config';
import * as cors_config from '@app/configs/cors.config';
import * as status_monitoring_config from '@app/configs/status-monitoring.config';
import * as logger from '@app/helpers/logger.helper';

// Generate app version info file
// Do not change to import format, as files are not in rootDir
require('@project-root/tools/version-info-gen/version-info-gen.tool.js').generate();

// Retrieve app version info file
let version_info: {
  version: string;
  release_date_time: Date | string;
  env: string;
};
if (process.env && process.env.NODE_ENV === 'production') {
  version_info = require(path.join('/tmp', 'gcp_billing_b_end', 'version-info.json'));
} else {
  version_info = require('@project-root/.meta/version-info.json');
}

const port = process.env.PORT || 8080;

// Connect to Mongo DB
mongoose.connect(db_config.connection_string, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
const db = mongoose.connection;

/**
 * Event handler for `mongoose.connection.on('error')`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 * @param {*} error event emitted by `mongoose.connection.on('error')`
 */
function dbOnError(error: any): void {
  logger.error([error]);
  logger.error([
    'Error connecting to db_config:',
    db_config.config,
    'connection_string: ',
    db_config.connection_string
  ]);
}

/**
 * Event handler for `mongoose.connection.on('connected')`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 */
function dbOnConnected(): void {
  logger.log(['Connected to db_config:', db_config.config], {
    log_to_console: true
  });

  const app: Express = express();

  // Status monitoring
  app.use(require('express-status-monitor')(status_monitoring_config.options));

  // Add CORS headers
  app.use(cors(cors_config.options));

  app.use(passport.initialize());

  // for parsing application/xwww-form-urlencoded
  app.use(
    body_parser.urlencoded({
      extended: true
    })
  );
  // for parsing application/json
  app.use(body_parser.json());

  app.get('/', (req: Request, res: Response) => {
    res.json({
      status: 'success',
      message: 'Welcome to liquipack_systems APIs crafted with love!',
      version: version_info.version,
      deploy_date: version_info.release_date_time
    });
  });

  app.get('/version', (req: Request, res: Response) => {
    res.json({
      status: 'success',
      version_info
    });
  });

  app.use('/api', api_router);
  app.use('/api-doc', apidoc_router);
  app.use('/assets', express.static('public/assets'));

  app.listen(port, () => {
    logger.log(['Started liquipack_systems API service on port ' + port], {
      log_to_console: true
    });
  });
}

/**
 * Event handler for `mongoose.connection.on('disconnected')`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 */
function dbOnDisconnected(): void {
  logger.error(['Disconnected from db_config:', db_config.config], { log_to_console: true });
}

/**
 * Callback for `mongoose.connection.close()`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 */
function dbClose(): void {
  logger.error(['Mongoose default connection is disconnected due to application termination'], {
    log_to_console: true
  });
  process.exit(0);
}

/**
 * Event handler for `process.on('SIGINT')`
 *
 * @author Sushant Kumar <sushant.kum96@gmail.com>
 */
function processOnSIGINT(): void {
  db.close(dbClose);
}

// Handle mongoose.connection events
db.on('error', dbOnError);
db.on('connected', dbOnConnected);
db.on('disconnected', dbOnDisconnected);

// Handle process events
process.on('SIGINT', processOnSIGINT);
