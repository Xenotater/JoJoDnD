"use client";

import ContentHeading from "@/app/Components/Layout/Typography/ContentHeading";
import { ContactFormData } from "@/app/Utilities/contact.utility";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({name: "", subject: "", email: "", body: ""});

  return (
    <div className="w-full">
      <ContentHeading as="h3" className="text-center md:mb-4">Contact Us</ContentHeading>
      <form className="w-full flex flex-col gap-4 md:items-center">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col md:flex-row md:gap-2 md:items-center">
            <label>Name:</label>
            <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Qtaro Kujo"/>
          </div>
          <div className="flex flex-col md:flex-row md:gap-2 md:items-center">
            <label>Email (optional):</label>
            <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="platinumstar@ora.ora"/>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:gap-2 md:items-center">
          <label>Subject:</label>
          <input required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} placeholder="Yare Yare..."/>
        </div>
        <textarea required value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})} placeholder="(Your Comment/Suggestion/Issue)" className="w-full md:w-[85%] h-[30vh]"/>
        <button type="submit" className="button text-2xl border-jj-purple-1 border-2">Submit</button>
      </form>
    </div>
  );
}