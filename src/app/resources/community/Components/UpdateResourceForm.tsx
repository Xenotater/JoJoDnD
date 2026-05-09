"use client";

import Modal from "@/app/Components/Layout/Modal/Modal";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { CommunityResource } from "@/app/Models/Resources.model";
import { useEffect, useRef, useState } from "react";
import CommunityResourceCard from "./Card/CommunityResourceCard";
import Image from "next/image";
import Tooltip from "@/app/Components/Layout/Typography/Tooltip";
import { doGetResourceFile, doGetResourceImage, doListResourceFiles, doSubmitNewResource, doUpdateResource, doUploadFile, doUploadImage } from "@/app/Actions/community.action";
import { CiWarning } from "react-icons/ci";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fileToFormData } from "@/app/Utilities/misc.utility";

type ResourceType = "Link" | "File" | "HTML" | "Other";

export default function UpdateResourceForm({closer, existingData}: {closer: () => void, existingData?: CommunityResource}) {
  const placeholderImage = "/images/misc/placeholder.webp";
  const descLimit = 150;
  const maxFileSize = 5 * 1024 * 1024; //5 MB
  const maxFileCount = 10;
  const [formData, setFormData] = useState<CommunityResource>(existingData ?? {
    id: -1,
    name: "",
    description:  "",
    link:  "",
    variants:  "",
    upvotes: 0,
    status: "pending",
    contact: "",
    clones: 0
  });
  const [image, setImage] = useState(placeholderImage);
  const [imageFile, setImageFile] = useState<File>();
  const [type, setType] = useState<ResourceType>((existingData?.meta?.split("|")[0] ?? "Link") as ResourceType);
  const [credit, setCredit] = useState(existingData?.description.replace(/^.* Created by/, "").replace(/.$/, "") ?? "");
  const [variantCount, setVariantCount] = useState(existingData?.variants?.split("|").length ?? 1);
  const [otherDetails, setOtherDetails] = useState("");
  const [files, setFiles] = useState<Map<number, File>>(new Map([]));
  const [alertMsg, setAlertMsg] = useState("");
  const alertRef = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  //TODO: analyze efficiency of this.. do we really need to fetch all files every time?
  const updateFiles = async () => {
    if (existingData) {
      setImage(await doGetResourceImage(existingData));
      if (["HTML", "File"].includes(existingData.meta ?? "")) {
        setFormData({...formData, link: ""});
        const list = await doListResourceFiles(existingData.id);
        if (list) {
          const existingFiles = new Map<number, File>();
          let foundMain = 0;
          for (let i=0; i<list.length; i++) {
            const resp = await doGetResourceFile(existingData.id, list[i]);
            if (resp) {
              if (existingData.meta == "HTML" && existingData.link.includes(resp.name)) {
                existingFiles.set(-1, new File([resp.file], resp.name, {type: resp.file.type}));
                foundMain++;
              }
              else
                existingFiles.set(i-foundMain, new File([resp.file], resp.name, {type: resp.file.type}));
            }
          }
          setFiles(existingFiles);
        }
      }
    }
  }

  useEffect(() => {
    updateFiles();
  }, []);

  useEffect(() => {
    setAlertMsg("");
  }, [image, imageFile, type, credit, variantCount, otherDetails, files, formData]);

  useEffect(() => {
    alertRef.current?.scrollIntoView();
  }, [alertMsg])

  const openFileInput =  (index: number) => {
    const input = document.querySelectorAll("input[type='file']")[index];
    if (input)
      (input as HTMLInputElement).click();
  }

  const handleSubmit = async () => {
    setAlertMsg("");
    const data = {...formData};

    if (files.size > maxFileCount) {
      setAlertMsg("Max number of uploads is " + maxFileCount);
      return;
    }
    
    //assemble file links
    if (type == "File") {
      const links: string[] = [];
      files.forEach(async (f) => {
        links.push(`{bucketURL}/CommunityResources/Resources/${data.name.toLowerCase().replaceAll(" ", "-")}/${f.name.replaceAll(" ", "")}`);
      });
      data.link = links.join("|");
    }
    else if (type == "HTML") {
      data.link = `{bucketURL}/CommunityResources/Resources/${data.name.toLowerCase().replaceAll(" ", "-")}/${files.get(-1)!.name.replaceAll(" ", "")}`;
    }

    if (type != "Link") {
      data.meta = type;
      if (type == "Other")
        data.meta += `|${otherDetails}`;
    }

    //update DB entry
    const resp = existingData ? await doUpdateResource(existingData.id, data) : await doSubmitNewResource(data);

    if (resp == 200) {
      //upload image file
      if (imageFile) {
        await doUploadImage(data.name, fileToFormData(imageFile), existingData?.id);
      }

      //upload other files
      if (type == "File" || type == "HTML") {
        files.forEach(async (f) => {
          await doUploadFile(data.name, fileToFormData(f), f.name, existingData?.id);
        });
      }

      router.replace(`${pathname}?${params.toString()}&success=true`)
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
          <div className="grow w-full flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <label>Image:</label>
              <b>{imageFile?.name ?? (existingData ? `${formData.name}.webp` : "No file chosen")}</b>
              <button className="p-1 pt-0 pb-0 h-min text-nowrap bg-gray-300" onClick={(e) => {
                e.preventDefault();
                openFileInput(0);
              }}>Choose File</button>
              <input type="file" accept="image/*" onChange={(e) => checkFileSize(e.target, () => previewImage(e.target))} required={!existingData} className="hidden"/>
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
                        <input value={formData.variants?.split("|")[i] ?? ""} onChange={(e) => setFormData(
                          {...formData, variants: formData.variants?.split("|").map((_, j) => j == i ? e.target.value : formData.variants?.split("|")[j]).join("|")})} required className="w-full"/>
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
                        <label>File:</label>
                        <div className="md:w-[225px] flex gap-2 items-center">
                          <b>{files.get(i)?.name ?? "No file chosen"}</b>
                          <button className="p-1 pt-0 pb-0 h-min text-nowrap bg-gray-300" onClick={(e) => {
                            e.preventDefault();
                            openFileInput(i+1);
                          }}>Choose File</button>
                        </div>
                        <input type="file" onChange={(e) => checkFileSize(e.target, () => {
                          if (e.target.files) {
                            const newFiles = new Map(files);
                            newFiles.set(i, e.target.files[0]);
                            setFiles(newFiles);
                          }
                        })} required={!files.has(i)} className="hidden"/>
                      </div>
                    }
                    {type == "HTML" &&
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center">
                          <Tooltip label="Main Page:">The main landing page for your static app, often &quot;index.html&quot;. This page should pull in other required assets using relative URLs. Dynamic apps, php, or other more complicated frameworks are not supported.</Tooltip>
                          <div className="flex gap-2 items-center">
                            <div className="flex gap-2 items-center">
                              <b>{files.get(-1)?.name ?? "No file chosen"}</b>
                              <button className="p-1 pt-0 pb-0 h-min text-nowrap bg-gray-300" onClick={(e) => {
                                e.preventDefault();
                                openFileInput(i+1);
                              }}>Choose File</button>
                            </div>
                            <input type="file" accept=".html" onChange={(e) => checkFileSize(e.target, () => {if (e.target.files) {
                              const newFiles = new Map(files);
                              newFiles.set(-1, e.target.files[0]);
                              setFiles(newFiles);
                            }})} required={!files.has(-1)} className="hidden"/>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Tooltip label="Other Assets:">Other assets (images, scripts, style sheets, etc) required by your static app. These should be pulled in by your main page using relative URLs.</Tooltip>
                          <div className="flex gap-2 items-center">
                            <div className="flex gap-2 items-center">
                              <b>{files.size > 2 ?
                                Array.from(files).map((f) => {
                                  const j = f[0];
                                  if (j >= 0) {
                                    return `${f[1]?.name}${j < files.size - 2 ? ", " : ""}`
                                  }
                                })
                                : "No files chosen"}
                              </b>
                              <button className="p-1 pt-0 pb-0 h-min text-nowrap bg-gray-300" onClick={(e) => {
                                e.preventDefault();
                                openFileInput(i+2);
                              }}>Choose Files</button>
                            </div>
                            <input type="file" onChange={(e) => checkFileSize(e.target, () => {if (e.target.files) {
                              const newFiles = new Map();
                              if (files.has(-1))
                                newFiles.set(-1, files.get(-1));
                              Array.from(e.target.files).map((f, i) => newFiles.set(i, f));
                              setFiles(newFiles);
                            }})} multiple className="hidden"/>
                          </div>
                        </div>
                      </div>
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
                    <a onClick={() => {
                      const newFiles = new Map(files);
                      newFiles.delete(variantCount - 1);
                      setFiles(newFiles);
                      setVariantCount(variantCount - 1);
                      setFormData({...formData, link: formData.link.replace(/\|[^\|]*$/, ""), variants: formData.variants?.replace(/\|[^\|]*$/, "")});
                    }}>Delete Last</a>
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
        {existingData && existingData.status == "Approved" &&
          <p className="text-red-900 flex gap-1 justify-center"><CiWarning/>Editing an existing resource will require reapproval before the changes become publically available.</p>
        }
        <div className="flex gap-4 justify-center">
          <button className="rounded-md text-2xl bg-gray-200" onClick={closer}>Cancel</button>
          <button type="submit" className="text-2xl rounded-md bg-jj-purple-1 text-white">Submit</button>
        </div>
        {alertMsg &&
          <p ref={alertRef} className="text-red-900 flex gap-1 justify-center animate-flash">{alertMsg}</p>
        }
      </form>
    </Modal>
  );
}