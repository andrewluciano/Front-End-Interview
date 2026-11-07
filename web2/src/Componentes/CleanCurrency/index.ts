export const cleanCurrency = (value: FormDataEntryValue): number => {
  // Ensure it's a string, then remove "R$", spaces, and dots. Finally, replace comma with dot for float parsing.
  const strValue = value as string;
  return Number(strValue.replace(/[R$\s.]/g, "").replace(",", "."));
};
