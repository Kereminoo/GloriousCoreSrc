import lockfile from "lockfile";
import { EnvironmentLogLevel, env } from "../../others/env";
import { DBNames } from '../../app-files/dbFiles';
import { getDataFilePath, getTempFilePath } from '../../app-files/appPaths';

const LOCK_OPTS = { retries: 5, retryWait: 100 };
// Unlocking several databases synchronously at startup
lockfile.unlockSync(DBNames.MacroDB);
lockfile.unlockSync(DBNames.DeviceDB);
lockfile.unlockSync(DBNames.AppSettingDB);
lockfile.unlockSync(DBNames.PluginDB);
/**
 * Asynchronously unlocks the specified database file.
 * @param {DBNames} dbName - The name of the database to unlock.
 * @returns {Promise<void>} - A promise that resolves once the database file is unlocked,
 *                            or rejects if an error occurs.
 */
export function unlockDBFile(dbName: DBNames): Promise<void> {
    return new Promise((resolve, reject) => {
        lockfile.unlock(getTempFilePath(dbName), (err) => {
            if (err) return reject(err);
            resolve();
        });
    })
}
/**
 * Checks if the specified database file is currently locked.
 * @param {DBNames} dbName - The name of the database to check.
 * @returns {Promise<void>} - A promise that resolves if the file is not locked,
 *                            or rejects with an error or if the file is locked.
 */
export function checkDBFileLock(dbName: DBNames): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        lockfile.check(getTempFilePath(dbName), (err, isLocked) => {
            if (err) {
                const errorMessage = `checkDBFileLock: ${dbName} ${err}`;
                console.error(errorMessage);
                env.log(EnvironmentLogLevel.ERROR, errorMessage, err);
                reject(err);
            } else if (isLocked){
                reject(new Error(`${dbName} database is locked`));
            } else {
                resolve();
            }
        });
    });
}
/**
 * Locks the specified database file.
 * @param {DBNames} dbName - The name of the database to lock.
 * @returns {Promise<void>} - A promise that resolves once the database file is locked,
 *                            or rejects if an error occurs.
 */
export function lockDBFile(dbName: DBNames): Promise<void> {
    return new Promise((resolve, reject) => {
        lockfile.lock(getTempFilePath(dbName), LOCK_OPTS, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}
/**
 * Handles an error and unlocks the specified database file.
 * This function logs the error, unlocks the database, and then rethrows the error.
 * @param {DBNames} dbName - The name of the database related to the error.
 * @param {string} logMessage - A message describing the context of the error.
 * @param {any} err - The error to handle. The type 'any' can be replaced with a more specific error type.
 * @returns {Promise<void>} - A promise that resolves after the file is unlocked.
 * @throws - Rethrows the provided error object for further handling.
 */
export async function handleErrorAndUnlock(dbName: DBNames, logMessage: string, err: any): Promise<void> {
    env.log(EnvironmentLogLevel.ERROR, logMessage, err);
    try {
        return await unlockDBFile(dbName);
    } finally {
        throw err; // Re-throw the error for further handling
    }
}
