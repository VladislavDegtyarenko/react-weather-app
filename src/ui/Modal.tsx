import { ReactElement } from "react";
import { Modal as MUIModal, Box } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../hooks/reduxHooks";
import { closeModal } from "../store/modalReducer";

interface ModalProps {
  children: ReactElement;
}

const Modal = ({ children }: ModalProps) => {
  const isOpened = useAppSelector((state) => state.modal.isOpened);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    console.log("close");
    dispatch(closeModal());
  };

  return (
    <MUIModal
      open={isOpened}
      onClose={handleClose}
      aria-labelledby="add city modal"
      aria-describedby="start typing a city name and get city suggestions"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          color: "text.primary",
          p: 2,
          borderRadius: 2,
          maxWidth: "calc(100% - 2em)",
          width: "480px",
        }}
      >
        {children}
      </Box>
    </MUIModal>
  );
};

export default Modal;
