import { RulesTabData } from "@/app/Models/Rules.model";

export default function RulesContent({data}: {data: RulesTabData | undefined}) {
  if (!data)
    return <div className="h-full"><h2>Error</h2><p>Content not found. Please contact an administrator.</p></div>

  return (
    <div className="h-full w-full">
      <div className="p-2 lg:p-8 pt-2">
        <h2 className="text-center">{data.title}</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec blandit nisi. Morbi augue ex, posuere eget enim porta, venenatis convallis lorem. Duis efficitur vulputate metus, sit amet rhoncus quam ullamcorper non. Duis pulvinar purus quis facilisis sagittis. Donec pretium purus cursus nulla dapibus, sed ultrices odio posuere. Ut eu sagittis dolor. In interdum sapien nulla, vitae placerat ante pharetra sit amet. Phasellus cursus lectus in nulla venenatis, vel pretium est tempor.
          <br/><br/>
          Morbi fringilla sit amet ligula non venenatis. Sed condimentum odio erat, vulputate bibendum velit lacinia eget. Nunc quis convallis lacus. Nullam elit enim, euismod eu egestas at, imperdiet eget arcu. Etiam id ultrices massa, et fermentum nulla. Suspendisse vehicula erat sit amet risus egestas euismod facilisis at arcu. Morbi in arcu vitae lectus hendrerit cursus a nec tortor. Quisque ultricies lacinia vehicula. Nunc vestibulum dolor sit amet nisi varius pharetra. Praesent cursus posuere ipsum et blandit.
          <br/><br/>
          Cras auctor placerat massa volutpat convallis. In malesuada blandit libero, a mattis elit condimentum ac. Ut ut diam in felis convallis interdum sit amet non lacus. Aliquam a tortor quis magna consequat rhoncus eu sed arcu. Aenean egestas efficitur rhoncus. Fusce pharetra, nibh eu pellentesque mattis, quam velit dignissim mi, et maximus nulla nibh et sapien. In vel blandit turpis, sit amet porttitor elit. Sed a orci ipsum. Nullam tristique rutrum elementum. Vestibulum sodales orci dolor, quis tincidunt felis varius quis. Nullam vel lorem at mauris interdum vulputate non vel magna. Duis ut molestie tortor, a venenatis risus.
          <br/><br/>
          Phasellus vitae metus dui. Sed rutrum, ante at pretium maximus, mi nisi blandit dolor, nec pretium velit odio a lacus. Ut imperdiet leo sed enim sagittis ultricies ut vitae lacus. Aliquam erat volutpat. Morbi in volutpat dolor. Suspendisse potenti. Donec est tortor, congue a accumsan ut, hendrerit quis quam. Fusce aliquet gravida volutpat. Duis ornare urna non purus mollis tempus. Nulla lorem diam, dapibus nec leo sed, consectetur imperdiet metus. Suspendisse non tristique massa. In faucibus blandit nisi vitae fermentum. Praesent ornare mauris quam, et bibendum mauris volutpat in.
          <br/><br/>
          Nulla ullamcorper dolor sit amet est tempus pellentesque. Donec finibus sagittis leo sit amet ultricies. Praesent velit nulla, facilisis vitae metus ac, laoreet malesuada ex. Mauris porttitor nulla quam, malesuada viverra tellus hendrerit non. Praesent tristique magna eget eros vulputate lacinia. Aliquam diam magna, luctus in eros ac, ultrices congue nisl. Quisque maximus dolor vitae dictum convallis. Ut et ultricies urna.
        </p>
      </div>
    </div>
  );
}