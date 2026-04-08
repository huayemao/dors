import { useRef, useEffect, useState, useCallback } from 'react';
import { useFirstVisibleElement } from './firstVisibleElement';
import type { Toc } from '@stefanprobst/rehype-extract-toc';

export function useTocObserver(toc: Toc) {
  const [currentViewedTocItem, setCurrentViewedTocItem] = useState('');

  const observedElements = useCallback(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const mainElement = document.querySelector('article');

    if (!mainElement) {
      return [];
    }

    const elements = mainElement.querySelectorAll(
      'h1, h1 ~ *:not(section), h2:not(.document-toc-heading), h2:not(.document-toc-heading) ~ *:not(section), h3, h3 ~ *:not(section)'
    );
    return Array.from(elements);
  }, []);

  const getIds = (items) => 
  items.flatMap(item => [item.id, ...getIds(item.children ?? [])]);

  const referencedIds = getIds(toc);
  const idByObservedElement = useRef<Map<Element, string>>(new Map());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    observedElements().reduce((currentId, observedElement) => {
      const observedId = observedElement.id;
      if (observedId && referencedIds.includes(observedId)) {
        currentId = observedId;
      }
      idByObservedElement.current.set(observedElement, currentId);

      return currentId;
    }, '');
  }, [observedElements, referencedIds]);

  useFirstVisibleElement(observedElements, (element: Element | null) => {
    const id = element ? idByObservedElement.current.get(element) ?? '' : '';
    if (id !== currentViewedTocItem) {
      setCurrentViewedTocItem(id);
    }
  });

  return currentViewedTocItem;
}
