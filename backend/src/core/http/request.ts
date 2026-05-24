export const getParam = (value: string | string[] | undefined): string => {
  if (!value) throw new Error("Missing param");
  return Array.isArray(value) ? value[0] : value;
};
