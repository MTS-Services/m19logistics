import React, { useRef, useEffect, useState } from 'react';
import { BarChart3, Edit, Key, Trash2, CheckCircle, XCircle, CalendarDays } from 'lucide-react';

const ActionDropdown = ({
  driver,
  onViewAnalytics,
  onEdit,
  onResetPassword,
  onDelete,
  onToggleStatus,
  onViewAvailability,
  openUpward = false,
  buttonRef,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      // Find the button element - either from ref or from container
      let buttonElement = buttonRef?.current;
      
      if (!buttonElement && containerRef.current) {
        // Try to find button in parent container
        buttonElement = containerRef.current.closest('.action-dropdown-container')?.querySelector('button');
      }

      if (buttonElement && dropdownRef.current) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight || 200;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Check if there's enough space below
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const shouldDropUp = spaceBelow < dropdownHeight + 20;
        
        let top;
        if (shouldDropUp) {
          top = buttonRect.top - dropdownHeight - 8;
        } else {
          top = buttonRect.bottom + 8;
        }
        
        // Align to the right of the button
        let left = buttonRect.right - 176; // w-44 = 176px
        
        // Ensure dropdown doesn't go off-screen on the right
        if (left + 176 > viewportWidth - 10) {
          left = viewportWidth - 176 - 10;
        }
        
        // Ensure dropdown doesn't go off-screen on the left
        if (left < 10) {
          left = 10;
        }
        
        setPosition({ top: Math.max(10, top), left });
        setIsPositioned(true);
      }
    };

    // Initial calculation with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updatePosition, 0);
    
    // Recalculate on window resize and scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [buttonRef]);

  return (
    <div
      ref={containerRef}
      className="fixed z-50 w-44 rounded-xl bg-white shadow-lg ring-1 ring-gray-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: isPositioned ? 1 : 0,
        pointerEvents: isPositioned ? 'auto' : 'none',
        transition: 'opacity 0.1s ease-in-out',
      }}
    >
      <div ref={dropdownRef} className="py-1">
        <button
          onClick={() => onEdit(driver)}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Edit className="h-4 w-4 text-gray-500" />
          Edit Driver
        </button>
        <div className="mx-3 border-t border-gray-100" />
        <button
          onClick={() => onViewAvailability(driver)}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
        >
          <CalendarDays className="h-4 w-4" />
          View Availability
        </button>
        <div className="mx-3 border-t border-gray-100" />
        {driver.status === 'inactive' ? (
          <button
            onClick={() => onToggleStatus(driver)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4" />
            Activate Driver
          </button>
        ) : (
          <button
            onClick={() => onToggleStatus(driver)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50"
          >
            <XCircle className="h-4 w-4" />
            Deactivate Driver
          </button>
        )}
        <div className="mx-3 border-t border-gray-100" />
        <button
          onClick={() => onDelete(driver)}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete Driver
        </button>
      </div>
    </div>
  );
};

export default ActionDropdown;
