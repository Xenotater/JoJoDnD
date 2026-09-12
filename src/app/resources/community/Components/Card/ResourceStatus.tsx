"use client";

import Tooltip from "@/app/Components/Layout/Typography/Tooltip";

import styles from "./CardStatusColors.module.css";
import { useTranslations } from "next-intl";

export default function ResourceStatus({status}: {status: string}) {
  const t = useTranslations("Community.Statuses");
  const validStatuses = ["Pending", "Pending Edit", "Approved", "Hidden", "Denied"];
  const key = validStatuses.includes(status) ? status.toLowerCase().replaceAll(" ", "") : "unknown";

  return (
    <div className={`absolute bottom-0 left-0 border border-l-2 border-b-2 rounded-tr-md rounded-bl-md h-7 p-2 flex gap-1 items-center ${styles.genericStatus} ${styles[`status${status.replace(" ", "")}`]}`}>
      <Tooltip label={t(key)}>{t(`${key}Tooltip`)}</Tooltip>
    </div>
  );
}
