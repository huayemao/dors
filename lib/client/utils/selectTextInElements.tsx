"use client";
// 函数：选中页面上所有匹配的元素的文本内容
export function selectTextInElements(selector) {
    // 获取所有匹配的元素
    var elements = document.querySelectorAll(selector);
    var range = document.createRange();
    var selection = window.getSelection();

    // 遍历所有匹配的元素
    elements.forEach(function (element) {
        // 创建一个新的选择范围
        range.selectNodeContents(element);
        // 清除之前的选择并添加新的选择范围
        // @ts-ignore
        selection.removeAllRanges();
        // @ts-ignore
        selection.addRange(range);
    });
}
