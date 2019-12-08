/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-07 21:53:17
 * @modify date 2019-12-07 21:53:17
 * @desc Config file for Mongo DB connection
 */

export const config = {
  hostname: 'liquipack-ta1ux.mongodb.net',
  db_name: 'liquipack_systems',
  username: 'liquipack_systems_user',
  password: 'NzFne2LMUXmjqad9bcyXcZHyLpHjUp',
  options: 'retryWrites=true&w=majority'
};

export const connection_string = `mongodb+srv://${config.username}:${config.password}@${config.hostname}/${config.db_name}?${config.options}`;
