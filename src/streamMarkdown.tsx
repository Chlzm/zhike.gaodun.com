// @ts-nocheck
import { useEffect, useState, useRef } from "react";

// 声明全局变量类型
declare global {
    interface Window {
        Reveal: any;
        RevealMarkdown: any;
        RevealHighlight: any;
        RevealNotes: any;
    }
}

const StreamMarkdown = () => {
    const [md, setMD] = useState(`# 欢迎使用 Markdown 幻灯片

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

## 谢谢观看！！！

**按空格键** 继续浏览`);

    const revealRef = useRef(null);
    const slidesRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const initMarkdown = () => {
        console.log('开始初始化 Reveal.js...');
        console.log('MD 内容:', md);
        console.log('MD 内容长度:', md.length);
        
        // 检查 Reveal 是否已加载
        if (typeof window.Reveal === 'undefined') {
            console.error('Reveal.js 未加载');
            alert('Reveal.js 未加载，请刷新页面重试');
            return;
        }

        try {
            // 销毁之前的实例
            if (isInitialized && window.Reveal.destroy) {
                window.Reveal.destroy();
                console.log('销毁之前的实例');
            }

            // 清空并重新创建 slides 内容
            if (slidesRef.current) {
                // 直接设置 innerHTML，让 Reveal.js 处理 Markdown
                slidesRef.current.innerHTML = `
                    <section data-markdown data-separator="---" data-separator-vertical="--" data-separator-notes="^Note:">
                        <textarea data-template>${md}</textarea>
                    </section>
                `;
            }

            // 初始化 Reveal.js
            window.Reveal.initialize({
                plugins: [window.RevealMarkdown, window.RevealHighlight, window.RevealNotes],
                hash: true,
                transition: 'slide',
                slideNumber: true,
                center: true,
                controls: true,
                progress: true,
                markdown: {
                    smartypants: true
                }
            }).then(() => {
                console.log('Reveal.js 初始化成功');
                setIsInitialized(true);
            });

        } catch (error) {
            console.error('Reveal.js 初始化失败:', error);
            alert('初始化失败: ' + error.message);
        }
    }

    // 自动初始化
    useEffect(() => {
        const timer = setTimeout(() => {
            initMarkdown();
        }, 1000); // 等待1秒确保 Reveal.js 加载完成

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="reveal" ref={revealRef} style={{ width: '100vw', height: '100vh' }}>
            <div className="slides" ref={slidesRef}>
                {/* 内容将通过 JavaScript 动态插入 */}
            </div>
            <button 
                onClick={initMarkdown}
                style={{
                    position: 'fixed',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    backgroundColor: '#007acc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                }}
            >
                {isInitialized ? '重新渲染' : '渲染'}
            </button>
            
            {/* 调试信息 */}
            <div style={{
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                fontSize: '12px',
                borderRadius: '5px',
                zIndex: 1000
            }}>
                状态: {isInitialized ? '已初始化' : '未初始化'}<br/>
                Reveal.js: {typeof window.Reveal !== 'undefined' ? '已加载' : '未加载'}<br/>
                内容长度: {md.length} 字符
            </div>
        </div>
    );
};

export default StreamMarkdown;
