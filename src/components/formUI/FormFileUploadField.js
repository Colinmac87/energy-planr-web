import { UploadFile } from "@mui/icons-material";
import { Paper, useTheme } from "@mui/material";
import { useState } from "react";
import { FIELD_IMAGE } from "../../constants/form.constants";
import { LoadingButton } from "@mui/lab";
import { uploadFile } from "../../services/storage.service";
import { useSnackbar } from "notistack";
import FileUpload from "react-mui-fileuploader";

const FormFileUploadField = ({ type, onUpload }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFileSelect = (_files) => {
    setFiles(_files);
  };

  const onFileSelectError = (e) => {
    console.log(e);
  };

  const handleUpload = async () => {
    if (files.length < 1) {
      enqueueSnackbar(`Please select at least one file to upload`, {
        variant: "warning",
      });
      return;
    }

    setLoading(true);

    let uploadedFiles = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      try {
        const url = await uploadFile(file);
        uploadedFiles.push({ name: file.name, url: url, caption: "" });
      } catch (error) {
        enqueueSnackbar(`Unable to upload file (${file.name})`, {
          variant: "error",
        });
      }
    }

    await onUpload(uploadedFiles);

    enqueueSnackbar(`Files uploaded`, {
      variant: "success",
    });
    setLoading(false);
    setFiles([]);
  };

  return (
    <Paper sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
      <FileUpload
        getBase64={false}
        multiFile={true}
        disabled={loading}
        title=""
        header={"Drop files here"}
        leftLabel="or"
        rightLabel="to select file"
        buttonLabel="click here"
        buttonRemoveLabel="Remove all"
        maxFileSize={25}
        acceptedType={type == FIELD_IMAGE ? "image/*" : "*"}
        onFilesChange={onFileSelect}
        onError={onFileSelectError}
        imageSrc={
          "https://www.pngplay.com/wp-content/uploads/8/Upload-Icon-Logo-Transparent-File.png"
        }
        showPlaceholderImage={true}
        onContextReady={(context) => {}}
        PlaceholderGridProps={{ md: 12 }}
        LabelsGridProps={{ md: 12 }}
        ContainerProps={{
          sx: {
            p: 0,
            backgroundColor: "transparent",
            border: "none",
            "& .MuiTypography-root": {
              color: theme.palette.text.primary,
            },
            "& .MuiButton-root": {
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
          },
        }}
        BannerProps={{
          elevation: 0,
          sx: {
            backgroundColor: "transparent",
          },
        }}
      />

      <LoadingButton
        loading={loading}
        variant="contained"
        startIcon={<UploadFile />}
        onClick={handleUpload}
        sx={{ flex: 1, width: "100%", mt: 2 }}
      >
        Upload Files
      </LoadingButton>
    </Paper>
  );
};

export default FormFileUploadField;
