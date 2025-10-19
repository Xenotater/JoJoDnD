import PreviewLink from "./PreviewLink";
import parse, {DOMNode, Element, domToReact} from "html-react-parser";

export default function HTMLInclusiveText({text, as, className}: {text: string, as?: React.ElementType, className?: string}) {
  const Tag = as || "span";

  const content = parse(text, {
    replace(elem) {
      if (elem instanceof Element && elem.tagName == "preview") {
        const url = elem.attribs["href"];
        return <PreviewLink href={url}>{domToReact(elem.children as DOMNode[])}</PreviewLink>;
      }
    }
  })
  
  return (
    <Tag className={className}>{content}</Tag>
  )
}