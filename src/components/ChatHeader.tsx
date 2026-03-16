interface ChatHeaderProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
}

export function ChatHeader({ title, onClose, onMinimize }: ChatHeaderProps) {
  return (
    <div className="chat-header">
      <h3 className="chat-header__title">{title}</h3>
      <div className="chat-header__actions">
        <button className="chat-header__btn" onClick={onMinimize} aria-label="Minimize">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        </button>
        <button className="chat-header__btn" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
