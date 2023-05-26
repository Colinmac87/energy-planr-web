import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  FormatStrikethrough,
  HorizontalRule,
} from "@mui/icons-material";
import {
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

const FormRichTextField = ({ field, value, onChange, readOnly = false }) => {
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

  const editor = useEditor({
    extensions: [StarterKit],
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
      <Stack sx={{ margin: 1 }} flexDirection={"row"} gap={1}>
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
      </Stack>
    );
  };

  return (
    <Stack>
      {!readOnly && <Typography variant="caption">{field.name}</Typography>}
      <div
        style={{
          border: "1px solid #fff4",
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
