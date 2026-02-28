export const handleError = (error: any, context: string = 'An unexpected error occurred') => {
  console.error(`Error in ${context}:`, error);
};

export const getErrorMessage = (error: any): string => {
  if (error.response && error.response.data && error.response.data.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unknown error occurred.';
};
