"use client";

import Modal from "@/app/Components/Layout/Modal/Modal";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { CommunityResource } from "@/app/Models/Resources.model";
import { useEffect, useState } from "react";
import CommunityResourceCard from "./Card/CommunityResourceCard";
import Image from "next/image";
import Tooltip from "@/app/Components/Layout/Typography/Tooltip";
import { doClearFiles, doGetResourceImage, doSubmitNewResource, doUpdateResource, doUploadFile, doUploadFiles, doUploadImage } from "@/app/Actions/community.action";
import { CiWarning } from "react-icons/ci";
import { useRouter } from "next/navigation";

export default function UpdateResourceForm({closer, existingData}: {closer: () => void, existingData?: CommunityResource}) {
  const placeholderImage = "/images/misc/placeholder.webp";
  const descLimit = 150;
  const maxFileSize = 5 * 1024 * 1024; //5 MB
  const maxFileCount = 20;
  const [formData, setFormData] = useState<CommunityResource>(existingData ?? {
    id: -1,
    name: "",
    description:  "",
    link:  "",
    variants:  "",
    upvotes: 0,
    status: "pending",
    contact: "",
  });
  const [image, setImage] = useState(placeholderImage);
  const [imageFile, setImageFile] = useState<File>();
  const [type, setType] = useState<"Link" | "File" | "HTML" | "Other">("Link");
  const [credit, setCredit] = useState(existingData?.description.replace(/^.* Created by/, "").replace(/.$/, "") ?? "");
  const [variantCount, setVariantCount] = useState(existingData?.variants.split("|").length ?? 1);
  const [otherDetails, setOtherDetails] = useState("");
  const [mainFile, setMainFile] = useState<File>();
  const [otherFiles, setOtherFiles] = useState<Map<number, File>>(new Map([]));
  const [alertMsg, setAlertMsg] = useState("");
  const router = useRouter();

  const updateImage = async () => {
    if (existingData)
      setImage(await doGetResourceImage(existingData));
  }

  useEffect(() => {
    updateImage();
  }, []);

  useEffect(() => {
    setAlertMsg("");
  }, [image, imageFile, type, credit, variantCount, otherDetails, mainFile, otherFiles, formData]);

  const handleSubmit = async () => {
    setAlertMsg("");
    const data = formData;
    
    //assemble file links
    if (type == "File") {
      const links: string[] = [];
      otherFiles.forEach(async (f) => {
        links.push(`{bucketURL}/CommunityResources/Resources/${formData.name.toLowerCase().replace(" ", "-")}/${f.name}`);
      });
      data.link = links.join("|");
    }
    else if (type == "HTML") {
      data.link = `{bucketURL}/CommunityResources/Resources/${formData.name.toLowerCase().replace(" ", "-")}/${mainFile!.name}`;
    }

    //update DB entry
    const resp = existingData ? await doUpdateResource(existingData.id, formData) : await doSubmitNewResource(formData);

    //upload image file
    await doUploadImage(formData.name, imageFile!);

    //upload other files
    if (type == "File" || type == "HTML") {
      if (type == "HTML" && mainFile)
        await doUploadFile(formData.name, mainFile);
      otherFiles.forEach(async (f) => {
        await doUploadFile(formData.name, f);
      });
    }

    if (resp == 200) {
      router.refresh();
      closer();
    }
    else {
      if (resp == 409)
        setAlertMsg("There is already a resource with this name, please choose a different one.");
      else
        setAlertMsg("An error ocurred. Please try again or contact an administrator if the issue persists.");
    }
  }

  const cleanDesc = () => {
    return formData.description.replace(/ Created by .*$/, "");
  }

  const checkFileSize = (fileInput: HTMLInputElement, callback?: () => void) => {
    if ((fileInput.files?.length ?? 0) > maxFileCount) {
        alert("Max number of uploads is " + maxFileCount);
        fileInput.value = "";
    }
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
      reader.onload = () => {
        setImage(reader.result?.toString() ?? "/images/misc/placeholder.webp");
        setImageFile(fileInput.files![0]);
      };
      reader.onerror = () => {
        alert("Invalid file selected.");
        fileInput.value = "";
      }
    }
  }
  
  return (
    <Modal fullPage closeCallback={() => setTimeout(closer, 1)}>
      <form className="content md:w-[75vw] max-h-[85vh] m-auto flex flex-col gap-4 shadow-lg/80 overflow-y-scroll hideScroll" onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
        <ContentHeading className="text-center mb-0">{existingData ? "Edit Resource" : "Submit New Resource"}</ContentHeading>
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
          <div className="grow flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <label>{existingData ? "New Image:" : "Image:"}</label>
              <input type="file" accept="image/*" onChange={(e) => checkFileSize(e.target, () => previewImage(e.target))} required className="w-[100px] md:w-[225px]"/>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2 items-center">
                <label>Content Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value as "Link" | "File" | "HTML" | "Other")} className="border bg-white">
                  <option>Link</option>
                  <option>File</option>
                  <option>HTML</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col">
              <label>Content:</label>
              <div className="flex flex-col gap-2">
                {Array.from({length: type == "Link" || type == "File" ? variantCount : 1}).map((_, i) => (
                  <div key={`variant-${i}`} className="flex flex-col lg:flex-row gap-1 lg:gap-2">
                    {variantCount > 1 && type != "HTML" && type != "Other" &&
                      <div className="flex flex-col md:flex-row md:items-center md:gap-2 grow-1">
                        <span>Name:</span>
                        <input value={formData.variants.split("|")[i] ?? ""} onChange={(e) => setFormData(
                          {...formData, variants: formData.variants.split("|").map((_, j) => j == i ? e.target.value : formData.variants.split("|")[j]).join("|")})} required className="w-full"/>
                      </div>
                    }
                    {type == "Link" &&
                      <div className="flex flex-col md:flex-row md:items-center md:gap-2 grow-100">
                        {variantCount > 1 && <span>Link: </span>}
                        <input value={formData.link.split("|")[i] ?? ""} onChange={(e) => setFormData(
                          {...formData, link: formData.link.split("|").map((_, j) => j == i ? e.target.value : formData.link.split("|")[j]).join("|")})} required className="w-full"/>
                      </div>
                    }
                    {type == "File" &&
                      <div className="flex gap-2 items-center">
                        <label>{existingData ? "New File:" : "File:"}</label>
                        <input type="file" onChange={(e) => checkFileSize(e.target, () => {
                          if (e.target.files)
                            setOtherFiles(otherFiles.set(i, e.target.files[0]));
                        })} required className="w-[100px] md:w-[225px]"/>
                      </div>
                    }
                    {type == "HTML" &&
                      <>
                        <div className="flex gap-2 items-center">
                          <Tooltip label="Main Page:">The main landing page for your static app, often &quot;index.html&quot;. This page should pull in other required assets using relative URLs. Dynamic apps, php, or other more complicated frameworks are not supported.</Tooltip>
                          <input type="file" accept=".html" onChange={(e) => checkFileSize(e.target, () => {if (e.target.files) setMainFile(e.target.files[0])})} required className="w-[100px] md:w-[225px]"/>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Tooltip label="Other Assets:">Other assets (images, scripts, style sheets, etc) required by your static app. These should be pulled in by your main page using relative URLs.</Tooltip>
                          <input type="file" onChange={(e) => checkFileSize(e.target, () => {if (e.target.files) setOtherFiles(new Map(Array.from(e.target.files).map((f, i) => [i, f])))})} multiple className="w-[100px] md:w-[225px]"/>
                        </div>
                      </>
                    }
                    {type == "Other" && 
                      <div className="flex flex-col">
                        <label>Please explain what the conent of your resource should be and we&apos;ll help get it working. Be sure to fill out the &quot;Contact&quot; field as well in case we have additional questions.</label>
                        <textarea value={otherDetails} onChange={(e) => setOtherDetails(e.target.value)}></textarea>
                      </div>
                    }
                  </div>
                ))}
              </div>
              {type != "HTML" && type != "Other" &&
                <span className="flex gap-1">
                  <a onClick={() => {setVariantCount(variantCount + 1); setFormData({...formData, link: formData.link + "|", variants: formData.variants + "|"})}}>Add Variant</a>
                  <Tooltip label="&#x1F6C8;" className="decoration-jj-mpurple-1 text-sm mr-2">
                    Multiple versions of your resource can be offered to the user on click instead of direct navigation to one resource.
                  </Tooltip>
                  {variantCount > 1 &&
                    <a onClick={() => {setVariantCount(variantCount - 1); setFormData({...formData, link: formData.link.replace(/\|[^\|]*$/, ""), variants: formData.variants.replace(/\|[^\|]*$/, "")})}}>Delete Last</a>
                  }
                </span>
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
          <div onClick={(e) => {
              if (type != "Link") {
                e.preventDefault();
                alert("Non-Link resource content may not be previewed prior to submission.");
              }
              return;
          }}>
            <CommunityResourceCard data={formData} image={<Image src={image} alt="preview image" fill/>} preview/>
          </div>
        </div>
        {existingData &&
          <p className="text-red-800 flex gap-1 justify-center"><CiWarning/>Editing an existing resource will require reapproval before the changes become publically available.</p>
        }
        <div className="flex gap-4 justify-center">
          <button className="rounded-md text-2xl bg-gray-200" onClick={closer}>Cancel</button>
          <button type="submit" className="text-2xl rounded-md bg-jj-purple-1 text-white">Submit</button>
        </div>
        {alertMsg &&
          <p className="text-red-800 flex gap-1 justify-center animate-flash">{alertMsg}</p>
        }
      </form>
    </Modal>
  );
}