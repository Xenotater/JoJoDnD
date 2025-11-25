import Modal from "@/app/Components/Layout/Modal/Modal";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { CommunityResource } from "@/app/Models/Resources.model";
import { useState } from "react";
import CommunityResourceCard from "./CommunityResourceCard";
import Image from "next/image";

export default function NewResourceForm({closer}: {closer: () => void}) {
  const placeholderImage = "/images/misc/placeholder.webp";
  const descLimit = 150;
  const maxFileSize = 5 * 1024 * 1024; //5 MB
  const [formData, setFormData] = useState<CommunityResource>({
    name: "",
    description:  "",
    link:  "",
    variants:  "",
    upvotes: 0,
    status: "pending",
    contact: "",
  });
  const [image, setImage] = useState(placeholderImage);
  const [type, setType] = useState<"Link" | "File" | "HTML" | "Other">("Link");
  const [credit, setCredit] = useState("");

  const handleSubmit = () => {
    console.log(formData);
  }

  const cleanDesc = () => {
    return formData.description.replace(/ Created by .*$/, "");
  }

  const checkFileSize = (fileInput: HTMLInputElement, callback?: () => void) => {
    for (const file of fileInput.files ?? []) {
      if (file.size > maxFileSize) {
        alert("Max allowed file size is " + maxFileSize / (1024 * 1024) + " MB.");
        fileInput.value = "";
      }
    }
    if (fileInput.value != "" && callback)
      callback();
  }

  const previewImage = async (fileInput: HTMLInputElement) => {
    if (fileInput.files?.length == 1) {
      const reader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.onload = () => setImage(reader.result?.toString() ?? "/images/misc/placeholder.webp");
      reader.onerror = () => {
        alert("Invalid file selected.");
        fileInput.value = "";
      }
    }
  }
  
  return (
    <Modal fullPage closeCallback={() => setTimeout(closer, 1)}>
      <form className="content md:w-[60vw] max-h-[85vh] m-auto flex flex-col gap-4 shadow-lg/80 overflow-y-scroll hideScroll" onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
        <ContentHeading className="text-center mb-0">Submit New Resource</ContentHeading>
        <div className="flex flex-col max-w-[360px]">
          <label>Resource Name:</label>
          <input maxLength={50} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required/>
        </div>
        <div className="flex flex-col relative">
          <label>Description:</label>
          <textarea maxLength={descLimit} value={cleanDesc()} onChange={(e) => setFormData({...formData, description: e.target.value + " Created by " + credit + "."})} required className="resize-none field-sizing-content"/>
          <span className={`absolute bottom-1 right-2 ${cleanDesc().length >= descLimit ? "text-red-600" : ""}`}>{cleanDesc().length}/{descLimit}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <label>Image:</label>
              <input type="file" accept="image/*" onChange={(e) => checkFileSize(e.target, () => previewImage(e.target))} required className="w-[100px] md:w-auto"/>
            </div>
            <div className="flex gap-2 items-center">
              <label>Content Type:</label>
              <select value={type} onChange={(e) => setType(e.target.value as "Link" | "File" | "HTML" | "Other")} className="border bg-white">
                <option>Link</option>
                <option>File</option>
                <option>HTML</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>Content:</label>
              {type == "Link" &&
                <input value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} required/>
              }
            </div>
            <div className="flex flex-col">
              <label>Credit Name:</label>
              <input maxLength={50} value={credit} onChange={(e) => {setCredit(e.target.value); setFormData({...formData, description: cleanDesc() + " Created by " + e.target.value + "."})}}
                className="max-w-[250px]" required
              />
            </div>
            <div className="flex flex-col">
              <label>Contact (Email / Discord / Etc.):</label>
              <input maxLength={255} value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})}/>
            </div>
          </div>
          <CommunityResourceCard data={formData} image={<Image src={image} alt="preview image" fill/>}/>
        </div>
        <div className="flex gap-4 justify-center">
          <button className="rounded-md text-2xl bg-gray-200" onClick={closer}>Cancel</button>
          <button type="submit" className="text-2xl rounded-md bg-jj-purple-1 text-white">Submit</button>
        </div>
      </form>
    </Modal>
  );
}