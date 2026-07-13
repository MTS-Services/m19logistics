import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';

const MENU_WIDTH = 144;
const MENU_HEIGHT = 88;

const InvoiceActionMenu = ({ invoice, onView, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, openUp: false });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const updatePosition = () => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < MENU_HEIGHT + 16;

    let left = rect.right - MENU_WIDTH;
    if (left < 8) left = 8;
    if (left + MENU_WIDTH > window.innerWidth - 8) {
      left = window.innerWidth - MENU_WIDTH - 8;
    }

    const top = openUp ? rect.top - MENU_HEIGHT - 8 : rect.bottom + 8;

    setPosition({
      top: Math.max(8, top),
      left,
      openUp,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleClickOutside = (e) => {
      if (
        menuRef.current?.contains(e.target) ||
        buttonRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleReposition = () => updatePosition();

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        aria-label="Invoice actions"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: position.top,
              left: position.left,
              width: MENU_WIDTH,
              zIndex: 60,
            }}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onView(invoice);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              View
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDelete(invoice);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

export default InvoiceActionMenu;
