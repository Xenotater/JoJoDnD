import { FaSpinner } from "react-icons/fa";

export default function LoadingSpinner({className}: {className?: string}) {
  //TODO: look into places where loading states may be needed or might not be working
  return <div className={`w-full h-full flex items-center justify-center ${className}`}><FaSpinner className="animate-spin w-full h-full rounded-full"/></div>;
}