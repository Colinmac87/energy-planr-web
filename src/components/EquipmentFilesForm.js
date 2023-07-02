import {
  Box,
  Button,
  Drawer,
  Grid,
  List,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import FormFileUploadField from "./formUI/FormFileUploadField";
import { useEffect, useState } from "react";
import { addFile, getFiles } from "../services/data.service";
import DataFileField from "./dataUI/DataFileField";
import { FIELD_FILE } from "../constants/form.constants";
import { UploadFile } from "@mui/icons-material";

const EquipmentFilesForm = ({ dataId, type }) => {
  const theme = useTheme();

  const [isFileUploadFormOpen, setIsFileUploadFormOpen] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    getFiles(dataId, type).then((_files) => setFiles(_files));
  };

  const renderFiles = () => {
    if (files.length == 0)
      return (
        <Grid item md={12}>
          <Typography variant="body1">No files</Typography>
        </Grid>
      );

    if (type == FIELD_FILE)
      return (
        <Grid item md={12}>
          <Paper>
            <List>
              {files.map((file) => (
                <DataFileField file={file} onDelete={loadFiles} />
              ))}
            </List>
          </Paper>
        </Grid>
      );
    return files.map((file) => (
      <Grid item lg={2} md={3}>
        <DataFileField file={file} onDelete={loadFiles} />
      </Grid>
    ));
  };

  return (
    <Grid container gap={2}>
      <Grid item md={12} sx={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          onClick={() => setIsFileUploadFormOpen(true)}
          startIcon={<UploadFile />}
        >
          Upload
        </Button>
      </Grid>
      {renderFiles()}

      <Drawer
        anchor={"right"}
        open={isFileUploadFormOpen}
        onClose={() => setIsFileUploadFormOpen(false)}
        sx={{
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: 440,
            flex: 1,
            height: "100%",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <FormFileUploadField
            type={type}
            onUpload={(files) => {
              files.forEach(({ name, url, caption }) =>
                addFile(dataId, {
                  fileName: name,
                  fileUrl: url,
                  fileCaption: caption,
                  fileType: type,
                })
              );
              loadFiles();
              setIsFileUploadFormOpen(false);
            }}
          />
        </Box>
      </Drawer>
    </Grid>
  );
};

export default EquipmentFilesForm;
