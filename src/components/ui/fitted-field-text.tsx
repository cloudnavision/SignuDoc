"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { fitFieldTextSize } from "@/lib/field-text-fit";

let measuringContext: CanvasRenderingContext2D | null | undefined;

/** How wide text is at a 100 px size, in the element's own font. */
function widthAt100Pixels(element: HTMLElement, text: string): number | null {
  measuringContext ??= document.createElement("canvas").getContext("2d");

  if (!measuringContext) {
    return null;
  }

  const style = getComputedStyle(element);

  measuringContext.font = `${style.fontStyle} ${style.fontWeight} 100px ${style.fontFamily}`;

  return measuringContext.measureText(text).width || null;
}

function horizontalPadding(element: HTMLElement): number {
  const style = getComputedStyle(element);

  return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
}

/**
 * One line of text in a field box (an element with the field-box class),
 * sized to the room its parent gives it. It is measured in its real font, so
 * wide letters and Chinese or Japanese names fit too; until then, and if it
 * cannot be measured, the size is estimated from the number of characters.
 */
export function FittedFieldText({
  as = "span",
  className = "",
  maxPixels,
  style,
  text,
}: {
  as?: "p" | "span";
  className?: string;
  maxPixels: number;
  style?: CSSProperties;
  text: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [sizeByWidth, setSizeByWidth] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    const box = element?.parentElement;

    if (!element || !box) {
      return;
    }

    let isActive = true;
    const fit = () => {
      const width = widthAt100Pixels(element, text);
      const room =
        box.clientWidth - horizontalPadding(box) - horizontalPadding(element);

      if (isActive) {
        setSizeByWidth(width && room > 0 ? (room / width) * 100 : null);
      }
    };
    // Fires once straight away, then whenever the box is resized or zoomed.
    const observer = new ResizeObserver(fit);

    observer.observe(box);
    // A web font that loads later is wider or narrower than its fallback.
    void document.fonts?.ready.then(fit);

    return () => {
      isActive = false;
      observer.disconnect();
    };
  }, [text]);

  const fontSize =
    sizeByWidth === null
      ? fitFieldTextSize(text, maxPixels)
      : `min(${String(maxPixels)}px, 70cqh, ${sizeByWidth.toFixed(2)}px)`;
  const props = {
    className: `field-fit-text ${className}`,
    style: { ...style, fontSize },
  };

  return as === "p" ? (
    <p {...props} ref={(node) => void (ref.current = node)}>
      {text}
    </p>
  ) : (
    <span {...props} ref={(node) => void (ref.current = node)}>
      {text}
    </span>
  );
}
