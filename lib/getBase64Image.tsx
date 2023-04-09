export async function getBase64Image(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const contentType = response.headers.get("content-type");
  const dataUrl = `data:${contentType};base64,${base64}`;
  return dataUrl;
}
