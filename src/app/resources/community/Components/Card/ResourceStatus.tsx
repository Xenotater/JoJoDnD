import Tooltip from "@/app/Components/Layout/Typography/Tooltip";

import styles from "./CardStatusColors.module.css";

export default function ResourceStatus({status}: {status: string}) {
    const getStatusTooltip = () => {
      switch (status) {
        case "Pending":
          return "Your resource is currently pending approval and won't be publicly available. We'll let you know when it's approved. Please contact an admin if you have questions.";
        case "Pending Edit": 
          return "Your resource is currently pending approval and your changes won't be publicly available, but the previous version will be unless you choose to hide it. We'll let you know when it's approved. Please contact an admin if you have questions.";
        case "Approved":
          return "Your resource has been approved and will be publicly shared with the community. It can still be edited as needed but may require reapproval.";
        case "Hidden":
          return "Your resource has been hidden from the public page. You may restore it at any time without requiring approval.";
        case "Denied":
          return "Your resource has been denied approval and won't be publicly available. Edit the resource and make any requested adjustments to resubmit it for approval. Please contact an admin if you have questions."
        default:
          return "An error occurred retrieving the status of this resource.";
      }
    }

    return (
      <div className={`absolute bottom-0 left-0 border border-l-2 border-b-2 rounded-tr-md rounded-bl-md h-7 p-2 flex gap-1 items-center ${styles.genericStatus} ${styles[`status${status.replace(" ", "")}`]}`}>
        <Tooltip label={status}>{getStatusTooltip()}</Tooltip>
      </div>
    );
}