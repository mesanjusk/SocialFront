import db from './indexedDB';

/**
 * Add or update a record in a given table with optional encryption for
 * highly sensitive fields.
 * @param {string} table - Dexie table name.
 * @param {object} data - Data object to store.
 * @param {string[]} encryptFields - Keys to encrypt before storage.
 */
export const saveRecord = async (table, data, encryptFields = []) => {
  const tableRef = db.table(table);
  const record = { ...data };
  encryptFields.forEach(field => {
    if (record[field]) record[field] = db.encrypt(record[field]);
  });
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
  encryptFields.forEach(field => {
    if (record[field]) record[field] = db.decrypt(record[field]);
  });
  return record;
};

/** Delete all data from IndexedDB on logout */
export const purgeAllData = async () => {
  await db.delete();
};
