
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface UISettingsContextType {
  hideToolMessages: boolean;      // 工具消息是否隐藏
  toggleToolMessages: () => void; // 切换工具消息是否隐藏
};

interface UISettingsProviderProps {
  children: ReactNode;
};

const UISettingsContext = createContext<UISettingsContextType | undefined>({
  hideToolMessages: false,
  toggleToolMessages: () => {},
});

export const UISettingsProvider = ({ children }: UISettingsProviderProps) => {
  const [hideToolMessages, setHideToolMessages] = useState<boolean>(false);

  const toggleToolMessages = () => {
    setHideToolMessages((prev) => !prev);
  };

  return (
    <UISettingsContext.Provider value={{ hideToolMessages, toggleToolMessages }}>
      {children}
    </UISettingsContext.Provider>
  );
};

export const useUISettings = () => {
  const context = useContext(UISettingsContext);
  if (!context) {
    throw new Error('useUISettings must be used within a UISettingsProvider');
  }
  return context;
};
