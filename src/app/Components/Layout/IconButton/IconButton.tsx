import { ReactNode } from "react";

export default function IconButton({children, className, onClick}: {children: ReactNode, className?: string, onClick?: () => void}) {
  return (
    <button onClick={onClick} className={`bg-jj-mpurple-1 border-2 rounded-full ${className} aspect-1/1`}>
      {children}
    </button>
  );
}