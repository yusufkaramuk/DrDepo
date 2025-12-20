const STORAGE_KEY = 'ilac_stok_data';

export const StorageManager = {
    save: (data) => {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(STORAGE_KEY, jsonData);
            console.log(`[StorageManager] Saved ${data.length} items to localStorage`);
            return true;
        } catch (e) {
            console.error("[StorageManager] Save failed:", e);
            return false;
        }
    },

    load: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            const parsed = data ? JSON.parse(data) : [];
            console.log(`[StorageManager] Loaded ${parsed.length} items from localStorage`);
            return parsed;
        } catch (e) {
            console.error("[StorageManager] Load failed:", e);
            return [];
        }
    },

    exportToJSON: (data) => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ilac-stok-yedek-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importFromJSON: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error("Invalid JSON file"));
                }
            };
            reader.onerror = () => reject(new Error("File read error"));
            reader.readAsText(file);
        });
    }
};
