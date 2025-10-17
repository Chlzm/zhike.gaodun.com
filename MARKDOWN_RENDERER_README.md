# Markdown 实时渲染器使用说明

## 📦 安装依赖

在运行项目之前，请先安装依赖：

```bash
npm install
```

或者使用 yarn：

```bash
yarn install
```

## 🚀 运行项目

```bash
npm start
```

项目将在 http://localhost:3000 启动

## 🎯 功能说明

### 1. 自动加载示例
- 页面启动后会自动加载 `/example.md` 示例文件
- 你可以看到完整的 Markdown 渲染效果

### 2. 自定义 API
你可以在输入框中输入任意返回 Markdown 文本的 API 地址，例如：
- `/example.md` - 本地示例文件
- `https://raw.githubusercontent.com/user/repo/main/README.md` - GitHub 文件
- `https://your-api.com/markdown` - 你的自定义 API

### 3. 实时刷新
点击"获取数据"按钮即可重新获取并渲染 Markdown 内容

### 4. 错误处理
如果 API 请求失败，页面会显示错误信息

## 🛠️ 技术栈

- **React 19.2.0** - 前端框架
- **TypeScript** - 类型安全
- **react-markdown** - Markdown 渲染库
- **Create React App** - 项目脚手架

## 📝 API 要求

你的 API 需要满足以下条件：
1. 返回纯文本格式的 Markdown 内容
2. 支持 CORS（如果是跨域请求）
3. Content-Type 可以是 `text/plain` 或 `text/markdown`

## 🎨 自定义样式

如需修改样式，请编辑 `src/MarkdownRenderer.css` 文件

## 📂 文件结构

```
src/
├── App.tsx                    # 主应用组件
├── MarkdownRenderer.tsx       # Markdown 渲染器组件
├── MarkdownRenderer.css       # 样式文件
public/
├── example.md                 # 示例 Markdown 文件
```

## 🔧 自定义配置

你可以在 `App.tsx` 中传入自定义的默认 API 地址：

```tsx
<MarkdownRenderer apiUrl="https://your-api.com/markdown" />
```

## 💡 示例 API 服务端代码

如果你需要创建一个简单的 API 服务，可以参考以下 Node.js 示例：

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/markdown', (req, res) => {
  const markdown = `
# Hello World

This is a **dynamic** markdown content from API!
  `;
  res.type('text/plain').send(markdown);
});

app.listen(3001, () => {
  console.log('API server running on http://localhost:3001');
});
```

## 🐛 常见问题

### CORS 错误
如果遇到 CORS 错误，需要确保你的 API 服务器配置了正确的 CORS 头：
```
Access-Control-Allow-Origin: *
```

### 加载失败
- 检查 API 地址是否正确
- 检查网络连接
- 查看浏览器控制台错误信息

## 📄 许可证

MIT License
