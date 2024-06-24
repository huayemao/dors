export const downloadAsFile = (url: string, fileName: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
