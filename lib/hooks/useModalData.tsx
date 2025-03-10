import { create } from "zustand";

interface ModalData {
  confirmBorrowModal: Book | null;
  codeBorrowModal: boolean;
  toastMessage: string;
  setConfirmBorrowModal: (book: Book | null) => void;
  setCodeBorrowModal: (code: boolean) => void;
  setToastMessage: (message: string) => void;
}

export const useModalData = create<ModalData>((set) => ({
  confirmBorrowModal: null,
  codeBorrowModal: false,
  toastMessage: "",
  setConfirmBorrowModal: (book) => set({ confirmBorrowModal: book }),
  setCodeBorrowModal: (code) => set({ codeBorrowModal: code }),
  setToastMessage: (message) => set({ toastMessage: message }),
}));
