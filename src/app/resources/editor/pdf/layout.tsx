

import { getBucketURL } from "@/app/Utilities/aws.utility";
import CharacterManagementContextProvider from "../Components/CharacterManagement/CharacterManagementContext";

export default async function CharacterPdfLayout({children}: {children: React.ReactNode}) {
  const bucketUrl = await getBucketURL();

  return (
    <CharacterManagementContextProvider bucketUrl={bucketUrl}>
      {children}
    </CharacterManagementContextProvider>
  );
}