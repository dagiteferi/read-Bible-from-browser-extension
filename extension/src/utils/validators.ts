export const isValidTimeFormat = (time: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

export const isValidChapter = (chapter: number): boolean => {
  return chapter > 0;
};

export const isValidVerse = (verse: number): boolean => {
  return verse > 0;
};
