import { Close, UploadFile } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FIELD_FILES } from "../../constants/form.constants";

const FormFileUploadField = ({ onChange }) => {
  const { asset } = useSelector((state) => state.asset);

  const [field, setField] = useState(FIELD_FILES);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const onFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Stack sx={{ padding: 2, gap: 2 }}>
      <Stack sx={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
        {/* <FormControl sx={{ flex: 1 }}>
          <InputLabel>Field</InputLabel>
          <Select
            fullWidth
            label={"Field"}
            value={field}
            onChange={(e) => {
              setField(e.target.value);
            }}
            readOnly={file != null}
          >
            {asset.formFields
              .filter(
                (field) =>
                  field.type == FIELD_FILES || field.type == FIELD_IMAGE
              )
              .map((field) => (
                <MenuItem value={field.type}>
                  {field.type == FIELD_IMAGE ? "Image" : "File"}
                </MenuItem>
              ))}
          </Select>
        </FormControl> */}
        <Stack
          sx={{
            flex: 1,
            height: 56,
            flexDirection: "row",
            border: "1px solid #555",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 1,
            p: 1,
            gap: 3,
          }}
        >
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Button variant="outlined" component="label">
              {file ? "Change File" : "Select File"}
              <input type="file" hidden onChange={onFileSelect} />
            </Button>
            <Typography>{file?.name}</Typography>
          </Stack>
          {file && (
            <IconButton onClick={() => setFile(null)}>
              <Close />
            </IconButton>
          )}
        </Stack>
        <Button
          variant="contained"
          startIcon={<UploadFile />}
          sx={{
            flexDirection: "column",
          }}
        >
          Upload
        </Button>
      </Stack>
      <TextField
        fullWidth
        label="Caption"
        placeholder="Write about the file here"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      ></TextField>
    </Stack>
    // <FileUpload
    //   getBase64={false}
    //   multiFile={false}
    //   //   disabled={loading}
    //   title={field.name}
    //   header={"Drop file here"}
    //   leftLabel="or"
    //   rightLabel="to select file"
    //   buttonLabel="click here"
    //   buttonRemoveLabel="Remove all"
    //   maxFileSize={20}
    //   maxUploadFiles={field.meta?.maxNoOfFiles || 1}
    //   maxFilesContainerHeight={357}
    //   //   acceptedType={"image/*"}
    //   onFilesChange={onFileUploadChanges}
    //   onError={onFileUploadError}
    //   BannerProps={{
    //     elevation: 0,
    //     variant: "outlined",
    //     sx: { background: "black" },
    //   }}
    //   showPlaceholderImage={true}
    //   onContextReady={(context) => {}}
    //   PlaceholderGridProps={{ md: 6 }}
    //   LabelsGridProps={{ md: 6 }}
    //   ContainerProps={{
    //     elevation: 0,
    //     variant: "outlined",
    //     sx: { p: 1 },
    //   }}
    //   placeholderImageDimension={{
    //     xs: { height: 128 },
    //     sm: { height: 128 },
    //     md: { height: 164 },
    //     lg: { height: 256 },
    //   }}
    // />
  );
};

export default FormFileUploadField;
