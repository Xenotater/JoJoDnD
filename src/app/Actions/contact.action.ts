"use server";

import ContactEmailBody from "../Components/Emails/ContactEmail";
import { sendEmail } from "../Utilities/aws.utility";

export interface ContactFormData {
  name: string;
  subject: string;
  email?: string;
  body: string;
}

export async function doSendContactEmail(data: ContactFormData) {
  if (data.name && data.body && data.subject) {
    const { renderToStaticMarkup } = await import('react-dom/server');
    const resp = await sendEmail("contact", "jojosdnd@gmail.com", data.subject, renderToStaticMarkup(ContactEmailBody({name: data.name, message: data.body, email: data.email || undefined})));

    return resp?.$metadata.httpStatusCode ?? 500;
  }
  
  return 400;
}