import {
  FormatBold,
  FormatColorFill,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatStrikethrough,
  HorizontalRule,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Popover,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

const FormRichTextField = ({ field, value, onChange, readOnly = false }) => {
  const theme = useTheme();

  const [writeTimeout, setWriteTimeout] = useState(null);
  const [formats, setFormats] = useState([
    "bold",
    "italic",
    "strike",
    "orderedList",
    "bulletList",
    "p",
    "h1",
    "h3",
    "h4",
    "blockquote",
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const isColorPickerOpen = Boolean(anchorEl);
  const colorPickerId = isColorPickerOpen ? "simple-popover" : undefined;

  const onColorPickerOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editor = useEditor({
    extensions: [
      TextStyle,
      Color,
      ,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      clearTimeout(writeTimeout);
      setWriteTimeout(setTimeout(() => onChange(editor.getHTML()), 2000));
    },
    editable: !readOnly,
  });

  const renderMenuBar = () => {
    if (!editor) return null;

    return (
      <Stack sx={{ margin: 1, pt: 1 }} flexDirection={"row"} gap={1}>
        <ToggleButtonGroup
          value={formats}
          aria-label="text formatting"
          size="small"
        >
          <ToggleButton
            value={editor.isActive("bold") ? "bold" : ""}
            aria-label="bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <FormatBold fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value={editor.isActive("italic") ? "italic" : ""}
            aria-label="italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <FormatItalic fontSize="small" />
          </ToggleButton>
          {/* <ToggleButton
            value="underlined"
            aria-label="underlined"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <FormatUnderlined fontSize="small" />
          </ToggleButton> */}
          <ToggleButton
            value={editor.isActive("strike") ? "strike" : ""}
            aria-label="stikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          >
            <FormatStrikethrough fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={formats}
          aria-label="text formatting"
          size="small"
        >
          <ToggleButton
            value={editor.isActive("bulletList") ? "bulletList" : ""}
            aria-label="unordered list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            <FormatListBulleted fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value={editor.isActive("orderedList") ? "orderedList" : ""}
            aria-label="ordered list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumbered fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={formats}
          aria-label="text formatting"
          size="small"
        >
          <ToggleButton
            value={editor.isActive("paragraph") ? "p" : ""}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            P
          </ToggleButton>
          <ToggleButton
            value={editor.isActive("heading", { level: 1 }) ? "h1" : ""}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </ToggleButton>
          <ToggleButton
            value={editor.isActive("heading", { level: 3 }) ? "h3" : ""}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H2
          </ToggleButton>
          <ToggleButton
            value={editor.isActive("heading", { level: 4 }) ? "h4" : ""}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            H3
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={formats}
          aria-label="text formatting"
          size="small"
        >
          <ToggleButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <HorizontalRule fontSize="small" />
          </ToggleButton>
          <ToggleButton
            value={editor.isActive("blockquote") ? "blockquote" : ""}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FormatQuote fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={formats}
          aria-label="text formatting"
          size="small"
        >
          <ToggleButton
            onClick={onColorPickerOpen}
            aria-describedby={colorPickerId}
          >
            <FormatColorFill
              fontSize="small"
              sx={{ color: editor.getAttributes("textStyle").color }}
            />
          </ToggleButton>
        </ToggleButtonGroup>

        <Popover
          id={colorPickerId}
          open={isColorPickerOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <ToggleButtonGroup aria-label="font color" size="small">
            <Stack>
              <Stack flexDirection={"row"}>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() => editor.chain().focus().setColor("#fff").run()}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#fff",
                    }}
                  ></Box>
                </ToggleButton>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() => editor.chain().focus().setColor("#000").run()}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#000",
                    }}
                  ></Box>
                </ToggleButton>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() => editor.chain().focus().setColor("#f00").run()}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#f00",
                    }}
                  ></Box>
                </ToggleButton>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() => editor.chain().focus().setColor("#0f0").run()}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#0f0",
                    }}
                  ></Box>
                </ToggleButton>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() => editor.chain().focus().setColor("#00f").run()}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#00f",
                    }}
                  ></Box>
                </ToggleButton>
              </Stack>
              <Stack flexDirection={"row"}>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() =>
                    editor.chain().focus().setColor("#ff8000").run()
                  }
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#ff8000",
                    }}
                  ></Box>
                </ToggleButton>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() =>
                    editor.chain().focus().setColor("#ffff00").run()
                  }
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#ffff00",
                    }}
                  ></Box>
                </ToggleButton>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() =>
                    editor.chain().focus().setColor("#8000ff").run()
                  }
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#8000ff",
                    }}
                  ></Box>
                </ToggleButton>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() =>
                    editor.chain().focus().setColor("#ff00ff").run()
                  }
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#ff00ff",
                    }}
                  ></Box>
                </ToggleButton>
                <ToggleButton
                  size="small"
                  sx={{ p: 0 }}
                  onClick={() =>
                    editor.chain().focus().setColor("#808080").run()
                  }
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#808080",
                    }}
                  ></Box>
                </ToggleButton>
              </Stack>
            </Stack>
          </ToggleButtonGroup>
        </Popover>
      </Stack>
    );
  };

  return (
    <Stack style={{ position: "relative" }}>
      <div
        style={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 4,
        }}
      >
        {!readOnly && (
          <>
            {renderMenuBar()}
            <Divider />
          </>
        )}
        <EditorContent editor={editor} style={{ padding: "0px 10px" }} />
      </div>
    </Stack>
  );
};

export default FormRichTextField;
