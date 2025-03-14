import { type AndroidUi, type AndroidElement } from "@shared/schema";
import AndroidElement from "./element";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button"; // Используем готовые стилизованные кнопки

interface AndroidContainerProps {
  ui: AndroidUi;
}

export default function AndroidContainer({ ui }: AndroidContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const newScale = Math.min(
        containerWidth / ui.screenWidth,
        containerHeight / ui.screenHeight
      );

      setScale(newScale > 1 ? 1 : newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [ui.screenWidth, ui.screenHeight]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 1)); // Увеличиваем, но не больше 2x
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5)); // Уменьшаем, но не меньше 0.5x

  const parsedElements = ui.parsedElements as AndroidElement;

  if (!parsedElements?.bounds) {
    return <div>Invalid UI data</div>;
  }

  return (
    <div className="relative w-full h-[90vh] bg-gray-50 border-2 border-gray-300 overflow-auto rounded-lg shadow-xl" ref={containerRef}>
      {/* Кнопки управления масштабом */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button onClick={zoomOut} className="px-3 py-1 bg-gray-200 hover:bg-gray-300">−</Button>
        <Button onClick={zoomIn} className="px-3 py-1 bg-gray-200 hover:bg-gray-300">+</Button>
      </div>

      {/* Контейнер с UI */}
      <div
        style={{
          width: ui.screenWidth,
          height: ui.screenHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <AndroidElement
          element={parsedElements}
          scale={scale}
          parentBounds={{
            left: 0,
            top: 0,
            right: ui.screenWidth,
            bottom: ui.screenHeight,
          }}
        />
      </div>
    </div>
  );
}
