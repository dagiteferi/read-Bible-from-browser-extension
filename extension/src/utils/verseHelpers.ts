export const formatVerseReference = (book: string, chapter: number, verseStart: number, verseEnd?: number): string => {
  if (verseEnd && verseEnd !== verseStart) {
    return `${book} ${chapter}:${verseStart}-${verseEnd}`;
  }
  return `${book} ${chapter}:${verseStart}`;
};

export const getAmharicBookName = (englishName: string): string => {
  // This would ideally come from a mapping or API
  // Placeholder for now
  switch (englishName.toLowerCase()) {
    case 'psalms': return 'መዝሙረ ዳዊት';
    case 'john': return 'ዮሐንስ';
    default: return englishName;
  }
};
