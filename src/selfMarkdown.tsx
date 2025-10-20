import React, { useEffect, useRef } from "react";
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';


const MarkDownRander: React.FC<{ content: string }> = (props) => {
    const deckRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (deckRef.current) {
            let deck = new Reveal(deckRef.current, {
                plugins: [Markdown],
            });
            deck.initialize();
        }
    }, [])

    return (
        <div className="reveal" ref={deckRef}>
            <div className="slides">
                {/* Reveal.js 幻灯片内容 */}
            </div>
        </div>
    )
}

export default MarkDownRander;