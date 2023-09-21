export const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));

  return `${(bytes / Math.pow(k, i)).toFixed(0)} ${sizes[i]}`;
};
