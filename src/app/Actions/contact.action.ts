"use server";

export interface ContactFormData {
  name: string;
  subject: string;
  email?: string;
  body: string;
}