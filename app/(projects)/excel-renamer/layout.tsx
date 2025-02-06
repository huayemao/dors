export const metadata = {
  title: 'Excel 文件重命名助手',
  description: '一个简单的工具，可以根据 Excel 文件内容自动重命名文件。通过读取表格首行内容，智能生成更有意义的文件名。',
  keywords: ['Excel', '文件重命名', '批量处理', '自动化工具', '文件管理'],
};

export default function ExcelRenamerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 