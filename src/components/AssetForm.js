import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import FileUpload from "react-mui-fileuploader";
import {
  createAsset,
  deleteAsset,
  updateAsset,
} from "../services/asset.service";
import { alertError, alertSuccess } from "../utils/alert.utils";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";

const AssetForm = ({ onSaving, onSave, onDelete }) => {
  const { user } = useSelector((state) => state.account);
  const { asset } = useSelector((state) => state.asset);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
      createAsset({ companyId: user.companyId, name, thumbnailFile })
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

  const handleDelete = () => {
    if (asset?.id) {
      setLoading(true);

      setTimeout(() => deleteAsset(asset.id).then(() => onDelete()), 1000);
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
          <Stack flexDirection={"row"} justifyContent={"space-between"}>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Save
            </LoadingButton>
            {asset?.id && (
              <Button
                color="error"
                variant="outlined"
                disabled={loading}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            )}

            <Dialog
              open={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Please Confirm</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  All associated data will also be deleted
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <LoadingButton
                  variant="outlined"
                  color="error"
                  onClick={handleDelete}
                  loading={loading}
                >
                  Delete
                </LoadingButton>
              </DialogActions>
            </Dialog>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetForm;
