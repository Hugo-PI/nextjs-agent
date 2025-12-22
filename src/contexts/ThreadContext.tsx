'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface ThreadContextType {
  activeThreadId: string | null;
  setActiveThreadId: (threadId: string | null) => void;
};

const ThreadContext = createContext<ThreadContextType | null>(null);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  return (
    <ThreadContext.Provider value={{ activeThreadId, setActiveThreadId }}>
      {children}
    </ThreadContext.Provider>
  );
};

export const useThreadContext = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error('useThreadContext must be used within a ThreadProvider');
  }
  return context;
};
