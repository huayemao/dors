export function copyToClipboard(text) {
  // 创建一个临时的textarea元素
  const textarea = document.createElement("textarea");
  textarea.value = text;

  // 将textarea元素添加到DOM中
  document.body.appendChild(textarea);

  // 选择并复制文本
  textarea.select();
  document.execCommand("copy");

  // 删除临时的textarea元素
  document.body.removeChild(textarea);
}

// navigator.clipboard
//   .writeText(text)
//   .then(() => {
//     console.log("文本已成功复制到剪贴板");
//   })
//   .catch((error) => {
//     console.error("复制到剪贴板时出错:", error);
//   });
