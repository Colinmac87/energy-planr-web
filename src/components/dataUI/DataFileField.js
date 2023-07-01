import { Download, OpenInNew } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Link,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FIELD_FILE } from "../../constants/form.constants";
import { useState } from "react";
import { saveFileCaption } from "../../services/data.service";
import { useSnackbar } from "notistack";

const DataFileField = ({ file }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [editingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(file.caption);

  const saveCaption = () => {
    if (caption.trim() != file.caption) {
      saveFileCaption(file.id, caption).then(() =>
        enqueueSnackbar("Caption saved", { variant: "success" })
      );
    }
  };

  if (file.type == FIELD_FILE)
    return (
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
    );

  return (
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
              gap: 2,
              background: "#0006",
              p: 0.5,
            }}
          >
            <Link href={file.url} target="_blank">
              <IconButton size="small">
                <OpenInNew />
              </IconButton>
            </Link>
            {/* <IconButton size="small">
              <Download />
            </IconButton> */}
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default DataFileField;
