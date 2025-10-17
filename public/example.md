# Markdown 实时渲染示例

## 这是一个示例 Markdown 文档

### 功能特性

这个页面支持以下功能：

1. **实时接口调用** - 从 API 获取 Markdown 内容
2. **动态渲染** - 自动将 Markdown 转换为 HTML
3. **样式美化** - 精美的排版和代码高亮
4. **加载状态** - 友好的加载提示
5. **错误处理** - 完善的错误提示机制

### 使用方式

只需在输入框中填入返回 Markdown 数据的 API 地址，点击"获取数据"按钮即可。

### 代码示例

```javascript
const fetchMarkdown = async () => {
  const response = await fetch(apiUrl);
  const data = await response.text();
  return data;
};
```

### 支持的 Markdown 语法

- **粗体文本**
- *斜体文本*
- `行内代码`
- [链接](https://example.com)
- 图片
- 列表
- 表格
- 引用块

> 这是一段引用文本，用于展示引用块的样式效果。

### 表格示例

| 功能 | 状态 | 说明 |
|------|------|------|
| API 调用 | ✅ | 支持任意返回文本的 API |
| Markdown 渲染 | ✅ | 完整支持标准 Markdown 语法 |
| 实时更新 | ✅ | 点击按钮即时刷新内容 |
| 响应式设计 | ✅ | 适配各种屏幕尺寸 |

---

**祝你使用愉快！** 🎉
