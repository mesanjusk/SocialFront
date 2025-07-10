import db from './indexedDB';

const processRecord = (record, fields, fn) => {
  const data = { ...record };
  fields.forEach(field => {
    if (data[field]) data[field] = fn(data[field]);
  });
  return data;
};

/**
 * Add or update a record in a given table with optional encryption for
 * highly sensitive fields.
 * @param {string} table - Dexie table name.
 * @param {object} data - Data object to store.
 * @param {string[]} encryptFields - Keys to encrypt before storage.
 */
export const saveRecord = async (table, data, encryptFields = []) => {
  const tableRef = db.table(table);
  const record = processRecord(data, encryptFields, db.encrypt.bind(db));
  await tableRef.put(record);
};

/**
 * Retrieve a record by id and decrypt encrypted fields.
 * @param {string} table - Table name.
 * @param {any} id - Primary key.
 * @param {string[]} encryptFields - Fields that were encrypted.
 */
export const getRecord = async (table, id, encryptFields = []) => {
  const tableRef = db.table(table);
  const record = await tableRef.get(id);
  if (!record) return null;
  return processRecord(record, encryptFields, db.decrypt.bind(db));
};

/**
 * Store multiple records with optional field encryption
 */
export const saveRecords = async (table, records = [], encryptFields = []) => {
  if (!records.length) return;
  const tableRef = db.table(table);
  const processed = records.map(r => processRecord(r, encryptFields, db.encrypt.bind(db)));
  await tableRef.bulkPut(processed);
};

/**
 * Retrieve all records from a table
 */
export const getAllRecords = async (table, encryptFields = []) => {
  const tableRef = db.table(table);
  const records = await tableRef.toArray();
  return records.map(r => processRecord(r, encryptFields, db.decrypt.bind(db)));
};

/** Delete all data from IndexedDB on logout */
export const purgeAllData = async () => {
  await db.delete();
};
