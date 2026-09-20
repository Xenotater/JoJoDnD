"use client";

import { doSendContactEmail } from "@/app/Actions/contact.action";
import { useToastController } from "@/app/Components/Layout/Toasts/ToastControllerProvider";
import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { useState } from "react";
import { useTranslations } from "use-intl";

export default function ContactForm() {
  const [formData, setFormData] = useState({name: "", subject: "", email: "", body: ""});
  const t = useTranslations("Resources");
  const toasts = useToastController();

  return (
    <div className="w-full">
      <ContentHeading as="h2" className="text-center">{t("contact")}</ContentHeading>
      <form className="w-full flex flex-col gap-4 md:items-center" onSubmit={(e) => {
        e.preventDefault();
        doSendContactEmail(formData).then((resp) => {
          if (resp == 200)
            toasts.displayMessage(t("emailSent"), {type: "Success"});
          else if (resp == 400)
            toasts.displayMessage(t("fieldsEmpty"), {type: "Error"});
          else
            toasts.displayMessage(t("error"), {type: "Error"});
        })
      }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col md:flex-row md:gap-2 md:items-center">
            <label>{t("name")}</label>
            <input required value={formData.name} name="name" onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Qtaro Kujo"/>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2 md:items-center">
            <label>{t("email")}:</label>
            <input value={formData.email} name="email" onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="platinumstar@ora.ora"/>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:gap-2 md:items-center">
          <label>{t("subject")}</label>
          <input required value={formData.subject} name="subject" onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Yare Yare..."/>
        </div>
        <textarea required value={formData.body} name="body" onChange={(e) => setFormData({...formData, body: e.target.value})} placeholder={t("messagePrompt")} className="w-full md:w-[85%] h-[30vh]"/>
        <button type="submit" className="button text-2xl text-white bg-jj-purple-1 rounded-sm">Submit</button>
      </form>
    </div>
  );
}