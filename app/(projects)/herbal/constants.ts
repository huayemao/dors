export const DEFAULT_START = `<div style="margin: 0 auto;">
        <style>
        .ql-editor ul > li::marker{color:rgb(209, 213, 219)}
        .ql-editor ol > li::marker{color:rgb(107, 114, 128)}
        .ql-editor li:before{display:none} 
        .ql-editor ol {
            list-style-type: decimal; 
        }
        .ql-editor ol>li {
            list-style-type: decimal;
        }
        .ql-editor ul>li {
            list-style-type: disc;
        }
        .article-detail{max-width:90ch;margin:0 auto;}


        article {  
    line-height:1.5;
    font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
}  
body { 
/* CSS Variables that may have been missed get put on body */ 
    --tw-space-y-reverse:  0;  
    --tw-prose-body:  #374151;  
    --tw-prose-headings:  #111827;  
    --tw-border-opacity:  1;  
    --tw-text-opacity:  1;  
} 

* { 
    box-sizing: border-box; 
    border: 0 solid #e5e7eb;
} 

* { 
    box-sizing: border-box;
} 

.space-y-4 > :not([hidden]) ~ :not([hidden]) { 
    --tw-space-y-reverse: 0; 
    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse))); 
    margin-bottom: calc(1rem * var(--tw-space-y-reverse));
} 

.prose { 
    color: var(--tw-prose-body); 
} 

.prose { 
    --tw-prose-body: #374151; 
    --tw-prose-links: #111827; 
    --tw-prose-hr: #e5e7eb; 
    --tw-prose-captions: #6b7280; 
    font-size: 1rem; 
    line-height: 1.75;
} 

@media (min-width: 1025px){ 
  .prose.lg\\:prose-xl { 
    font-size: 1.25rem; 
    line-height: 1.8;
  } 
}     


.overflow-hidden { 
    overflow: hidden;
} 

.py-6 { 
    padding-top: 1.5rem; 
    padding-bottom: 1.5rem;
} 


*,:after,:before { 
    box-sizing: border-box; 
    border: 0 solid #e5e7eb;
} 

p { 
    margin: 0;
} 

article.prose :where(p):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 1.25em; 
    margin-bottom: 1.25em;
} 

article.prose :where(.prose > :first-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(p):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 1.2em; 
    margin-bottom: 1.2em;
  } 

  .lg\\:prose-xl :where(.lg\:prose-xl > :first-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
  } 
}     

.prose-p\\:indent-8 :is(:where(p):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    text-indent: 2rem;
} 

blockquote { 
    margin: 0;
} 

article.prose :where(blockquote):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    font-weight: 500; 
    font-style: italic; 
    color: var(--tw-prose-quotes); 
    border-inline-start-width: .25rem; 
    border-inline-start-color: var(--tw-prose-quote-borders); 
    quotes: "“" "„"; 
    margin-top: 1.6em; 
    margin-bottom: 1.6em; 
    padding-inline-start: 1em;
} 

article.prose :where(ul, ol, blockquote, figure):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    -moz-column-break-inside: avoid; 
    break-inside: avoid;
} 

article.prose :where(blockquote):not(:where([class ~ ="not-prose"] *))  { 
    font-size: 1.1rem; 
    margin-top: 1rem; 
    border-radius: .25rem; 
    border-left-width: 0; 
    background-color: rgba(240,253,244,.6); 
    padding: 1.5rem; 
    line-height: 1.4; 
    --tw-text-opacity: 1; 
    color: rgb(71 85 105/var(--tw-text-opacity)); 
    --tw-drop-shadow: drop-shadow(0 1px 1px rgba(0,0,0,.05)); 
    filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(blockquote):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 1.6em; 
    margin-bottom: 1.6em; 
    padding-inline-start: 1.0666667em;
  } 
}     

h2 { 
    font-size: inherit; 
    font-weight: inherit;
} 

h2 { 
    margin: 0;
} 

h2 { 
    scroll-margin-top: 80px;
} 

article.prose :where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    color: var(--tw-prose-headings); 
    font-weight: 700; 
    font-size: 1.5em; 
    margin-top: 2em; 
    margin-bottom: 1em; 
    line-height: 1.3333333;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    font-size: 1.8em; 
    margin-top: 1.5555556em; 
    margin-bottom: .8888889em; 
    line-height: 1.1111111;
  } 
}     

article.prose-h2\\:border-l-4 :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    border-left-width: 4px;
} 

article.prose-h2\\:border-green-500 :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    --tw-border-opacity: 1; 
    border-color: rgb(34 197 94/var(--tw-border-opacity));
} 

article.prose-h2\\:pl-3 :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    padding-left: .75rem;
} 

article.prose-h2\\:text-center :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    text-align: center;
} 

article.prose-h2\\:text-green-700 :is(:where(h2):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    --tw-text-opacity: 1; 
    color: rgb(21 128 61/var(--tw-text-opacity));
} 

article.prose :where(h2 + *):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(h2 + *):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
  } 
}     

article.prose :where(.prose > :last-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-bottom: 0;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(.lg\\:prose-xl > :last-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-bottom: 0;
  } 
}     

hr { 
    height: 0; 
    color: inherit; 
    border-top-width: 1px;
} 

hr { 
    margin: 0;
} 

a { 
    text-decoration: inherit;
} 

a { 
    color: inherit; 
    text-decoration: none;
} 

:where(a):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    color: var(--tw-prose-links); 
    text-decoration: underline; 
    font-weight: 500;
} 

article.prose-a\\:\\!text-green-600 :is(:where(a):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *)))  { 
    --tw-text-opacity: 1!important; 
    color: rgb(22 163 74/var(--tw-text-opacity))!important;
} 


:where(hr):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    border-color: var(--tw-prose-hr); 
    border-top-width: 1px; 
    margin-top: 3em; 
    margin-bottom: 3em;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(hr):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 2.8em; 
    margin-bottom: 2.8em;
  } 
}     

:where(hr + *):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
} 

:where(.prose > :last-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-bottom: 0;
} 

@media (min-width: 1025px){ 
  .lg\\:prose-xl :where(hr + *):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-top: 0;
  } 

  .lg\\:prose-xl :where(.lg\\:prose-xl > :last-child):not(:where([class ~ ="not-prose"], [class ~ ="not-prose"] *))  { 
    margin-bottom: 0;
  } 
}     
.ql-editor .prose ol li:not(.ql-direction-rtl), .ql-editor ul li:not(.ql-direction-rtl) {
    padding-left: 0;
    list-style-position:inside;
}
.ql-editor .prose ol, .ql-editor ul {
    padding-left:0;
}
</style>`