import { useEffect, useState } from "react";

export function useFirstVisibleElement(
  observedElementsProvider: () => Element[],
  visibleElementCallback: (firstVisibleElement: Element | null) => void
) {
  const [firstVisibleElement, setFirstVisibleElement] =
    useState<Element | null>(null);

  useEffect(() => {
    visibleElementCallback(firstVisibleElement);
  }, [visibleElementCallback, firstVisibleElement]);

  const rootMargin = "-80px 0px 0px 0px";

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // SSR or old browser.
      return;
    }

    const observedElements = observedElementsProvider();
    const visibilityByElement = new Map<Element, boolean>();

    function manageVisibility(entries: IntersectionObserverEntry[]) {
      for (const entry of entries) {
        visibilityByElement.set(entry.target, entry.isIntersecting);
      }
    }

    function manageFirstVisibleElement() {
      const visibleElements = Array.from(visibilityByElement.entries())
        .filter(([, value]) => value)
        .map(([key]) => key);

      setFirstVisibleElement(visibleElements[0] ?? null);
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        manageVisibility(entries);
        manageFirstVisibleElement();
      },
      {
        rootMargin,
        threshold: [0.0, 1.0],
      }
    );

    observedElements.forEach((element) => {
      visibilityByElement.set(element, false);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [observedElementsProvider, visibleElementCallback]);
}
