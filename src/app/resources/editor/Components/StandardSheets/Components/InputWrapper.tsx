export default function InputWrapper({label, className, children}: {label: string, className?: string, children: React.ReactNode}) {
  return (
    <label className={`flex flex-col items-center ${className}`}>
      <span className="text-sm text-nowrap">{label}</span>
      {children}
    </label>
  );
}