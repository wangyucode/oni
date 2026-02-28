import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";

interface CustomRangeProps {
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export default function CustomRange({ value, min, max, onChange, disabled }: CustomRangeProps) {
  const [rect, setRect] = useState<{ left: number; width: number } | null>(null);
  const idRef = useRef(`range-${Math.random().toString(36).slice(2)}`);
  const isDragging = useRef(false);

  // Update rect on mount and when needed
  const updateRect = () => {
    const query = Taro.createSelectorQuery();
    query
      .select(`#${idRef.current}`)
      .boundingClientRect((res) => {
        if (res) {
          const rectRes = Array.isArray(res) ? res[0] : res;
          if (rectRes) {
            setRect({ left: rectRes.left, width: rectRes.width });
          }
        }
      })
      .exec();
  };

  useEffect(() => {
    setTimeout(updateRect, 200);
  }, []);

  const latestProps = useRef({ min, max, onChange, value });
  latestProps.current = { min, max, onChange, value };
  
  const rectRef = useRef(rect);
  rectRef.current = rect;

  const calculateValueSafe = (clientX: number) => {
      const r = rectRef.current;
      if (!r || r.width === 0) return;
      const { min, max, onChange, value } = latestProps.current;
      
      const offset = clientX - r.left;
      let percent = offset / r.width;
      percent = Math.max(0, Math.min(1, percent));
      const rawVal = min + percent * (max - min);
      const roundedVal = Math.round(rawVal);
      if (roundedVal !== value) {
        onChange(roundedVal);
      }
  };

  // Touch Events (Mobile/Touch)
  const handleTouchStart = (e: any) => {
    if (disabled) return;
    updateRect();
    isDragging.current = true;
    const touch = e.touches[0];
    calculateValueSafe(touch.clientX);
  };

  const handleTouchMove = (e: any) => {
    if (disabled || !isDragging.current) return;
    e.stopPropagation(); 
    const touch = e.touches[0];
    calculateValueSafe(touch.clientX);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Mouse Events (PC/Web)
  const handleMouseDown = (e: any) => {
    if (disabled) return;
    updateRect();
    isDragging.current = true;
    calculateValueSafe(e.clientX);
    
    document.addEventListener('mousemove', handleMouseMoveSafe);
    document.addEventListener('mouseup', handleMouseUpSafe);
  };
  
  const handleMouseMoveSafe = (e: any) => {
      if (!isDragging.current) return;
      calculateValueSafe(e.clientX);
  }

  const handleMouseUpSafe = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMoveSafe);
      document.removeEventListener('mouseup', handleMouseUpSafe);
  }

  // Cleanup global listeners
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousemove', handleMouseMoveSafe);
        document.removeEventListener('mouseup', handleMouseUpSafe);
      }
    };
  }, []);

  const percent = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <View 
        id={idRef.current}
        className="relative flex items-center select-none cursor-pointer"
        style={{ height: '24px', padding: '10px 0' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        // @ts-ignore
        onMouseDown={handleMouseDown}
    >
        {/* Track */}
        <View 
            className="w-full relative mr-16" 
            style={{ 
                height: '4px', 
                backgroundColor: '#e5e5e5', 
                borderRadius: '99px',
                overflow: 'visible'
            }}
        >
             {/* Fill */}
             <View 
                className="h-full absolute top-0 left-0" 
                style={{ 
                    width: `${percent}%`, 
                    backgroundColor: 'var(--nutui-color-primary, #7F3D5E)',
                    borderRadius: '99px'
                }} 
             />
             
             {/* Thumb - positioned relative to track to handle vertical alignment easily */}
             <View 
                className="absolute bg-white shadow"
                style={{ 
                    left: `${percent}%`, 
                    width: '20px', 
                    height: '20px', 
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%', 
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
            />
        </View>
    </View>
  );
}
