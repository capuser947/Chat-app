import { $generateHtmlFromNodes } from "@lexical/html";
import { createEditor } from "lexical";
import { CodeNode } from "@lexical/code";
import { ListNode, ListItemNode } from "@lexical/list";
import { QuoteNode, HeadingNode } from "@lexical/rich-text";

const RenderLexicalHtml = (editorStateJSON: any) => {
  if (!editorStateJSON) return "";

  // Create a temporary editor (no DOM needed)
  const editor = createEditor({
    nodes: [ListNode, ListItemNode, CodeNode, QuoteNode, HeadingNode],
  });

  // Parse the JSON into an EditorState
  const editorState = editor.parseEditorState(editorStateJSON);

  // Use .read() to generate HTML from the parsed state
  let html = "";
  editorState.read(() => {
    console.log("sss");
    html = $generateHtmlFromNodes(editor);
  });
  console.log("htmlhtmlhtmlhtml", html);
  return html;
};

export default RenderLexicalHtml;
