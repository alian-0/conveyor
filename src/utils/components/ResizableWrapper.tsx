import { useModelTableStore } from '@/ModelTable/useModelTableStore';
import { type ReactNode, useEffect, useRef, useState } from 'react';

export interface ResizableWrapperProps {
  resizable: boolean;
  width: number;
  onWidthChange?: (width: number) => void;
  children: ReactNode;
}

export const ResizableWrapper = ({
  resizable,
  width,
  onWidthChange,
  children,
}: ResizableWrapperProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [clientX, setClientX] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [currentWidth, setCurrentWidth] = useState(width);
  const ref = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useModelTableStore((state) => state.scrollAreaRef);
  const scrollAreaRefCurrent = scrollAreaRef?.current
    ?.children[1] as HTMLDivElement;

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setDeltaX(e.clientX - clientX);
    };
    const onMouseUp = () => {
      let newWidth = currentWidth + deltaX;
      scrollAreaRefCurrent.scrollBy({
        left: deltaX,
        behavior: 'smooth',
      });
      const scrollWidth = ref.current?.scrollWidth;
      if (scrollWidth && scrollWidth !== newWidth) {
        newWidth = ref.current?.scrollWidth;
      }
      setIsResizing(false);
      setCurrentWidth(newWidth);
      setDeltaX(0);
      onWidthChange?.(newWidth);
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        element.classList.remove('resizing');
      }
    };
    if (isResizing) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [
    isResizing,
    currentWidth,
    clientX,
    deltaX,
    onWidthChange,
    scrollAreaRefCurrent,
  ]);

  return resizable ? (
    <div
      className="h-full"
      style={{
        // Width can't be less than the horizontal space taken up by the title of each column
        width: `${
          currentWidth + deltaX >
          (ref.current?.firstElementChild?.getBoundingClientRect().width ?? 0)
            ? currentWidth + deltaX
            : ref.current?.firstElementChild?.getBoundingClientRect().width ??
              200
        }px`,
      }}
      ref={ref}
    >
      {children}
      <div
        className="-right-1 absolute inset-y-0 w-2 cursor-ew-resize select-none"
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsResizing(true);
          setClientX(e.clientX);
          const allElements = document.querySelectorAll('*');
          for (const element of allElements) {
            element.classList.add('resizing');
          }
        }}
      >
        <div className="absolute inset-x-1/3 inset-y-1/4 rounded bg-border" />
      </div>
    </div>
  ) : (
    children
  );
};
