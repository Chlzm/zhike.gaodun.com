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
    onBack?: () => void;
    currentStep?: number;
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

const StreamMarkdown = ({ currentStep, outline, onBack }: SlideShowProps) => {
    const [md, setMD] = useState(outline || '');

    const revealRef = useRef(null);
    const slidesRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [activeSlide, setActiveSlide] = useState({ h: 0, v: 0 });
    const [showEditor, setShowEditor] = useState(false);
    const [editingMd, setEditingMd] = useState(md);
    const [canGoLeft, setCanGoLeft] = useState<boolean>(false);
    const [canGoRight, setCanGoRight] = useState<boolean>(false);
    const [currentSlideNumber, setCurrentSlideNumber] = useState<string>('1/1');
    const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);

    const initMarkdown = (initMd: string) => {
        // 设置全局加载状态
        setIsGlobalLoading(true);
        
        // 检查 Reveal 是否已加载
        if (typeof window.Reveal === 'undefined') {
            console.error('Reveal.js 未加载');
            alert('Reveal.js 未加载，请刷新页面重试');
            setIsGlobalLoading(false);
            return;
        }

        try {
            // 完全重置状态
            setIsInitialized(false);
            setTocItems([]);
            setActiveSlide({ h: 0, v: 0 });
            setCanGoLeft(false);
            setCanGoRight(false);
            setCurrentSlideNumber('1/1');

            // 销毁之前的实例并清理事件监听器
            if (window.Reveal && window.Reveal.isReady && window.Reveal.isReady()) {
                // 移除所有事件监听器
                // window.Reveal.off('slidechanged');
                // window.Reveal.destroy();
                // console.log('销毁之前的实例');
            }

            // 确保完全清空slides容器
            if (slidesRef.current) {
                slidesRef.current.innerHTML = '';
                // 强制重新渲染
                setTimeout(() => {
                    if (slidesRef.current) {
                        // 直接设置 innerHTML，让 Reveal.js 处理 Markdown
                        slidesRef.current.innerHTML = `
                            <section data-markdown data-separator="---" data-separator-vertical="--" data-separator-notes="^Note:">
                                <textarea data-template>${initMd}</textarea>
                            </section>
                        `;
                        // 延迟初始化Reveal.js，确保DOM更新完成
                        setTimeout(() => initRevealInstance(), 100);
                    }
                }, 50);            }
        } catch (error) {
            console.error('Reveal.js 初始化失败:', error);
            alert('初始化失败: ' + error.message);
        }
    }

    // 独立的Reveal.js初始化函数
    const initRevealInstance = () => {
        try {

            // 初始化 Reveal.js
            window.Reveal.initialize({
                plugins: [window.RevealMarkdown, window.RevealHighlight, window.RevealNotes],
                hash: true,
                // transition: 'none', // 禁用滑动过渡效果
                slideNumber: false, // 隐藏默认页码
                center: false, // 禁用垂直居中,避免内容超出
                controls: false, // 隐藏默认导航控件
                progress: false, // 隐藏进度条
                navigationMode: 'vertical', // 设置为垂直导航模式
                width: '100%',
                height: '100%',
                margin: 0.04,
                minScale: 0.2,
                maxScale: 2.0,
                // PDF 导出配置
                pdf: true,
                pdfMaxPagesPerSlide: 1,
                pdfSeparateFragments: false,
                markdown: {
                    smartypants: true
                }
            }).then(() => {
                console.log('Reveal.js 初始化成功');
                setIsInitialized(true);

                // 检测是否是PDF导出模式
                const isPrintMode = window.location.search.includes('print-pdf');
                if (isPrintMode) {
                    // 在PDF模式下，确保所有幻灯片都显示
                    document.body.classList.add('print-pdf');
                    // 移除导航和控制元素
                    const header = document.querySelector('.slideshow__header');
                    const sidebar = document.querySelector('.slideshow__sidebar');
                    if (header) header.style.display = 'none';
                    if (sidebar) sidebar.style.display = 'none';
                }

                // 跳转到第一页
                window.Reveal.slide(0, 0);

                // 生成目录
                generateTOC();

                // 监听幻灯片切换事件
                window.Reveal.on('slidechanged', (event: any) => {
                    setActiveSlide({ h: event.indexh, v: event.indexv });
                    updateNavigationState();
                });

                // 初始化导航状态
                updateNavigationState();
                
                // 延迟500ms后关闭全局加载状态
                setTimeout(() => {
                    setIsGlobalLoading(false);
                }, 500);
            }).catch((error: any) => {
                console.error('Reveal.js 初始化失败:', error);
                alert('初始化失败: ' + error.message);
                setIsInitialized(false);
                setIsGlobalLoading(false);
            });

        } catch (error) {
            console.error('Reveal.js 初始化失败:', error);
            alert('初始化失败: ' + error.message);
            setIsInitialized(false);
            setIsGlobalLoading(false);
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

    // 更新导航状态
    const updateNavigationState = () => {
        if (!window.Reveal) return;
        
        const totalSlides = window.Reveal.getTotalSlides();
        const currentSlide = window.Reveal.getIndices();
        const isFirstSlide = currentSlide.h === 0 && currentSlide.v === 0;
        const isLastSlide = window.Reveal.isLastSlide();
        
        // 计算当前幻灯片序号（从1开始）
        const currentIndex = currentSlide.h + 1;
        const slideNumber = `${currentIndex}/${totalSlides}`;
        
        setCanGoLeft(!isFirstSlide);
        setCanGoRight(!isLastSlide);
        setCurrentSlideNumber(slideNumber);
    };

    // 跳转到指定幻灯片
    const goToSlide = (h: number, v: number) => {
        if (window.Reveal) {
            window.Reveal.slide(h, v);
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
                overflow-y: auto !important;
                overflow-x: hidden !important;
                max-height: 100vh !important;
                padding: 24px !important;
                padding-top: 48px !important;
                box-sizing: border-box !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: flex-start !important;
                align-items: flex-start !important;
                text-align: left !important;
            }
            
            /* 标题居中显示 */
            .reveal .slides section h1,
            .reveal .slides section h2,
            .reveal .slides section h3,
            .reveal .slides section h4 {
                text-align: center !important;
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }
            
            /* 控制字体大小 - 更紧凑的布局 */
            .reveal .slides section h1 {
                text-align: left !important;
                font-size: 36px !important;
                margin-bottom: 40px !important;
            }
            
            .reveal .slides section h2 {
                text-align: left !important;
                font-size: 28px !important;
                margin-bottom: 32px !important;
            }
            
            .reveal .slides section h3 {
                text-align: left !important;
                font-size: 20px !important;
                margin-bottom: 24px !important;
            }
            
            .reveal .slides section h4 {
                text-align: left !important;
                font-size: 18px !important;
                margin-bottom: 16px !important;
            }
            
            /* 段落和列表项从左往右展示 */
            .reveal .slides section p,
            .reveal .slides section li {
                display: flex;
                gap: 24px;
                font-size: 16px !important;
                line-height: 1.5 !important;
                margin-bottom: 8px !important;
                text-align: left !important;
            }
            
            /* 列表和引用块左对齐 */
            .reveal .slides section ul,
            .reveal .slides section ol {
                display: block;
                text-align: left !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                margin: unset !important;
                padding-inline-start: 0 !important;
            }
            
            .reveal .slides section blockquote {
                text-align: left !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }
            
            /* 控制图片大小 - 更紧凑 */
            .reveal .slides section img {
                max-width: 45% !important;
                object-fit: contain !important;
                margin: 8px 0 !important;
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
        if (outline && currentStep === 3) {
            initMarkdown(outline);
        }
    }, [outline]);

    // useEffect(() => {
    //     return () => {
    //         console.log('destroy， 跨境电商客服看拉升的');
    //         window.Reveal.destroy();
    //     }
    // }, []);

    // 应用编辑的内容
    const applyMarkdown = () => {
        setMD(editingMd);
        initMarkdown(editingMd);
        setShowEditor(false);
    };

    return (
        <>
            {/* 全局页面加载遮罩 */}
            {isGlobalLoading && (
                <div className="slideshow__global-loading">
                    <div className="slideshow__global-loading-content">
                        <div className="slideshow__global-loading-spinner"></div>
                        <div className="slideshow__global-loading-text">正在加载中...</div>
                    </div>
                </div>
            )}
            
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
                        <h2 style={{ color: 'white', margin: 0 }}>编辑</h2>
                        <div>
                            <button
                                onClick={applyMarkdown}
                                style={{
                                    background: '#2d2d2d',
                                    color: '#e0e0e0',
                                    border: '1px solid #404040',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    marginRight: '10px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#3a3a3a';
                                    e.currentTarget.style.borderColor = '#555555';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#2d2d2d';
                                    e.currentTarget.style.borderColor = '#404040';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                应用更改
                            </button>
                            <button
                                onClick={() => {
                                    setShowEditor(false);
                                    setEditingMd(md); // 取消时恢复原内容
                                }}
                                style={{
                                    background: '#2d2d2d',
                                    color: '#e0e0e0',
                                    border: '1px solid #404040',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#3a3a3a';
                                    e.currentTarget.style.borderColor = '#555555';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#2d2d2d';
                                    e.currentTarget.style.borderColor = '#404040';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                 取消
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

            {/* 新布局：上下结构 */}
            <div className="slideshow__layout">
                {/* 顶部 Header */}
                <div className="slideshow__header">
                    <div 
                        className="slideshow__back-button"
                        onClick={onBack}
                    >
                        <img 
                            src={require("../arrow-down 1.png")} 
                            alt="返回" 
                            className="arrow-icon"
                            style={{ transform: 'rotate(90deg)', marginRight: '4px' }}
                        />
                        <span>返回</span>
                    </div>
                    <div className="slideshow__header-controls">
                        <button
                            onClick={() => {
                                setEditingMd(outline);
                                setShowEditor(true);
                            }}
                            className="slideshow__control-button slideshow__control-button--edit"
                        >
                            <span>编辑</span>
                        </button>
                        <button
                            onClick={async () => {
                                // 直接生成PDF并下载
                                try {
                                    // 获取所有幻灯片内容
                                    const slides = document.querySelectorAll('.reveal .slides section');
                                    if (slides.length === 0) {
                                        alert('未找到幻灯片内容');
                                        return;
                                    }

                                    // 创建一个新的window用于PDF生成
                                    const printContent = Array.from(slides).map((slide, index) => {
                                        return `
                                            <div style="
                                                page-break-after: ${index === slides.length - 1 ? 'avoid' : 'always'};
                                                width: 100%;
                                                height: 100vh;
                                                padding: 40px;
                                                box-sizing: border-box;
                                                display: flex;
                                                flex-direction: column;
                                                justify-content: flex-start;
                                                align-items: flex-start;
                                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                                color: #333;
                                                background: white;
                                            ">
                                                ${slide.innerHTML}
                                            </div>
                                        `;
                                    }).join('');

                                    // 创建完整的HTML文档
                                    const fullHtml = `
                                        <!DOCTYPE html>
                                        <html>
                                        <head>
                                            <meta charset="utf-8">
                                            <title>幻灯片导出</title>
                                            <style>
                                                @page {
                                                    size: A4;
                                                    margin: 0;
                                                }
                                                body {
                                                    margin: 0;
                                                    padding: 0;
                                                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                                }
                                                h1, h2, h3, h4, h5, h6 {
                                                    margin: 0 0 20px 0;
                                                    color: #2c3e50;
                                                }
                                                p, li {
                                                    line-height: 1.6;
                                                    margin: 0 0 15px 0;
                                                }
                                                ul, ol {
                                                    margin: 0 0 20px 20px;
                                                }
                                            </style>
                                        </head>
                                        <body>
                                            ${printContent}
                                        </body>
                                        </html>
                                    `;

                                    // 创建新窗口并直接打印
                                    const printWindow = window.open('', '_blank');
                                    if (printWindow) {
                                        printWindow.document.write(fullHtml);
                                        printWindow.document.close();
                                        
                                        // 等待内容加载完成后自动打印
                                        setTimeout(() => {
                                            printWindow.print();
                                            // 打印对话框关闭后自动关闭窗口
                                            printWindow.addEventListener('afterprint', () => {
                                                printWindow.close();
                                            });
                                        }, 500);
                                    }
                                } catch (error) {
                                    console.error('导出PDF失败:', error);
                                    alert('导出失败，请重试');
                                }
                            }}
                            className="slideshow__control-button slideshow__control-button--pdf"
                        >
                            <span>导出</span>
                        </button>
                    </div>
                </div>

                {/* 底部左右结构 */}
                <div className="slideshow__main">
                    {/* 左侧目录 */}
                    <div className="slideshow__sidebar">
                        <div className="slideshow__toc-list">
                            {tocItems.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => goToSlide(item.h, item.v)}
                                    className={`slideshow__toc-item ${
                                        item.isVertical ? 'slideshow__toc-item--vertical' : ''
                                    } ${
                                        (index + 1) === (activeSlide.h + 1) ? 'slideshow__toc-item--active' : ''
                                    }`}
                                >
                                    <div className="slideshow__toc-item-number">
                                        {index + 1}
                                    </div>
                                    <span className="slideshow__toc-item-title">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 右侧幻灯片展示区 */}
                    <div className="slideshow__content">
                        {/* 导航箭头已隐藏 */}
                        
                        {/* 自定义页码显示 */}
                        <div className="slideshow__custom-slide-number">
                            {currentSlideNumber}
                        </div>
                        
                        <div className="reveal" ref={revealRef}>
                            <div className="slides" ref={slidesRef}>
                                {/* 内容将通过 JavaScript 动态插入 */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StreamMarkdown;
