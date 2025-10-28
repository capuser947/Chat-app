import React from "react";
import { TMessage } from "../(main)/chat/[id]/page";
import DOMPurify from "dompurify";
import RenderLexicalHtml from "./RenderHtmlFromEditorState";
interface AllMessagesRendererProps {
  from: any;
  to: any;
  message: TMessage;
}
const AllMessagesRenderer = ({
  from,
  to,
  message,
}: AllMessagesRendererProps) => {
  const html = RenderLexicalHtml(message.encryptedMessage);
  console.log("AllMessagesRendererProps : ", {
    from,
    to,
    message,
  });
  if (!html) return;
  const cleanHtml = DOMPurify.sanitize(html);
  return (
    <div dangerouslySetInnerHTML={{ __html: cleanHtml }}>
      {/* <Message
      model={{
        direction: message.from === from._id ? "outgoing" : "incoming",
        position: "single",
        message: html,
        sender: message.from === from._id ? from.name : to.name,
        sentTime: new Date().toLocaleTimeString(),
      }}
    /> */}
    </div>
  );
};

export default AllMessagesRenderer;
