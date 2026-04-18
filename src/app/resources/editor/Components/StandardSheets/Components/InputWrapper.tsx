export default function InputWrapper({label, className, children}: {label: string, className?: string, children: React.ReactNode}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <label className="text-sm text-nowrap">{label}</label>
      {children}
    </div>
  );
}