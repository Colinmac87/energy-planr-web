import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import FileUpload from "react-mui-fileuploader";
import { createLocation, updateLocation } from "../services/location.service";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const LocationForm = ({ assetId, location, onSaving, onSave, onCancel }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(location?.name);
  const [backgroundMapFile, setBackgroundMapFile] = useState(null);

  const onFileUploadChanges = (files) => {
    if (files.length > 0) setBackgroundMapFile(files[0]);
  };
  const onFileUploadError = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSaving();

    if (location?.id) {
      updateLocation(location.id, { name, backgroundMapFile })
        .then(() => {
          enqueueSnackbar("Changes saved.", { variant: "success" });
          onSave();
        })
        .catch(() => {
          enqueueSnackbar(
            "Unable to save changes, please try again or contact us.",
            { variant: "error" }
          );
        })
        .finally(() => setLoading(false));
    } else {
      createLocation(assetId, { name, backgroundMapFile })
        .then((locationId) => {
          if (locationId) {
            enqueueSnackbar("New location created.", { variant: "success" });
            onSave();
          } else {
            enqueueSnackbar(
              "Unable to create location, please try again or contact us.",
              { variant: "error" }
            );
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <Box component={"form"} onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Add new Location</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id={"location-name"}
            label={"Location Name"}
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            getBase64={false}
            multiFile={false}
            disabled={loading}
            title="Background"
            header={location ? "Drag a new file here" : "Drop file here"}
            leftLabel="or"
            rightLabel="to select file"
            buttonLabel="click here"
            buttonRemoveLabel="Remove all"
            maxFileSize={20}
            maxUploadFiles={1}
            maxFilesContainerHeight={357}
            acceptedType={"image/*"}
            onFilesChange={onFileUploadChanges}
            onError={onFileUploadError}
            BannerProps={{
              elevation: 0,
              variant: "outlined",
              sx: { background: "black" },
            }}
            imageSrc={
              location?.backgroundMapUrl ||
              "https://www.pngplay.com/wp-content/uploads/8/Upload-Icon-Logo-Transparent-File.png"
            }
            showPlaceholderImage={true}
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
          <Stack flexDirection={"row"} justifyContent={"space-between"}>
            <Button variant="outlined" disabled={loading} onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationForm;
