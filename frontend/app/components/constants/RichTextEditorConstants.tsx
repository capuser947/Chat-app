import {
  RxFontBold,
  RxFontItalic,
  RxStrikethrough,
  RxCode,
  RxHeading,
} from "react-icons/rx";
import {
  MdFormatUnderlined,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdFormatQuote,
} from "react-icons/md";
import { PiCodeBlockLight } from "react-icons/pi";
import { BiLink } from "react-icons/bi";
import { AiOutlineStrikethrough } from "react-icons/ai";

export interface RichTextItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type?: "button" | "divider";
}

export const RICH_TEXT_ITEMS: RichTextItem[] = [
  { key: "bold", label: "Bold", icon: <RxFontBold />, type: "button" },
  { key: "italic", label: "Italic", icon: <RxFontItalic />, type: "button" },
  {
    key: "underline",
    label: "Underline",
    icon: <MdFormatUnderlined />,
    type: "button",
  },
  {
    key: "strikethrough",
    label: "Strikethrough",
    icon: <AiOutlineStrikethrough />,
    type: "button",
  },
  { key: "divider-1", label: "Divider", type: "divider" },

  { key: "link", label: "Link", icon: <BiLink />, type: "button" },
  {
    key: "orderedList",
    label: "Ordered List",
    icon: <MdFormatListNumbered />,
    type: "button",
  },
  {
    key: "unorderedList",
    label: "Unordered List",
    icon: <MdFormatListBulleted />,
    type: "button",
  },
  { key: "divider-2", label: "Divider", type: "divider" },

  { key: "h1", label: "H1", icon: <RxHeading />, type: "button" },
  { key: "quote", label: "Quote", icon: <MdFormatQuote />, type: "button" },
  { key: "code", label: "Inline Code", icon: <RxCode />, type: "button" },
  {
    key: "code-block",
    label: "Code Block",
    icon: <PiCodeBlockLight />,
    type: "button",
  },
];
