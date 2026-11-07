export const formatFileSize = (file_size: number): string => {
  if (file_size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(file_size) / Math.log(k));
  return parseFloat((file_size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
