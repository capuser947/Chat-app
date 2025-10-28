import React, { useEffect, useState } from "react";
import { RICH_TEXT_ITEMS } from "../constants/RichTextEditorConstants";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical";

const ToolBarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [activeFormats, setActiveFormats] = useState<Set<string>>();

  const toggleBlockType = (
    createNode: () => any,
    isNodeType: (n: any) => boolean
  ) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const anchorNode = selection.anchor.getNode();
      const selectedBlock = anchorNode.getTopLevelElementOrThrow();
      if (isNodeType(selectedBlock)) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, createNode);
      }
    });
  };

  const handleClick = (key: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        editor.focus();
      }
      console.log(key, "KEYYYYYYYYYY");
      switch (key) {
        case "bold":
        case "italic":
        case "underline":
        case "uppercase":
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, key);
          break;

        case "quote":
          toggleBlockType(() => $createQuoteNode(), $isQuoteNode);
          break;
        case "code-block":
          toggleBlockType(() => $createCodeNode(), $isCodeNode);
          break;

        case "h1":
          toggleBlockType(() => $createHeadingNode("h1"), $isHeadingNode);

        default:
          break;
      }
    });
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      console.log("editorState", editorState);

      editorState.read(() => {
        const root = $getRoot();
        if (!root.getTextContent().trim()) {
          setActiveFormats(new Set<string>());
        }
        const selection = $getSelection();
        console.log("selection", selection);
        if ($isRangeSelection(selection)) {
          const formats = new Set<string>();
          RICH_TEXT_ITEMS.map(({ key }) => {
            if (selection.hasFormat(key as TextFormatType)) {
              formats.add(key);
            }
            setActiveFormats(formats);
          });
        } else setActiveFormats(new Set<string>());
      });
    });
  }, [editor]);

  console.log("activeFormats", activeFormats);

  return (
    <div className="bg-amber-50 p-2 m-0 flex gap-2">
      {RICH_TEXT_ITEMS.map((item) => (
        <div
          key={item.key}
          onClick={() => {
            handleClick(item.key);
          }}
          className={`${
            activeFormats?.has(item.key)
              ? "bg-red-700 text-white"
              : "text-white bg-gray-700"
          }`}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default ToolBarPlugin;
