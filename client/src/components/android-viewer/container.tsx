import { type AndroidUi, type AndroidElement } from "@shared/schema";
import AndroidElement from "./element";

interface AndroidContainerProps {
  ui: AndroidUi;
}

export default function AndroidContainer({ ui }: AndroidContainerProps) {
  // Масштабируем для лучшей видимости на экране
  const scale = 0.3;
  const width = ui.screenWidth * scale;
  const height = ui.screenHeight * scale;

  // Validate parsedElements
  const parsedElements = ui.parsedElements as AndroidElement;
  if (!parsedElements?.bounds) {
    return <div>Invalid UI data</div>;
  }

  return (
    <div className="relative bg-white rounded-lg shadow-lg mx-auto overflow-hidden border border-gray-200" 
      style={{
        width,
        height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left'
      }}>
      <AndroidElement
        element={parsedElements}
        scale={1}
        parentBounds={{
          left: 0,
          top: 0,
          right: ui.screenWidth,
          bottom: ui.screenHeight
        }}
      />
    </div>
  );
}