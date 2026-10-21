/**
 * IndexedDB persistence layer for saving and managing custom mutual fund presets.
 */

export interface CustomPreset {
  id: string;
  name: string;
  description: string;
  fundIds: string[];
  createdAt: number;
  updatedAt: number;
}

const DB_NAME = 'PortfolioOverlapDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_presets';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('name', 'name', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Retrieve all user-saved presets from IndexedDB.
 */
export async function getAllCustomPresets(): Promise<CustomPreset[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const presets = request.result as CustomPreset[];
        // Sort newest first
        presets.sort((a, b) => b.createdAt - a.createdAt);
        resolve(presets);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to get custom presets from IndexedDB:', error);
    return [];
  }
}

/**
 * Save or update a custom preset in IndexedDB.
 */
export async function saveCustomPreset(preset: Omit<CustomPreset, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<CustomPreset> {
  const db = await openDB();
  const now = Date.now();
  const id = preset.id || `user-preset-${now}-${Math.random().toString(36).substring(2, 7)}`;

  const record: CustomPreset = {
    id,
    name: preset.name.trim(),
    description: preset.description.trim() || `${preset.fundIds.length} funds saved on ${new Date().toLocaleDateString()}`,
    fundIds: preset.fundIds,
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(record);

    request.onsuccess = () => {
      resolve(record);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Delete a custom preset from IndexedDB.
 */
export async function deleteCustomPreset(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to delete custom preset from IndexedDB:', error);
    return false;
  }
}
