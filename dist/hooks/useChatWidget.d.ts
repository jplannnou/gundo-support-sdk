export interface UseChatWidgetReturn {
    isOpen: boolean;
    isMinimized: boolean;
    unreadCount: number;
    open: () => void;
    close: () => void;
    toggle: () => void;
    minimize: () => void;
    setUnread: (count: number) => void;
}
export declare function useChatWidget(): UseChatWidgetReturn;
//# sourceMappingURL=useChatWidget.d.ts.map