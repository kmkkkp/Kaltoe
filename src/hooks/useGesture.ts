/* This is a simplified version for the showcase. In a real project, we would install and use @use-gesture/react */

import { useEffect, useRef } from 'react';

interface GestureOptions {
  target: React.RefObject<HTMLElement>;
  enabled?: boolean;
  drag?: { filterTaps?: boolean };
}

export const useGesture = (
  handlers: {
    onDrag?: (state: any) => any;
    onPinch?: (state: any) => void;
    onWheel?: (state: any) => void;
  },
  options: GestureOptions
) => {
  const { target, enabled = true } = options;
  
  const handlerRef = useRef(handlers);
  handlerRef.current = handlers;

  useEffect(() => {
    if (!enabled || !target.current) return;
    
    const element = target.current;
    let isDragging = false;
    let lastPosition = { x: 0, y: 0 };
    
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastPosition = { x: e.clientX, y: e.clientY };
      
      const memo = handlerRef.current.onDrag?.({
        movement: [0, 0],
        first: true,
        memo: null
      });
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        
        const movement = [
          e.clientX - lastPosition.x,
          e.clientY - lastPosition.y
        ];
        
        handlerRef.current.onDrag?.({
          movement,
          first: false,
          memo
        });
      };
      
      const handleMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handlerRef.current.onWheel?.({
        delta: [e.deltaX, e.deltaY]
      });
    };
    
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('wheel', handleWheel);
    };
  }, [enabled, target]);
};