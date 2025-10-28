import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import ToolBarPlugin from "./plugins/ToolBarPlugin";
import "../../app/editor.css";
import { Button, Form } from "antd";
import { useState } from "react";
import { $getRoot } from "lexical";

interface LexicalEditorComponentProps {
  sendMessageHandler: (values: any) => Promise<void>;
}

const theme = {
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    code: "editor-text-code",
  },
  list: {
    ol: "editor-list-ordered",
    ul: "editor-list-unordered",
    listitem: "editor-list-item",
  },
  quote: "editor-quote",
  code: "editor-code",
  link: "editor-link",
  heading: {
    h1: "editor-h1",
  },
};

// export const LexicalEditorTheme = {
//
//   list: {
//     ol: "editor-list-ordered",
//     ul: "editor-list-unordered",
//     listitem: "editor-list-item",
//   },
//   quote: "editor-quote",
//   code: "editor-code",
//   link: "editor-link",
// };
const LexicalEditorr = ({
  sendMessageHandler,
}: LexicalEditorComponentProps) => {
  const [message, setMessage] = useState();
  function onChange(editorState: any) {
    editorState.read(() => {
      const jsonMessageState = editorState.toJSON();
      setMessage(jsonMessageState);
    });
  }
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError: (error: any) => {
      console.log(error);
    },
    nodes: [QuoteNode, CodeNode, HeadingNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="border-2 border-green-900 rounded-2xl" />
          }
          placeholder={<div className="editor-placeholder">Type here...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <Button
          onClick={(e) => sendMessageHandler(message)}
          className="!mr-2"
          type="primary"
          htmlType="submit"
        >
          Send
        </Button>
        <ToolBarPlugin />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
      </div>
    </LexicalComposer>
  );
};
export { LexicalEditorr };
