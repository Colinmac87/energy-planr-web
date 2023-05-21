import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const FormRichTextField = ({ field, value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
  });

  return (
    <div
      style={{
        border: "1px solid #fff4 !important",
        borderRadius: 3,
        padding: "0px 12px",
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
};

export default FormRichTextField;
