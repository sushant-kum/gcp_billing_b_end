/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-07 21:52:15
 * @modify date 2019-12-07 21:52:15
 * @desc Config file for CORS
 */

const whitelist = [
  'https://billing.liquipack.sushantk.com',
  'https://billing.liquipack.cf',
  'https://testbed.liquipack.cf'
];

export const options = {
  // origin: function(origin, callback) {
  //   if (
  //     (process.env.NODE_ENV === 'production' && whitelist.includes(origin)) ||
  //     process.env.NODE_ENV !== 'production'
  //   ) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
  //   }
  // },
  origin: whitelist,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
