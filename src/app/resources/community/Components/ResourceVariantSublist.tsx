import Divider from "@/app/Components/Layout/Divider/Divider";
import Modal from "@/app/Components/Layout/Modal/Modal";

interface VariantSublistProps {
  items: {name: string, link: string}[];
  parentName: string;
  closer: () => void;
}

export default function ResourceVariantSublist(props: VariantSublistProps) {
  return (
    <Modal closeCallback={props.closer}>
      <div className="absolute right-1 bottom-1 border-2 rounded-md bg-jj-mpurple-1 pt-2 pb-2">
        {props.items.map((item, i) => (
          <div key={`${props.parentName}-${item.name}`}>
            <a href={item.link} target="_blank" className="text-black underline ml-2 mr-2">{item.name}</a>
            {i + 1 < props.items.length &&
              <Divider className="mt-2 mb-2"/>
            }
          </div>
        ))}
      </div>
    </Modal>
  );
}