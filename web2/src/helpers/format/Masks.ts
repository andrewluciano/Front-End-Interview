export const formatPhone = (phone: string | undefined): string => {
  if (!phone) return "Não informado";
  const value = phone.replace(/\D/g, "");
  // Máscara (00) 00000-0000 baseada em PhoneMaskCustom
  return value.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};
