// @ts-nocheck
import { useEffect, useState, useRef } from "react";

interface TOCItem {
    title: string;
    h: number;
    v: number;
    isVertical: boolean;
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
        console.log('开始初始化 Reveal.js...');
        console.log('MD 内容:', initMd);
        console.log('MD 内容长度:', initMd.length);

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
                center: true,
                controls: true,
                progress: true,
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

            items.push({
                title,
                h,
                v,
                isVertical: v > 0
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

            {/* 目录容器 */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000
            }}>
                <button
                    onClick={() => setShowToc(!showToc)}
                    style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        border: '2px solid white',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        fontSize: '16px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)';
                    }}
                >
                    📑 目录
                </button>

                {showToc && (
                    <div style={{
                        position: 'absolute',
                        top: '50px',
                        right: '0',
                        background: 'rgba(0, 0, 0, 0.95)',
                        border: '2px solid white',
                        borderRadius: '5px',
                        padding: '15px',
                        minWidth: '250px',
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        <h3 style={{
                            margin: '0 0 10px 0',
                            color: 'white',
                            fontSize: '18px',
                            borderBottom: '1px solid white',
                            paddingBottom: '5px'
                        }}>
                            幻灯片目录
                        </h3>

                        {tocItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => goToSlide(item.h, item.v)}
                                style={{
                                    padding: '8px 10px',
                                    margin: '5px 0',
                                    cursor: 'pointer',
                                    color: 'white',
                                    borderRadius: '3px',
                                    transition: 'background 0.3s',
                                    marginLeft: item.isVertical ? '20px' : '0',
                                    fontSize: item.isVertical ? '14px' : '16px',
                                    opacity: item.isVertical ? 0.8 : 1,
                                    background: (activeSlide.h === item.h && activeSlide.v === item.v)
                                        ? 'rgba(66, 175, 250, 0.5)'
                                        : 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeSlide.h !== item.h || activeSlide.v !== item.v) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeSlide.h !== item.h || activeSlide.v !== item.v) {
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {item.title}
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
            <div style={{
                position: 'fixed',
                top: '10px',
                left: '10px',
                zIndex: 1000,
                display: 'flex',
                gap: '10px'
            }}>
                <button
                    onClick={toggleDataSource}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: useAPI ? '#4caf50' : '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    {useAPI ? '🌐 接口模式' : '📄 本地模式'}
                </button>
                <button
                    onClick={() => {
                        setEditingMd(md);
                        setShowEditor(true);
                    }}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    ✏️ 编辑 Markdown
                </button>
                <button
                    onClick={initMarkdown}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007acc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    {isInitialized ? '🔄 重新渲染' : '▶️ 渲染'}
                </button>
            </div>

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
                状态: {isInitialized ? '已初始化' : '未初始化'}<br />
                Reveal.js: {typeof window.Reveal !== 'undefined' ? '已加载' : '未加载'}<br />
                内容长度: {md.length} 字符<br />
                目录项: {tocItems.length} 个
            </div>
        </>
    );
};

export default StreamMarkdown;
