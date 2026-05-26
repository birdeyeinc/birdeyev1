/*eslint-disable */
let commonIndexedDbClass = (function () {
    try {
        let dbInstances = {};

        const getDB = (storeName) => {
            const dbName = "copilotChats";
            const dbKey = `${dbName}_${storeName}`;
            
            if (!dbInstances[dbKey]) {
                dbInstances[dbKey] = new Promise(function (resolve, reject) {
                    // Always try to open with a higher version to ensure we can create stores
                    let openreq = indexedDB.open(dbName);
                    
                    openreq.onsuccess = function() {
                        const db = openreq.result;
                        const currentVersion = db.version;
                        const storeExists = db.objectStoreNames.contains(storeName);
                        db.close();
                        
                        if (storeExists) {
                            // Store exists, open normally
                            let finalReq = indexedDB.open(dbName, currentVersion);
                            finalReq.onsuccess = () => resolve(finalReq.result);
                            finalReq.onerror = () => reject(finalReq.error);
                        } else {
                            // Store doesn't exist, upgrade database to create it
                            let upgradeReq = indexedDB.open(dbName, currentVersion + 1);
                            
                            upgradeReq.onupgradeneeded = function () {
                                try {
                                    const dbInstance = upgradeReq.result;
                                    if (!dbInstance.objectStoreNames.contains(storeName)) {
                                        dbInstance.createObjectStore(storeName);
                                    }
                                } catch (e) {
                                    reject(e);
                                }
                            };
                            
                            upgradeReq.onsuccess = () => resolve(upgradeReq.result);
                            upgradeReq.onerror = () => reject(upgradeReq.error);
                        }
                    };
                    
                    openreq.onerror = function() {
                        // Database doesn't exist, create it
                        let createReq = indexedDB.open(dbName, 1);
                        
                        createReq.onupgradeneeded = function () {
                            try {
                                const dbInstance = createReq.result;
                                dbInstance.createObjectStore(storeName);
                            } catch (e) {
                                reject(e);
                            }
                        };
                        
                        createReq.onsuccess = () => resolve(createReq.result);
                        createReq.onerror = () => reject(createReq.error);
                    };
                });
            }
            return dbInstances[dbKey];
        }

        const withStore = async (type, callback, storeName = "defaultCopilotStore") => {
            let db = await getDB(storeName);
            return new Promise(function (resolve, reject) {
                let transaction = db.transaction(storeName, type);
                transaction.oncomplete = function () {
                    return resolve("");
                };
                transaction.onerror = function () {
                    return reject(transaction.error);
                };
                callback(transaction.objectStore(storeName));
            });
        }

        return {
            async get(key, storeName = "defaultCopilotStore") {
                let req;
                await withStore("readonly", function (store) {
                    req = store.get(key);
                }, storeName);
                return req.result;
            },
            async getAllKeys(storeName = "defaultCopilotStore") {
                let req;
                await withStore("readonly", function (store) {
                    req = store.getAllKeys();
                }, storeName);
                return req.result;
            },
            set(key, value, storeName = "defaultCopilotStore") {
                return withStore("readwrite", function (store) {
                    store.put(value, key);
                }, storeName);
            },
            delete(key, storeName = "defaultCopilotStore") {
                return withStore("readwrite", function (store) {
                    store.delete(key);
                }, storeName);
            },
            async deleteStore(storeName = "defaultCopilotStore") {
                // deleting each key from the store
                await withStore("readwrite", function (store) {
                    const request = store.openCursor();
                
                    request.onsuccess = (event) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            store.delete(cursor.primaryKey);
                            cursor.continue();
                        } else {
                            console.log(`IndexedDB: All keys deleted from store ${storeName}`);
                        }
                    };

                    request.onerror = () => {
                        console.log(`IndexedDB deletion error for store ${storeName}`);
                    }
                }, storeName);
            },
            // Helper method to create user-specific store helper
            createUserHelper(userId, accountId, storeName = null) {
                const finalStoreName = storeName || `user_${userId}_${accountId}`;
                return {
                    get: (key) => this.get(key, finalStoreName),
                    set: (key, value) => this.set(key, value, finalStoreName),
                    delete: (key) => this.delete(key, finalStoreName),
                    getAllKeys: () => this.getAllKeys(finalStoreName),
                    deleteStore: () => this.deleteStore(finalStoreName)
                };
            }
        };
    } catch (e) {
        console.log("IndexedDB storage Error: ", e);
    }
})();

export default commonIndexedDbClass;
