import {
  Grid,
  List,
  Paper,
} from "@mui/material";
import FormFileUploadField from "./formUI/FormFileUploadField";
import { useEffect, useState } from "react";
import { addFile, getFiles } from "../services/data.service";
import DataFileField from "./dataUI/DataFileField";
import { FIELD_FILE } from "../constants/form.constants";

const EquipmentFilesForm = ({ dataId, type }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    getFiles(dataId, type).then((_files) => setFiles(_files));
  }, []);

  const renderFiles = () => {
    if (type == FIELD_FILE)
      return (
        <Grid item xs={12}>
          <Paper>
            <List>
              {files.map((file) => (
                <DataFileField file={file} />
              ))}
            </List>
          </Paper>
        </Grid>
      );
    return (
      <Grid item xs={3}>
        {files.map((file) => (
          <DataFileField file={file} />
        ))}
      </Grid>
    );
  };

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <Paper>
          <FormFileUploadField
            type={type}
            onUpload={({ name, url, caption }) => {
              return addFile(dataId, {
                fileName: name,
                fileUrl: url,
                fileCaption: caption,
                fileType: type,
              });
            }}
          />
        </Paper>
      </Grid>
      {renderFiles()}
    </Grid>
  );
};

export default EquipmentFilesForm;
