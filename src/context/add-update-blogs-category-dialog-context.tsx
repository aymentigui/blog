"use client";

import { createContext, useContext, useState } from "react";

type DataType = {
  id: string;
  name: string;
  namefr: string;
  namear: string;
};

type DialogContextType = {
  isOpen: boolean;
  isAdd: boolean;
  data?: DataType;
  openDialog: (isAdd?: boolean, data?: DataType) => void;
  closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const AddUpdateBlogsCategoryDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [data, setData] = useState<DataType>();

  const openDialog = (isAdd?: boolean, data?: DataType) => {
    if (isAdd !== undefined) setIsAdd(isAdd);
    if (data) setData(data)
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setIsAdd(true);
    setData(undefined);
  };

  return (
    <DialogContext.Provider value={{ isOpen, isAdd, data, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useAddUpdateBlogsCategoryDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};