declare module 'reveal.js' {
  export interface RevealOptions {
    embedded?: boolean;
    controls?: boolean;
    progress?: boolean;
    center?: boolean;
    hash?: boolean;
    transition?: string;
    slideNumber?: string | boolean;
    showNotes?: boolean;
    width?: number;
    height?: number;
    plugins?: any[];
  }

  export interface RevealApi {
    initialize: (options?: RevealOptions) => Promise<void>;
    slide: (indexh: number, indexv?: number, f?: number) => void;
    destroy: () => void;
    getIndices: () => { h: number; v: number };
    getTotalSlides: () => number;
  }

  export default class Reveal {
    constructor(element: HTMLElement, options?: RevealOptions);
    initialize(options?: RevealOptions): Promise<void>;
    slide(indexh: number, indexv?: number, f?: number): void;
    destroy(): void;
    getIndices(): { h: number; v: number };
    getTotalSlides(): number;
  }

  export namespace Reveal {
    export type Api = RevealApi;
  }
}

declare module 'reveal.js/dist/reveal.css' {
  const content: string;
  export default content;
}

declare module 'reveal.js/dist/theme/black.css' {
  const content: string;
  export default content;
}
