import { useEffect } from "react";

const StreamMarkdown = () => {
    const markdown = `# 欢迎使用 Markdown 幻灯片

这是第一页幻灯片

---

## 第二页：功能介绍

- 支持 Markdown 语法
- 使用 \`---\` 分隔幻灯片
- 使用 \`--\` 创建垂直幻灯片

---

## 第三页：代码示例

\`\`\`javascript
function hello() {
    console.log('Hello, World!');
}
\`\`\`

---

## 第四页：列表展示

1. 第一项
2. 第二项
3. 第三项

Note: 这是演讲者备注

---

## 第五页：引用文本

> 这是一段引用文本  
> 可以展示重要信息

---

### 垂直幻灯片示例

向下滑动查看更多

--

#### 这是垂直的第二页

使用 \`--\` 创建垂直幻灯片

--

#### 这是垂直的第三页

按方向键导航

---

## 谢谢观看！

**按空格键** 继续浏览`

    useEffect(() => {
        // 确保 DOM 完全加载后再初始化
        const timer = setTimeout(() => {
            if (window.Reveal && !window.Reveal.isReady()) {
                window.Reveal.initialize({
                    plugins: [(window as any).RevealMarkdown, (window as any).RevealHighlight, (window as any).RevealNotes],
                    // 配置选项
                    hash: true,
                    transition: 'slide', // none/fade/slide/convex/concave/zoom
                    slideNumber: true,
                    center: true,
                    controls: true,
                    progress: true
                });
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            // 清理 Reveal 实例
            if (window.Reveal && window.Reveal.isReady()) {
                window.Reveal.destroy();
            }
        };
    }, []);
    return (
        <div className="reveal" style={{ width: '100vw', height: '100vh' }}>
            <div className="slides">
                <section data-markdown data-separator="^---$" data-separator-vertical="^--$">
                    <textarea data-template defaultValue={markdown} />
                </section>
            </div>
        </div>
    );
};

export default StreamMarkdown;
