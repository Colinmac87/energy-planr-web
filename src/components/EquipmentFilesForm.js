import { Grid, List, Paper, Typography } from "@mui/material";
import FormFileUploadField from "./formUI/FormFileUploadField";
import { useEffect, useState } from "react";
import { addFile, getFiles } from "../services/data.service";
import DataFileField from "./dataUI/DataFileField";
import { FIELD_FILE } from "../constants/form.constants";

const EquipmentFilesForm = ({ dataId, type }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    getFiles(dataId, type).then((_files) => setFiles(_files));
  };

  const renderFiles = () => {
    if (files.length == 0)
      return <Typography variant="body1">No files</Typography>;

    if (type == FIELD_FILE)
      return (
        <Grid item md={12}>
          <Paper>
            <List>
              {files.map((file) => (
                <DataFileField file={file} />
              ))}
            </List>
          </Paper>
        </Grid>
      );
    return files.map((file) => (
      <Grid item md={3}>
        <DataFileField file={file} />
      </Grid>
    ));
  };

  return (
    <Grid container gap={2}>
      <Grid item md={8}>
        <Grid container gap={1}>
          {renderFiles()}
        </Grid>
      </Grid>
      <Grid item md={3}>
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
          }}
        />
      </Grid>
    </Grid>
  );
};

export default EquipmentFilesForm;
