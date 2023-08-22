import { Delete, Download, OpenInNew } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { FIELD_FILE } from "../../constants/form.constants";
import { useState } from "react";
import { deleteFile, saveFileCaption } from "../../services/data.service";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { downloadImage } from "../../utils/http.utils";

const DataFileField = ({ file, onDelete }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(file.caption);

  const saveCaption = () => {
    if (caption.trim() != file.caption) {
      saveFileCaption(file.id, caption).then(() =>
        enqueueSnackbar("Caption saved", { variant: "success" })
      );
    }
  };

  const handleDelete = () => {
    setLoading(true);

    deleteFile(file.id)
      .then(() => {
        enqueueSnackbar("File deleted", { variant: "success" });
        onDelete();
      })
      .finally(() => {
        setLoading(false);
        setIsDeleteDialogOpen(false);
      });
  };

  return (
    <Box>
      {file.type == FIELD_FILE ? (
        <ListItem
          secondaryAction={
            <Link href={file.url} target="_blank">
              <IconButton>
                <Download />
              </IconButton>
            </Link>
          }
        >
          <ListItemText
            primary={file.name}
            secondary={
              editingCaption ? (
                <TextField
                  sx={{ marginTop: 1 }}
                  label={"Caption"}
                  autoFocus
                  fullWidth
                  multiline
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  onBlur={() => {
                    setEditingCaption(false);
                    saveCaption();
                  }}
                />
              ) : (
                <Typography
                  onClick={() => setEditingCaption(true)}
                  variant="caption"
                >
                  {caption || <i>Click to add caption</i>}
                </Typography>
              )
            }
          />
        </ListItem>
      ) : (
        <Card raised={true}>
          <CardActionArea
            sx={{
              "&:hover > .fileControls": {
                display: "flex",
              },
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={file.url}
              alt={caption}
            ></CardMedia>
            <CardContent onClick={() => setEditingCaption(true)}>
              {editingCaption ? (
                <TextField
                  label={"Caption"}
                  autoFocus
                  fullWidth
                  multiline
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  onBlur={() => {
                    setEditingCaption(false);
                    saveCaption();
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {caption || <i>Click to add caption</i>}
                </Typography>
              )}
            </CardContent>
            <Stack
              className="fileControls"
              sx={{
                display: "none",
                position: "absolute",
                top: 8,
                right: 8,
                width: "100%",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              <Stack
                sx={{
                  gap: 0.5,
                  backgroundColor: theme.palette.background.paper,
                  alignItems: "center",
                  border: `1px solid ${theme.palette.background.default}`,
                }}
              >
                <Link href={file.url} target="_blank">
                  <IconButton size="small">
                    <OpenInNew fontSize="small" />
                  </IconButton>
                </Link>

                <IconButton onClick={() => downloadImage(file.url, file.name)}>
                  <Download fontSize="small" />
                </IconButton>

                <Divider />
                <IconButton
                  size="small"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </CardActionArea>
        </Card>
      )}

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Are you sure you want to delete this file permanently?
        </DialogTitle>
        <DialogActions>
          <Button
            disabled={loading}
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <LoadingButton loading={loading} onClick={handleDelete} color="error">
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataFileField;
