export const prefetch = (importFunc: () => Promise<unknown>): void => {
  void importFunc();
};
