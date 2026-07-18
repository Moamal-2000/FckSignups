interface ToastProps {
  innerText: string;
  onExit: () => void;
}

export function Toast({ innerText, onExit }: ToastProps) {
  return (
    <>
      <div className="toast-container">
        <p>{innerText}</p>
        <button type="button" onClick={onExit} className="close-toast-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
