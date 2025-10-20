import React, { useState, useEffect, useRef } from 'react';
import './StreamingSlides.css';
import { config } from 'process';

const StreamingSlides: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState<boolean>(false);

    const deckRef = useRef<any | null>(null);
    const revealDivRef = useRef<HTMLDivElement>(null);
    const [revealLoaded, setRevealLoaded] = useState<boolean>(false);

    // 加载 Reveal.js 和 Markdown 插件
    useEffect(() => {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.css';
        document.head.appendChild(cssLink);

        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = 'https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/black.css';
        themeLink.id = 'reveal-theme';
        document.head.appendChild(themeLink);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.js';
        script.async = true;

        // 加载 Markdown 插件
        const markdownScript = document.createElement('script');
        markdownScript.src = 'https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/markdown/markdown.js';
        markdownScript.async = true;

        script.onload = () => {
            document.body.appendChild(markdownScript);
            markdownScript.onload = () => setRevealLoaded(true);
        };

        document.body.appendChild(script);

        return () => {
            document.head.removeChild(cssLink);
            if (document.getElementById('reveal-theme')) {
                document.head.removeChild(themeLink);
            }
            if (script.parentNode) {
                document.body.removeChild(script);
            }
            if (markdownScript.parentNode) {
                document.body.removeChild(markdownScript);
            }
        };
    }, []);

    // 页面加载时初始化 Reveal.js（流式完成后或有markdown时）
    useEffect(() => {
        if (revealLoaded && markdown && !isStreaming) {
            // 只在流式完成后初始化，避免频繁重新渲染
            const timer = setTimeout(() => {
                initReveal();
            }, 300);
            return () => clearTimeout(timer);
        }
        // 流式进行中也需要更新（但频率较低）
        if (revealLoaded && markdown && isStreaming) {
            const timer = setTimeout(() => {
                if (deckRef.current) {
                    // 如果已经初始化，只同步数据
                    try {
                        deckRef.current.sync();
                    } catch (e) {
                        // 同步失败则重新初始化
                        initReveal();
                    }
                } else {
                    // 首次初始化
                    initReveal();
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [revealLoaded, markdown, isStreaming]);

    // 自动调用 API，实时流式渲染
    useEffect(() => {
        callRealStreamingAPI();
    }, []);

    // 真实的流式 API 调用
    const callRealStreamingAPI = async () => {
        setIsStreaming(true);
        setMarkdown('');

        try {
            const response = await fetch('https://api.coze.cn/v1/workflow/stream_run', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer pat_QnEa51egJFxTcB9YLFLj0v7wKFVwoPx2WfZlLW8ObZ3q5MVIWEmlObblPfmcXIwK',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    workflow_id: '7560573153358561280',
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
                if (now - lastUpdateTime > 200) {  // 提高频率限制，减少重渲染
                    setMarkdown(accumulated);
                    lastUpdateTime = now;
                }
            }

            // 确保最后一次更新
            setMarkdown(accumulated);

            console.log('Final markdown:', accumulated);
            setIsStreaming(false);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '流式接收失败';
            console.error('Error in real streaming:', err);
            alert(`接口调用失败: ${errorMessage}`);
            setIsStreaming(false);
        }
    };

    // 初始化 Reveal.js
    const initReveal = () => {
        if (!revealLoaded || !(window as any).Reveal) {
            console.warn('Reveal.js not loaded yet');
            return;
        }

        // 销毁旧实例
        if (deckRef.current) {
            try {
                deckRef.current.destroy();
            } catch (e) {
                console.warn('Failed to destroy previous Reveal instance:', e);
            }
            deckRef.current = null;
        }

        if (revealDivRef.current && markdown) {
            const Reveal = (window as any).Reveal;
            const RevealMarkdown = (window as any).RevealMarkdown;

            console.log('Initializing Reveal with markdown length:', markdown.length);

            try {
                const deck = new Reveal(revealDivRef.current, {
                    embedded: false,
                    controls: true,
                    progress: true,
                    center: true,
                    hash: false,
                    transition: 'slide',
                    slideNumber: 'c/t',
                    width: 960,
                    height: 700,
                    margin: 0.1,
                    plugins: RevealMarkdown ? [RevealMarkdown] : []
                });

                deck.initialize().then(() => {
                    deckRef.current = deck;
                    console.log('Reveal.js initialized successfully');
                    console.log('Total slides:', deck.getTotalSlides());
                    // 强制同步幻灯片
                    deck.sync();
                }).catch((err: Error) => {
                    console.error('Failed to initialize Reveal:', err);
                });
            } catch (err) {
                console.error('Error creating Reveal instance:', err);
            }
        }
    };

    // 跳转到指定幻灯片
    const goToSlide = (index: number) => {
        if (deckRef.current) {
            deckRef.current.slide(index);
        }
    };

    // 提取幻灯片标题用于目录导航
    const extractTitles = (md: string): string[] => {
        if (!md) return [];
        const titles: string[] = [];
        // 按 ## 标题分割（因为你的 Markdown 没有 --- 分隔符）
        const lines = md.split('\n');
        for (const line of lines) {
            const match = line.match(/^##\s+(.+)$/);
            if (match) {
                titles.push(match[1]);
            }
        }
        return titles;
    };

    const slideTitles = extractTitles(markdown);

    return (
        <div className="streaming-slides-container">
            {/* 左侧目录 */}
            <div className="toc-sidebar-left">
                <h3>📑 目录 {markdown}</h3>
                {isStreaming && slideTitles.length === 0 ? (
                    <p className="empty-text">正在加载...</p>
                ) : slideTitles.length > 0 ? (
                    <ul>
                        {slideTitles.map((title, index) => (
                            <li key={index} onClick={() => goToSlide(index)}>
                                <span className="slide-number">{index + 1}</span>
                                <span className="slide-title">{title}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="empty-text">暂无内容</p>
                )}
            </div>

            {/* 右侧幻灯片区域 */}
            <div className="slides-area">
                {markdown ? (
                    <>
                        {isStreaming && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                fontSize: '14px',
                                zIndex: 1000,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '12px',
                                    height: '12px',
                                    border: '2px solid #fff',
                                    borderTopColor: 'transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></span>
                                正在生成中...
                            </div>
                        )}
                        <div className="reveal" ref={revealDivRef}>
                            <div className="slides">
                                <section data-markdown data-separator="^\n## "
                                    data-separator-vertical="^\n### ">
                                    <textarea data-template>
                                        ## Slide 1
                                        A paragraph with some text and a [link](https://hakim.se).
                                        ---
                                        ## Slide 2
                                        ---
                                        ## Slide 3
                                    </textarea>
                                </section>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="placeholder">
                        <div className="placeholder-content">
                            <h3>🚀 正在加载幻灯片...</h3>
                            <p>请稍候</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StreamingSlides;
