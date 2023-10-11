import {
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import FileUpload from "react-mui-fileuploader";
import { createLocation, updateLocation } from "../services/location.service";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const LocationForm = ({ assetId, location, onSaving, onSave, onCancel }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(location?.name);
  const [backgroundMapFile, setBackgroundMapFile] = useState(null);
  const [defaultZoomPercentage, setDefaultZoomPercentage] = useState(
    location?.defaultZoomPercentage || 10
  );

  const onFileUploadChanges = (files) => {
    if (files.length > 0) setBackgroundMapFile(files[0]);
  };
  const onFileUploadError = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSaving();

    if (location?.id) {
      updateLocation(location.id, {
        name,
        backgroundMapFile,
        defaultZoomPercentage,
      })
        .then(() => {
          enqueueSnackbar("Changes saved", { variant: "success" });
          onSave();
        })
        .catch(() => {
          enqueueSnackbar(
            "Unable to save changes, please try again or contact us",
            { variant: "error" }
          );
        })
        .finally(() => setLoading(false));
    } else {
      createLocation(assetId, {
        name,
        backgroundMapFile,
        defaultZoomPercentage,
      })
        .then((locationId) => {
          if (locationId) {
            enqueueSnackbar("New location created", { variant: "success" });
            onSave();
          } else {
            enqueueSnackbar(
              "Unable to create location, please try again or contact us",
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
          <Typography variant="h4" mb={2}>
            {location?.id ? "Update" : "New"} Location
          </Typography>
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
          <Box
            sx={{
              position: "relative",
              border: `1px solid ${theme.palette.grey[700]}`,
              py: 1,
            }}
          >
            <Typography
              sx={{
                position: "absolute",
                top: -11,
                left: 9,
                px: 0.6,
                backgroundColor: theme.palette.background.paper,
              }}
              variant="caption"
            >
              Background
            </Typography>
            <FileUpload
              getBase64={false}
              multiFile={false}
              disabled={loading}
              title=""
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
              imageSrc={
                location?.backgroundMapUrl ||
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
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={"Zoom Percentage"}
            variant="outlined"
            type="number"
            fullWidth
            value={defaultZoomPercentage}
            onChange={(e) => setDefaultZoomPercentage(e.target.value)}
            helperText={
              defaultZoomPercentage < 1 ||
              (defaultZoomPercentage > 100 &&
                "Zoom percentage can be between 1 and 100")
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Stack flexDirection={"row"} justifyContent={"space-between"}>
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
