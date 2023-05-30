import { Download, OpenInNew } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FIELD_IMAGE } from "../../constants/form.constants";
import { useState } from "react";

const DataFileField = ({ field, value }) => {
  const [editingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(
    `This is example caption of an ${
      field.type == FIELD_IMAGE ? "image" : "non-image"
    } file type`
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
          image={
            field.type == FIELD_IMAGE
              ? "http://placekitten.com/g/200/300"
              : "https://www.malvernjoggers.co.uk/wp-content/plugins/responsive-menu/v4.0.0/assets/images/no-preview.jpeg"
          }
          alt="green iguana"
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
              onBlur={() => setEditingCaption(false)}
            />
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "pre-line" }}
            >
              {caption}
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
              borderRadius: 50,
            }}
          >
            {field.type == FIELD_IMAGE && (
              <IconButton size="small">
                <OpenInNew />
              </IconButton>
            )}
            <IconButton size="small">
              <Download />
            </IconButton>
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

export default DataFileField;
