import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import {BsPencilSquare, BsPlusSquare, BsXSquare} from "react-icons/bs";

export default function ImageInput({img, alt, update, backup}: {img: string, alt: string, update: (img: string) => void, backup?: string}) {
  const [hover, setHover] = useState(false);
  const [imgSrc, setImgSrc] = useState(img);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 5 * 1024 * 1024; //5 MB

  const toggleHover = () => {
    setHover(!hover);
  };

  const removeImage = () => {
    update("");
    if (inputRef.current)
      inputRef.current.value = "";
  };

  const beginEdit = () => {
    if (inputRef.current)
      inputRef.current.click();
  }

  const submitEdit = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        update(reader.result as string);
      }

      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    setImgSrc(img);
  }, [img]);

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

  return (
    <div className="relative w-full h-full">
      {imgSrc && <Image src={imgSrc} onError={() => {if (backup) setImgSrc(backup); else setImgSrc("")}} alt={alt} fill={true} className="object-contain bg-black"/>}
      <div className="absolute w-full h-full bg-transparent hover:bg-gray-100/33 content-none" onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
        {hover && (
          <div className="relative w-full h-full">
            {imgSrc ? (
              <>
                <BsXSquare className="cursor-pointer absolute top-2 right-2" size={30} onClick={removeImage} />
                <div className="flex items-center justify-center w-full h-full">
                  <BsPencilSquare className="cursor-pointer" size={30} onClick={beginEdit} />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <BsPlusSquare className="cursor-pointer" size={30} onClick={beginEdit} />
              </div>
            )}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => checkFileSize(e.target, () => submitEdit(e.target.files))}/>
    </div>
  );
}
