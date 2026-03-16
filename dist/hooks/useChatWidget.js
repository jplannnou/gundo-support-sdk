import { useState, useCallback } from 'react';
export function useChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const open = useCallback(() => {
        setIsOpen(true);
        setIsMinimized(false);
        setUnreadCount(0);
    }, []);
    const close = useCallback(() => {
        setIsOpen(false);
        setIsMinimized(false);
    }, []);
    const toggle = useCallback(() => {
        setIsOpen((prev) => {
            if (!prev)
                setUnreadCount(0);
            return !prev;
        });
        setIsMinimized(false);
    }, []);
    const minimize = useCallback(() => {
        setIsMinimized(true);
    }, []);
    return {
        isOpen,
        isMinimized,
        unreadCount,
        open,
        close,
        toggle,
        minimize,
        setUnread: setUnreadCount,
    };
}
//# sourceMappingURL=useChatWidget.js.map