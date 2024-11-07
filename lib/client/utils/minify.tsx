export const minify = (str: string) => {
  const regex = /(>)\s+(?=<)/g;
  let minified = str.replace(regex, "$1");
  return minified;
};
