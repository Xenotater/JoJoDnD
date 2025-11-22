"use client";

import { FancyImage } from "@/app/Components/Layout/FancyImage/FancyImage";
import { postS3File } from "@/app/Utilities/aws.utility";
import { useState } from "react";

export default function Temp({bucket}: {bucket: string}) {
  const [img, setImg] = useState("");

  const handleUpload = async () => {
    const uploader = document.querySelector("input[type='file']") as HTMLInputElement;
    const files = uploader.files;
    if (files?.length) {
      console.log(files[0])
      const data = new FormData();
      data.append("file", files[0]);
      postS3File(data, "CommunityResources/Images/" + "Test.webp", "image/**").then(() => 
        setImg(files[0].name)
      );
    }
  }

  return (
    <>
      <button onClick={() => handleUpload()}>Upload</button>
      <FancyImage src={`${bucket}/CommunityResources/Images/Test.webp${img ? `?v=${img}` : ""}`} type="border" alt="default"/>
    </>
  )
}