/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-07 21:54:25
 * @modify date 2019-12-07 21:54:25
 * @desc Config file for express-status-monitor
 */

export const options = {
  spans: [
    {
      interval: 5,
      retention: 60
    },
    {
      interval: 10,
      retention: 60
    },
    {
      interval: 15,
      retention: 60
    }
  ],
  healthChecks: [
    {
      protocol: 'http',
      host: 'localhost',
      path: '/',
      port: process.env.PORT || 8080
    },
    {
      protocol: 'http',
      host: 'localhost',
      path: '/api',
      port: process.env.PORT || 8080
    },
    {
      protocol: 'http',
      host: 'localhost',
      path: '/api/db-ping',
      port: process.env.PORT || 8080
    }
  ],
  ignoreStartsWith: '/api-doc'
};
