/**
 * @author Sushant Kumar
 * @email sushant.kum96@gmail.com
 * @create date 2019-12-07 21:33:26
 * @modify date 2019-12-07 21:33:26
 * @desc Config file for apps and app access
 */

/**
 * List of app names, Contains:
 * - `login` = `'login'`
 * - `token` = `'token'`
 * - `system_users` = `'system-users'`
 * - `settings_profile` = `'settings-profile'`
 * - `users_min` = `'users-min'`
 *
 * @export
 * @enum
 */
export enum AppNames {
  login = 'login',
  token = 'token',
  system_users = 'system-users',
  settings_profile = 'settings-profile',
  users_min = 'users-min'
}

/**
 * List of app permissions, Contains:
 * - `read` = `'read'`
 * - `write` = `'write'`
 * - `delete` = `'delete'`
 * @export
 * @enum
 */
export enum AppPermissions {
  read = 'read',
  write = 'write',
  delete = 'delete'
}

export const compulsory_apps: AppNames[] = [
  AppNames.login,
  AppNames.token,
  AppNames.settings_profile,
  AppNames.users_min
];

export const compulsory_app_permissions: { [key: string]: AppPermissions[] } = {};
compulsory_app_permissions[AppNames.login] = [AppPermissions.read, AppPermissions.write];
compulsory_app_permissions[AppNames.token] = [AppPermissions.read, AppPermissions.write];
compulsory_app_permissions[AppNames.settings_profile] = [AppPermissions.read, AppPermissions.write];
compulsory_app_permissions[AppNames.users_min] = [AppPermissions.read];
