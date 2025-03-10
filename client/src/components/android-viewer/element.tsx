import { type AndroidElement } from "@shared/schema";
import { memo } from "react";

interface AndroidElementProps {
  element: AndroidElement;
  scale: number;
  parentBounds: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
}

function AndroidElementComponent({ element, scale, parentBounds }: AndroidElementProps) {
  if (!element?.bounds) {
    return null;
  }

  const { left, top, right, bottom } = element.bounds;
  const { left: parentLeft, top: parentTop } = parentBounds;

  // Вычисляем размеры и позицию
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);
  const posLeft = Math.max(0, left - parentLeft);
  const posTop = Math.max(0, top - parentTop);

  return (
    <div
      className="absolute border border-gray-200 flex items-center justify-center"
      style={{
        left: posLeft,
        top: posTop,
        width,
        height,
        fontSize: `${12}px`,
        backgroundColor: 'rgba(200, 200, 200, 0.1)',
      }}
      title={`${element.type}${element.contentDescription ? ` - ${element.contentDescription}` : ''}`}
    >
      {element.text && (
        <span className="truncate px-1 text-xs">{element.text}</span>
      )}

      {element.children?.map((child, index) => (
        <AndroidElement
          key={index}
          element={child}
          scale={scale}
          parentBounds={element.bounds}
        />
      ))}
    </div>
  );
}

const AndroidElement = memo(AndroidElementComponent);
export default AndroidElement;