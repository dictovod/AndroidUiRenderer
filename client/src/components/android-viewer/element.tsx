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
  const width = Math.max(0, right - left) * scale;
  const height = Math.max(0, bottom - top) * scale;
  const posLeft = Math.max(0, (left - parentLeft) * scale);
  const posTop = Math.max(0, (top - parentTop) * scale);

  // Определяем стили для разных типов элементов
  const elementType = element.class || "Unknown";
  const borderColor = elementType.includes("Button")
    ? "border-yellow-400"
    : elementType.includes("TextView")
    ? "border-blue-400"
    : elementType.includes("ImageView")
    ? "border-green-400"
    : "border-gray-300";

  const backgroundColor = element.selected
    ? "rgba(255, 200, 0, 0.3)"
    : "rgba(255, 255, 255, 0.1)";

  return (
    <div
      className={`absolute ${borderColor} border shadow-md rounded-lg flex items-center justify-center p-1`} 
      style={{
        left: posLeft,
        top: posTop,
        width,
        height,
        fontSize: "12px",
        backgroundColor,
      }}
      title={`Type: ${elementType}\nID: ${element.resourceId || "N/A"}\nDesc: ${element.contentDescription || "N/A"}`}
      onClick={() => console.log("Clicked element: ", element)}
    >
      {element.class?.includes("ImageView") && element.contentDescription ? (
        <img
          src={`https://placehold.co/32?text=${encodeURIComponent(element.contentDescription)}`}
          alt={element.contentDescription}
          className="max-w-full max-h-full"
        />
      ) : element.text ? (
        <span className="truncate px-1 text-xs font-semibold text-gray-900">
          {element.text}
        </span>
      ) : (
        <span className="truncate px-1 text-xs text-gray-600">{element.contentDescription}</span>
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
