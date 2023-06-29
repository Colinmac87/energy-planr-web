import { UploadFile } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { FIELD_IMAGE } from "../../constants/form.constants";
import { LoadingButton } from "@mui/lab";
import { uploadFile } from "../../services/storage.service";
import { useSnackbar } from "notistack";

const FormFileUploadField = ({ type, onUpload }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    setLoading(true);

    uploadFile(file)
      .then((url) => {
        onUpload({ name: file.name, url: url, caption: caption })
          .then(() => {
            setFile(null);
            setCaption("");
            enqueueSnackbar("File uploaded.", { variant: "success" });
          })
          .finally(() => setLoading(false));
      })
      .catch((error) => {
        enqueueSnackbar("Unable to upload file.", { variant: "error" });
        setLoading(false);
      });
  };

  return (
    <Stack
      sx={{
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        padding: 2,
      }}
    >
      <Stack
        sx={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button variant="outlined" component="label" disabled={loading}>
          {file ? "Change File" : "Select File"}
          <input
            type="file"
            accept={type == FIELD_IMAGE ? "image/*" : "*"}
            hidden
            onChange={onFileSelect}
          />
        </Button>
      </Stack>
      <TextField
        flex={1}
        fullWidth
        label="Caption"
        placeholder="Write about the file here"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        disabled={loading}
      />
      <LoadingButton
        disabled={file == null}
        loading={loading}
        variant="contained"
        startIcon={<UploadFile />}
        sx={{
          flexDirection: "column",
        }}
        onClick={handleUpload}
      >
        Upload
      </LoadingButton>
    </Stack>
  );
};

export default FormFileUploadField;
