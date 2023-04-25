import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import FileUpload from "react-mui-fileuploader";

const LevelForm = () => {
  const onFileUploadChanges = () => {};
  const onFileUploadError = () => {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Add new Level</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id={"Level-name"}
          label={"Level Name"}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <FileUpload
          getBase64={false}
          multiFile={false}
          disabled={false}
          title="Thumbnail"
          header="Drop file here"
          leftLabel="or"
          rightLabel="to select files"
          buttonLabel="click here"
          buttonRemoveLabel="Remove all"
          maxFileSize={0}
          maxUploadFiles={0}
          maxFilesContainerHeight={357}
          acceptedType={"image/*"}
          errorSizeMessage={
            "fill it or remove it to use the default error message"
          }
          //allowedExtensions={["jpg", "jpeg"]}
          onFilesChange={onFileUploadChanges}
          onError={onFileUploadError}
          //imageSrc={'path/to/custom/image'}
          BannerProps={{ elevation: 0, variant: "outlined" }}
          onContextReady={(context) => {}}
          PlaceholderGridProps={{ md: 6 }}
          LabelsGridProps={{ md: 6 }}
          ContainerProps={{
            elevation: 0,
            variant: "outlined",
            sx: { p: 1 },
          }}
          placeholderImageDimension={{
            xs: { width: 128, height: 128 },
            sm: { width: 128, height: 128 },
            md: { width: 164, height: 164 },
            lg: { width: 256, height: 256 },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained">Save</Button>
      </Grid>
    </Grid>
  );
};

export default LevelForm;
