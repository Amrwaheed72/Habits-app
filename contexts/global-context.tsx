import { createContext, ReactNode, useContext, useState } from 'react';

interface GlobalContextProps {
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (state: boolean) => void;
}
const globalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <globalContext.Provider value={{ openDeleteDialog, setOpenDeleteDialog }}>
      {children}
    </globalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(globalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within an GlobalProvider');
  }
  return context;
};
