export const handleError = (error: unknown): Error => {
    if (error instanceof Error) {
      return error;
    }
    return new Error('Unknown error occurred');
  };