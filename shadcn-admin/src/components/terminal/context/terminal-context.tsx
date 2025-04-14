import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { TerminalData } from '../data/terminal'

type TerminalType = 'ssh' | 'log' | 'edit' | 'json'

interface TerminalContextType {
  open: TerminalType | null;
  setOpen: (str: TerminalType | null) => void;
  currentRow: TerminalData | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<TerminalData | null>>;
  containerName: string | undefined;
  setContainerName: React.Dispatch<React.SetStateAction<string | undefined>>;
  list: TerminalData[];
  setList: React.Dispatch<React.SetStateAction<TerminalData[]>>;
}

// 创建终端配置上下文
const TerminalContext = createContext<TerminalContextType | null>(null);

// 终端配置提供者组件
export const TerminalProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState<TerminalType | null>(null);
  const [currentRow, setCurrentRow] = React.useState<TerminalData | null>(null);
  const [containerName, setContainerName] = React.useState<string | undefined>(undefined);
  const [list, setList] = React.useState<TerminalData[]>([]);

  return (
    <TerminalContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, containerName, setContainerName, list, setList }}>
      {children}
    </TerminalContext.Provider>
  );
};

// 全局终端窗口组件
export const useTerminals = () => {
  const terminalContext = useContext(TerminalContext);

  if (!terminalContext) {
    throw new Error('useTerminal has to be used within <TerminalProvider>');
  }

  return terminalContext;
};
