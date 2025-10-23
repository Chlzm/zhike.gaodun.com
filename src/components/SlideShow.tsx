// @ts-nocheck
import { useEffect, useState, useRef } from "react";

interface TOCItem {
    title: string;
    h: number;
    v: number;
    isVertical: boolean;
    imageUrl?: string; // 幻灯片的缩略图URL
}

interface SlideShowProps {
    outline?: string; // 从OutlineStream传入的大纲内容
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

const StreamMarkdown = ({ outline }: SlideShowProps) => {
    const [md, setMD] = useState(outline || '');

    const revealRef = useRef(null);
    const slidesRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [showToc, setShowToc] = useState(false);
    const [activeSlide, setActiveSlide] = useState({ h: 0, v: 0 });
    const [showEditor, setShowEditor] = useState(false);
    const [editingMd, setEditingMd] = useState(md);

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
        if (outline) {
            initMarkdown(outline);
        }
    }, [outline]);

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
