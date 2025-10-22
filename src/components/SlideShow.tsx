// @ts-nocheck
import { useEffect, useState, useRef } from "react";

interface TOCItem {
    title: string;
    h: number;
    v: number;
    isVertical: boolean;
    imageUrl?: string; // 幻灯片的缩略图URL
}

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
    // 默认的本地 Markdown 内容
    const defaultMarkdown = `### 魔都风采

上海，这座充满魅力的国际化大都市，宛如一颗璀璨的东方明珠，闪耀在世界的舞台上。它是繁华与现代的象征，高楼大厦林立，车水马龙，展现出无尽的活力与机遇。外滩的万国建筑见证了历史的沧桑变迁，浦东的摩天大楼则代表着未来的无限可能。在这里，传统与现代完美融合，古老的弄堂与时尚的购物中心相邻而居，让人感受到独特的文化氛围。
![The image](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/3965ea4b25274f049df6d48fbcb4d965.png)
---

### 文化盛宴

上海不仅是经济的中心，也是文化的摇篮。这里汇聚了来自世界各地的艺术、音乐、戏剧和电影。上海博物馆珍藏着无数的历史文物，让人们领略到中华文化的博大精深；上海大剧院则经常上演世界级的歌剧、芭蕾舞和音乐会，为观众带来一场场视听盛宴。此外，上海还有许多创意园区和艺术街区，如田子坊和M50，充满了艺术气息和创意灵感。
![The image](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/0cbbfb20a54748329257cd2bc48838b4.png)
---

### 美食天堂

上海的美食文化丰富多样，融合了各地的特色风味。从传统的本帮菜到国际化的美食，应有尽有。生煎包、小笼包、蟹壳黄等特色小吃让人垂涎欲滴；而在高级餐厅里，你可以品尝到精致的法式大餐、正宗的意大利披萨和美味的日本料理。此外，上海的夜市也是美食爱好者的天堂，各种小吃摊位琳琅满目，让你在品尝美食的同时，感受这座城市的热闹与烟火气。
很遗憾，由于调用图片生成的QPS限制，暂时无法为你生成“上海夜市，各种美食摊位热闹非凡”的图片。你可以稍后再尝试让我生成这张图片。

---

### 购物之都

上海是购物的天堂，拥有众多大型购物中心和商业街。南京路步行街是上海最著名的商业街之一，这里汇聚了各种国内外知名品牌，是购物和休闲的好去处。淮海路则以时尚和高端著称，有许多设计师品牌和精品店。此外，上海还有许多特色的购物街区，如豫园商城，你可以在这里购买到传统的手工艺品和纪念品。
![The image](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/fddc3f2a08dd4f9e90fd0273632af96a.png)
---

### 休闲胜地

上海有许多美丽的公园和休闲场所，为人们提供了放松身心的好去处。世纪公园是上海最大的城市公园之一，这里绿树成荫，湖水清澈，是散步、跑步和野餐的好地方。此外，上海还有许多历史悠久的园林，如豫园，园内亭台楼阁、假山池沼，充满了江南水乡的韵味。
![The image](https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/f45f8ec9387a4500b5d253ded75b975f.png)
`;


    const [md, setMD] = useState(defaultMarkdown);

    const revealRef = useRef(null);
    const slidesRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [showToc, setShowToc] = useState(false);
    const [activeSlide, setActiveSlide] = useState({ h: 0, v: 0 });
    const [showEditor, setShowEditor] = useState(false);
    const [editingMd, setEditingMd] = useState(md);
    const [useAPI, setUseAPI] = useState(() => {
        return localStorage.getItem('useStreamingAPI') === 'true';
    });

    // 流式调用
    const callRealStreamingAPI = async () => {
        const response = await fetch('https://api.coze.cn/v1/workflow/stream_run', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer pat_a4hWiMSUqrWQFe8bEuJRYIforSx78ahLdLMpTCl9G8KfZ3qg9WkGt8M8xNlG713I',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                workflow_id: '7563578510242562100',
                parameters: {
                    input: '介绍上海'
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('ReadableStream not supported');
        }

        const decoder = new TextDecoder('utf-8');
        let accumulated = ''; // 累积的 Markdown 内容
        let buffer = '';      // SSE 数据缓冲区
        let lastUpdateTime = Date.now();

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                console.log('Stream complete');
                console.log('Final markdown:', accumulated);
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // 按行处理 SSE 数据
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 保留最后一行（可能不完整）

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const jsonStr = line.substring(6); // 去掉 "data: " 前缀
                        const data = JSON.parse(jsonStr);

                        // 提取 content 字段并累积
                        if (data.content) {
                            accumulated += data.content;
                        }
                    } catch (e) {
                        console.warn('Failed to parse SSE data:', line);
                    }
                }
            }

            // 限制更新频率，避免过度渲染
            const now = Date.now();
            if (now - lastUpdateTime > 500) {  // 提高频率限制，减少重渲染
                updateMarkdownContent(accumulated);
                lastUpdateTime = now;
            }
        }

        // 确保最后一次更新
        initMarkdown(accumulated);
        setMD(accumulated);
        console.log('Final markdown:', accumulated);
    };

    // 流式更新 Markdown 内容（不重新初始化）
    const updateMarkdownContent = (content: string) => {
        if (!isInitialized || !window.Reveal) {
            // 如果还未初始化，则执行初始化
            initMarkdown(content);
            return;
        }

        try {
            // 只更新 textarea 的内容
            const textarea = slidesRef.current?.querySelector('textarea[data-template]');
            if (textarea) {
                textarea.textContent = content;
                
                // 调用 Reveal.sync() 重新解析 Markdown 并更新幻灯片
                window.Reveal.sync();
                
                // 更新目录（因为内容可能改变）
                generateTOC();
                
                console.log('Markdown 内容已更新，长度:', content.length);
            }
        } catch (error) {
            console.error('更新 Markdown 内容失败:', error);
        }
    };

    const initMarkdown = (initMd: string) => {
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
                        <textarea data-template>${initMd}</textarea>
                    </section>
                `;
            }

            // 初始化 Reveal.js
            window.Reveal.initialize({
                plugins: [window.RevealMarkdown, window.RevealHighlight, window.RevealNotes],
                hash: true,
                transition: 'slide',
                slideNumber: true,
                center: false, // 禁用垂直居中,避免内容超出
                controls: true,
                progress: true,
                width: '100%',
                height: '100%',
                margin: 0.04,
                minScale: 0.2,
                maxScale: 2.0,
                markdown: {
                    smartypants: true
                }
            }).then(() => {
                console.log('Reveal.js 初始化成功');
                setIsInitialized(true);

                // 跳转到第一页
                window.Reveal.slide(0, 0);

                // 生成目录
                generateTOC();

                // 监听幻灯片切换事件
                window.Reveal.on('slidechanged', (event: any) => {
                    setActiveSlide({ h: event.indexh, v: event.indexv });
                });
            });

        } catch (error) {
            console.error('Reveal.js 初始化失败:', error);
            alert('初始化失败: ' + error.message);
        }
    }

    // 生成目录函数
    const generateTOC = () => {
        if (!window.Reveal) return;

        const slides = window.Reveal.getSlides();
        const items: TOCItem[] = [];

        slides.forEach((slide: HTMLElement) => {
            const indices = window.Reveal.getIndices(slide);
            const h = indices.h;
            const v = indices.v;

            // 提取标题
            let title = '';
            const h1 = slide.querySelector('h1');
            const h2 = slide.querySelector('h2');
            const h3 = slide.querySelector('h3');
            const h4 = slide.querySelector('h4');

            if (h1) title = h1.textContent || '';
            else if (h2) title = h2.textContent || '';
            else if (h3) title = h3.textContent || '';
            else if (h4) title = h4.textContent || '';
            else title = `幻灯片 ${h + 1}${v > 0 ? '.' + (v + 1) : ''}`;

            // 提取第一张图片作为缩略图
            let imageUrl = '';
            const img = slide.querySelector('img');
            if (img) {
                imageUrl = img.src || '';
            }

            items.push({
                title,
                h,
                v,
                isVertical: v > 0,
                imageUrl
            });
        });

        setTocItems(items);
    };

    // 跳转到指定幻灯片
    const goToSlide = (h: number, v: number) => {
        if (window.Reveal) {
            window.Reveal.slide(h, v);
            setShowToc(false);
        }
    };

    // 切换数据源
    const toggleDataSource = () => {
        const newUseAPI = !useAPI;
        setUseAPI(newUseAPI);
        localStorage.setItem('useStreamingAPI', String(newUseAPI));
        
        // 切换后立即加载对应的内容
        if (newUseAPI) {
            callRealStreamingAPI();
        } else {
            initMarkdown(defaultMarkdown);
        }
    };

    // 注入自定义样式
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            /* 防止内容超出 */
            .reveal .slides section {
                width: 100%;
                height: 100%;
                overflow: auto !important;
                max-height: 100vh !important;
                padding: 20px !important;
                box-sizing: border-box !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                text-align: center !important;
            }
            
            /* 控制字体大小 - 更紧凑的布局 */
            .reveal .slides section h1 {
                font-size: 1.8em !important;
                margin-bottom: 0.3em !important;
            }
            
            .reveal .slides section h2 {
                font-size: 1.5em !important;
                margin-bottom: 0.3em !important;
            }
            
            .reveal .slides section h3 {
                font-size: 1.2em !important;
                margin-bottom: 0.25em !important;
            }
            
            .reveal .slides section p {
                font-size: 0.85em !important;
                line-height: 1.4 !important;
                margin-bottom: 0.5em !important;
            }
            
            /* 控制图片大小 - 更紧凑 */
            .reveal .slides section img {
                max-width: 70% !important;
                max-height: 35vh !important;
                object-fit: contain !important;
                margin: 8px auto !important;
                display: block !important;
            }
            
            /* 自定义滚动条样式 */
            .reveal .slides section::-webkit-scrollbar {
                width: 8px;
            }
            
            .reveal .slides section::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .reveal .slides section::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
            }
            
            .reveal .slides section::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // 自动初始化
    useEffect(() => {
        if (useAPI) {
            // 使用流式接口
            callRealStreamingAPI();
        } else {
            // 使用本地默认内容
            initMarkdown(defaultMarkdown);
        }
    }, []);

    // 应用编辑的内容
    const applyMarkdown = () => {
        setMD(editingMd);
        initMarkdown(editingMd);
        setShowEditor(false);
    };

    return (
        <>
            {/* Markdown 编辑器 */}
            {showEditor && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0, 0, 0, 0.95)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <h2 style={{ color: 'white', margin: 0 }}>编辑 Markdown</h2>
                        <div>
                            <button
                                onClick={applyMarkdown}
                                style={{
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    marginRight: '10px'
                                }}
                            >
                                ✅ 应用更改
                            </button>
                            <button
                                onClick={() => {
                                    setShowEditor(false);
                                    setEditingMd(md); // 取消时恢复原内容
                                }}
                                style={{
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    borderRadius: '5px',
                                    fontSize: '16px'
                                }}
                            >
                                ❌ 取消
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={editingMd}
                        onChange={(e) => setEditingMd(e.target.value)}
                        style={{
                            flex: 1,
                            background: '#1e1e1e',
                            color: '#d4d4d4',
                            border: '1px solid #444',
                            borderRadius: '5px',
                            padding: '15px',
                            fontSize: '14px',
                            fontFamily: 'Monaco, Consolas, monospace',
                            resize: 'none',
                            outline: 'none'
                        }}
                        spellCheck={false}
                    />
                </div>
            )}

            {/* 左上角目录按钮 */}
            <div className="slideshow__toc-wrapper">
                <button
                    onClick={() => setShowToc(!showToc)}
                    className="slideshow__toc-button"
                >
                    📑 目录
                </button>

                {showToc && (
                    <div className="toc-container slideshow__toc-container">
                        <h3 className="slideshow__toc-title">
                            幻灯片目录
                        </h3>

                        {tocItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => goToSlide(item.h, item.v)}
                                className={`slideshow__toc-item ${
                                    item.isVertical ? 'slideshow__toc-item--vertical' : ''
                                } ${
                                    activeSlide.h === item.h && activeSlide.v === item.v ? 'slideshow__toc-item--active' : ''
                                }`}
                            >
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="slideshow__toc-item-image"
                                    />
                                )}
                                <span className="slideshow__toc-item-title">{item.title}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="reveal" ref={revealRef} style={{ width: '100vw', height: '100vh' }}>
                <div className="slides" ref={slidesRef}>
                    {/* 内容将通过 JavaScript 动态插入 */}
                </div>
            </div>

            {/* 控制按钮组 */}
            <div className="slideshow__controls">
                <button
                    onClick={toggleDataSource}
                    className={`slideshow__control-button ${
                        useAPI ? 'slideshow__control-button--api' : 'slideshow__control-button--local'
                    }`}
                >
                    {useAPI ? '🌐 接口模式' : '📄 本地模式'}
                </button>
                <button
                    onClick={() => {
                        setEditingMd(md);
                        setShowEditor(true);
                    }}
                    className="slideshow__control-button slideshow__control-button--edit"
                >
                    ✏️ 编辑 Markdown
                </button>
                <button
                    onClick={() => {
                        window.print();
                    }}
                    className="slideshow__control-button slideshow__control-button--pdf"
                >
                    📄 导出 PDF
                </button>
            </div>
        </>
    );
};

export default StreamMarkdown;
