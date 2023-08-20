import { Box, Modal } from "@mui/material";

const FullScreenViewer = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          backgroundColor: "#DFDEDD",
          p: 0,
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default FullScreenViewer;
