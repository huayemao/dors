"use client";

import { BaseCard } from "@shuriken-ui/react";

export default function Iframe({ html, className = '',...props }) {
  let iframe = window.document.createElement("iframe");
  iframe.srcdoc = html;
  iframe.width = "100%";
  iframe.classList.add('nui-slimscroll');
  if(!!className){
    iframe.classList.add(...className.split(' '))
  }
  Object.assign(iframe, props);

  return (
    <BaseCard
      className="nui-slimscroll"
      dangerouslySetInnerHTML={{ __html: iframe.outerHTML }}
    ></BaseCard>
  );
}
