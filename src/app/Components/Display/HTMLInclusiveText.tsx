import PreviewLink from "./PreviewLink";

export default function HTMLInclusiveText({text, as, className}: {text: string, as?: React.ElementType, className?: string}) {
  const Tag = as || "span";
  const content = text.split(/<\/?preview>?/);
  
  return (
    <Tag className={className}>
      {
        content.map((c, i) => {
          if (i % 2 == 1)
          {
            const url = c.replace(/(^.*href='|'>.*)/g, "");
            const label = c.replace(/(^.*'>)/, "");
            return <PreviewLink key={`preview-${i}`} href={url}>{label}</PreviewLink>;
          }
          else
            return <span key={`text-${i}`} dangerouslySetInnerHTML={{__html: c}}/>
        })
      }
    </Tag>
    
  )
}