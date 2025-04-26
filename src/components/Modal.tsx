import React from "react";

interface ModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function Modal({
  open,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = "Yes, proceed.",
  cancelLabel = "No",
}: ModalProps) {
  if (!open) return null;

  const isConfirmation = typeof onConfirm === "function";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-700">{message}</p>

        <div
          className={`flex ${
            isConfirmation ? "justify-between" : "justify-center"
          } gap-4 mt-4`}
        >
          {isConfirmation ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 border border-black text-black px-4 py-2 rounded hover:bg-gray-100"
              >
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                {confirmLabel}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
