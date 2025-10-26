import { ElementType } from "react";
import ContentHeading from "../Layout/Typography/ContentHeading";
import PreviewLink from "./PreviewLink";
import parse, {DOMNode, Element, domToReact} from "html-react-parser";

export default function HTMLInclusiveText({text, as, className}: {text: string, as?: React.ElementType, className?: string}) {
  const Tag = as || "span";

  const content = parse(text, {
    replace(elem) {
      if (elem instanceof Element) {
        switch (elem.tagName) {
          case "preview":
            const url = elem.attribs["href"];
            return <PreviewLink href={url}>{domToReact(elem.children as DOMNode[])}</PreviewLink>;
          case "heading":
            const variant = elem.attribs["as"];
            const className = elem.attribs["class"];
            return <ContentHeading as={variant as ElementType ?? "h2"} className={className}>{domToReact(elem.children as DOMNode[])}</ContentHeading>
          default:
            break;
        }
      }
    }
  })
  
  return (
    <Tag className={className}>{content}</Tag>
  )
}