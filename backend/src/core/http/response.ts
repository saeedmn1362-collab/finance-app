export const successResponse = <T>(data: T, meta?: any) => {
  return {
    success: true,
    data,
    meta,
  };
};
