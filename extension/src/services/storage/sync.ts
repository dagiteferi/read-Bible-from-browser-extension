export const getSync = async (key: string): Promise<any> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => {
      resolve(result[key]);
    });
  });
};

export const setSync = async (key: string, value: any): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve();
    });
  });
};

export const removeSync = async (key: string): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.sync.remove(key, () => {
      resolve();
    });
  });
};
