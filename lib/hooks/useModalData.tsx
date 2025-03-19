import { create } from "zustand";

type ToastMessageType = "Error" | "Success" | "Info" | "Null";

interface ModalData {
  confirmBorrowModal: Book | null;
  codeBorrowModal: boolean;
  returnConfirmModal: Book | null;
  toastMessage: {
    message: string;
    type: ToastMessageType;
  };
  loading: boolean;
  setConfirmBorrowModal: (book: Book | null) => void;
  setCodeBorrowModal: (code: boolean) => void;
  setToastMessage: (message: string, type: ToastMessageType) => void;
  setLoading: (isLoading: boolean) => void;
  setReturnConfirmModal: (book: Book | null) => void;
}

export const useModalData = create<ModalData>((set) => ({
  confirmBorrowModal: null,
  codeBorrowModal: false,
  returnConfirmModal: null,
  toastMessage: {
    message: "",
    type: "Null",
  },
  loading: false,
  setConfirmBorrowModal: (book) => set({ confirmBorrowModal: book }),
  setCodeBorrowModal: (code) => set({ codeBorrowModal: code }),
  setToastMessage: (message, type) =>
    set({
      toastMessage: {
        message,
        type,
      },
    }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setReturnConfirmModal: (book) => set({ returnConfirmModal: book }),
}));
