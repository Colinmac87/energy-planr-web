import { Drawer, LinearProgress, Grid, Typography, Box } from "@mui/material";
import { useState } from "react";

const EquipmentFileUpload = ({ file, isOpen, onClose }) => {
  const [isProcessingFile, setIsProcessingFile] = useState(true);

  return (
    <Drawer
      anchor={"bottom"}
      open={isOpen}
      onClose={onClose}
      sx={{ maxHeight: window.outerHeight - 100 }}
    >
      <Box sx={{ p: 4 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h6">Processing File</Typography>
            <Typography variant="body2">Please wait ...</Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        </Grid>
      </Box>
    </Drawer>
  );
};

export default EquipmentFileUpload;
