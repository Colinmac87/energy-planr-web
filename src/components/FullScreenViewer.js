import { Box, Grid, Modal } from "@mui/material";

const FullScreenViewer = ({ isOpen, onClose, children }) => {
  const style = {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    // transform: "translate(-50%, -50%)",
    // width: "100%",
    height: "100%",
    bgcolor: "background.paper",
    border: "2px solid #888",
    boxShadow: 24,
    borderRadius: 1,
    p: 0,
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default FullScreenViewer;
