import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import FileUpload from "react-mui-fileuploader";
import { createAsset, updateAsset } from "../services/asset.service";
import { alertError, alertSuccess } from "../utils/alert.utils";

const AssetForm = ({ asset, onSaving, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(asset?.name);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const onFileUploadChanges = (files) => {
    if (files.length > 0) setThumbnailFile(files[0]);
  };
  const onFileUploadError = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSaving();

    if (asset?.id) {
      updateAsset(asset.id, { name, thumbnailFile })
        .then(() => {
          alertSuccess("Changes saved.");
          onSave();
        })
        .catch(() => {
          alertError("Unable to save changes, please try again or contact us.");
        })
        .finally(() => setLoading(false));
    } else {
      createAsset({ name, thumbnailFile })
        .then((assetId) => {
          if (assetId) {
            alertSuccess("New asset created.");
            onSave();
          } else {
            alertError(
              "Unable to create asset, please try again or contact us."
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
          <TextField
            id={"asset-name"}
            label={"Asset Name"}
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            getBase64={false}
            multiFile={false}
            disabled={loading}
            title="Thumbnail"
            header={asset ? "Drag a new file here" : "Drop file here"}
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
            imageSrc={asset?.thumbnailUrl}
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
          <Button type="submit" variant="contained" disabled={loading}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetForm;
