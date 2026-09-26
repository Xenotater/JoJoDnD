import { FaSpinner } from "react-icons/fa";

export default function LoadingSpinner({className}: {className?: string}) {
  return <div className={`w-full h-full relative overflow-hidden ${className}`}><FaSpinner className="animate-spin absolute w-full h-full"/></div>;
}