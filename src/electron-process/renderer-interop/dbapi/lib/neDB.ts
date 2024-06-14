import DBstore from 'nedb';
import { checkDBFileLock, handleErrorAndUnlock, lockDBFile, unlockDBFile } from './lockfile';
import { getDataFilePath } from '../../app-files/appPaths';
import { DBFiles, DBNames } from '../../app-files/dbFiles';
import { env } from '../../others/env';
// The 'databases' object acts as a registry for NeDB database instances.
const databases = {};
/**
 * Initializes and sets up a NeDB database instance.
 * @param {DBNames} dbName - The name of the database to initialize.
 */
function setDB(dbName: DBNames): void {
    // @ts-ignore
    const filename = getDataFilePath(DBFiles[dbName]);
    env.log('DB', 'getDB-dbPath:', filename);
    databases[dbName] = new DBstore({ filename, corruptAlertThreshold: 1 });
}
/**
 * Handles errors by logging them and rethrowing.
 * This function logs the provided error and rethrows it, allowing the calling function to handle it.
 * It is typically used in a catch block of a promise chain.
 * @param {DBNames} dbName - The name of the database where the error occurred.
 * @param {string} logMessage - A message describing the context of the error.
 * @param {any} err - The error object that was caught.
 * @throws - Rethrows the provided error object to be handled by the calling function.
 */
function handleError(dbName: DBNames, logMessage: string, err: any): Promise<void> {
    env.log('DB', `${dbName} ${logMessage}`, err);
    console.error('DB Error', err, logMessage, dbName);
    throw err; // Rethrow the error to be caught by the caller
}
/**
 * Retrieves or initializes and retrieves a database instance from a registry.
 * If the database is not already initialized, it calls 'setDB' to initialize it.
 * It then attempts to load the database.
 * @param {DBNames} dbName - The name of the database to retrieve.
 * @returns {DBstore | null} - The database instance if successful, or null if an error occurs.
 * @throws - Rethrows any error encountered during database initialization or loading.
 */
function getDB(dbName: DBNames): DBstore | null {
    try {
        env.log('DB', 'getDB-dbName:', dbName);
        if (!databases[dbName]) {
            setDB(dbName);
        }
        databases[dbName].loadDatabase();
        return databases[dbName];

    } catch (err) {
        handleError(dbName, 'getDB', err);
    }
}
/**
 * Executes a query command on the specified database.
 * This function first unlocks the database file and checks if it is locked before
 * proceeding with the query. It then queries the database using the provided parameters.
 * @param {DBNames} dbName - The name of the database on which to execute the query.
 * @param {any} queryParameters - The parameters object used for the query.
 * @returns {Promise<any>} - A promise that resolves with the query results,
 *                           or rejects if an error occurs.
 */
export async function queryCmd(dbName: DBNames, queryParameters: any): Promise<any> {
    try {
        await unlockDBFile(dbName);
        await checkDBFileLock(dbName);
        return new Promise((resolve, reject) => {
            const db = getDB(dbName);
            db.find(queryParameters, (er, docs) => {
                if (er) reject(er);
                else resolve(docs);
            });
        });
    } catch (err) {
        handleError(dbName, 'queryCmdError', err);
    }
}
/**
 * Retrieves the maximum value for a field from the specified database.
 * This function queries the database and sorts the results to find the maximum value.
 * If there are no documents, it resolves to a default value of 1.
 * @param {DBNames} dbName - The name of the database from which to retrieve the maximum value.
 * @returns {Promise<any>} - A promise that resolves with the maximum value found,
 *                           or rejects if an error occurs.
 */
function getMax(dbName: DBNames): Promise<any> {
    return new Promise((resolve, reject) => {
        getDB(dbName).find({}).sort({ value: -1 }).limit(1).exec((err, docs) => {
            const hasDocs = docs && docs.constructor === Array && docs.length > 0;

            if (err) reject(err);
            else if (hasDocs) resolve(docs[0].value);
            else resolve(1);
        });
    });
}
/**
 * Inserts a document into the specified database.
 * This function locks the database file, retrieves the maximum 'value' field from the database,
 * and sets the 'value' field of the document to be inserted. If the document already has a 'value',
 * it retains it; otherwise, it uses the maximum value found or defaults to 1.
 * After insertion, it compacts the database file and unlocks it. Errors encountered during the
 * operation are caught and handled, and the database file is unlocked before rethrowing the error.
 * @param {DBNames} dbName - The name of the database where the document will be inserted.
 * @param {any} doc - The document to be inserted.
 * @returns {Promise<any>} - A promise that resolves with the inserted document(s),
 *                           or rejects if an error occurs.
 */
export async function insertCmd(dbName: DBNames, doc: any): Promise<any> {
    const db = getDB(dbName);
    try {
        await lockDBFile(dbName);
        const maxValue = await getMax(dbName);
        doc["value"] = doc["value"] ?? (maxValue ? maxValue + 1 : 1);
        const docs = await new Promise((resolve, reject) => {
            db.insert(doc, (er, docs) => {
                if (er) reject(er);
                else resolve(docs);
            });
        });
        db.persistence.compactDatafile();
        await unlockDBFile(dbName);
        return docs;
    } catch (err) {
        await handleErrorAndUnlock(dbName, 'insertCmd', err);
    }
}
/**
 * Updates a document in the specified database.
 * This function locks the database file, checks if it is locked, and then performs an update operation.
 * It handles the '_id' field by removing it from the 'specifyField' object if present.
 * After the update, it compacts the database file and unlocks it. Errors encountered during the
 * operation are caught and handled, and the database file is unlocked before rethrowing the error.
 * @param {DBNames} dbName - The name of the database where the update will be performed.
 * @param {any} targetId - The identifier of the document to be updated.
 * @param {any} specifyField - The fields to be updated in the document.
 * @returns {Promise<any>} - A promise that resolves with the number of documents replaced,
 *                           or rejects if an error occurs.
 */
export async function updateCmd(dbName: DBNames, targetId: any, specifyField: any): Promise<any> {
    const db = getDB(dbName);
    delete specifyField._id;
    try {
        await lockDBFile(dbName);
        const numReplaced = await new Promise((resolve, reject) => {
            db.update(
                targetId,
                { $set: specifyField },
                { upsert: true, multi: true },
                (er, numReplaced) => {
                    if (er) reject(er);
                    else resolve(numReplaced);
                }
            );
        });
        db.persistence.compactDatafile();
        await unlockDBFile(dbName);
        await checkDBFileLock(dbName);
        return numReplaced;
    } catch (err) {
        await handleErrorAndUnlock(dbName, 'updateCmd', err);
    }
}
/**
 * Performs an update operation on a specified database by pushing new data to existing records.
 * This function locks the database file, performs the update operation by pushing new data to
 * the records matching the 'oldMatch' criteria. It uses the '$push' operator for the update,
 * affecting multiple records if applicable. After the update, it compacts the database file and
 * unlocks it. Errors encountered during the operation are caught and handled,
 * and the database file is unlocked before rethrowing the error.
 * @param {DBNames} dbName - The name of the database where the update will be performed.
 * @param {any} oldMatch - The criteria used to select the documents to update.
 * @param {any} newMatch - The new data to push to the selected documents.
 * @returns {Promise<any>} - A promise that resolves with the number of documents updated,
 *                           or rejects if an error occurs.
 */
export async function updateDataCmd(dbName: DBNames, oldMatch: any, newMatch: any): Promise<any> {
    const db = getDB(dbName);
    try {
        await lockDBFile(dbName);
        const numReplaced = await new Promise((resolve, reject) => {
            db.update(oldMatch, { $push: newMatch }, { multi: true }, (er, numReplaced) => {
                if (er) reject(er);
                else resolve(numReplaced);
            });
        });
        db.persistence.compactDatafile();
        await unlockDBFile(dbName);
        return numReplaced;
    } catch (err) {
        await handleErrorAndUnlock(dbName, 'updateDataCmd', err);
    }
}
/**
 * Deletes documents from the specified database based on the given criteria.
 * This function locks the database file, performs the delete operation on documents matching
 * the given criteria, and then unlocks the database file. The operation can affect multiple
 * documents. After deletion, it compacts the database file. Errors encountered during the
 * operation are caught and handled, and the database file is unlocked before rethrowing the error.
 * @param {DBNames} dbName - The name of the database from which documents will be deleted.
 * @param {any} match - The criteria used to select the documents for deletion. The type 'any'
 *                      can be replaced with a more specific type based on the deletion criteria.
 * @returns {Promise<any>} - A promise that resolves with the number of documents removed,
 *                           or rejects if an error occurs.
 */
export async function deleteCmd(dbName: DBNames, match: any): Promise<any> {
    const db = getDB(dbName);

    try {
        await lockDBFile(dbName);
        const numRemoved = await new Promise((resolve, reject) => {
            db.remove(match, { multi: true }, (er, numRemoved) => {
                if (er) reject(er);
                else resolve(numRemoved);
            });
        });
        db.persistence.compactDatafile();
        await unlockDBFile(dbName);
        return numRemoved;
    } catch (err) {
        await handleErrorAndUnlock(dbName, 'deleteCmd', err);
    }
}
/**
 * Ensures the creation of an index on a specified field in the database.
 * This function creates an index for the specified field if it doesn't already exist.
 * The index is unique and sparse, meaning it enforces unique values for the field and
 * does not include documents that do not have the field.
 * @param {DBNames} dbName - The name of the database where the index will be created.
 * @param {string} fieldName - The name of the field on which to create the index.
 * @returns {Promise<void>} - A promise that resolves if the index is created successfully,
 *                            or rejects if an error occurs.
 */
export async function ensureIndex(dbName: DBNames, fieldName: string): Promise<any> {
    return new Promise<void>((resolve, reject) => {
        getDB(dbName).ensureIndex({ fieldName, unique: true, sparse: true }, (er) => {
            if (er) reject(er);
            else resolve();
        });
    });
}
