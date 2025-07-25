export default function Display({children}: {children: React.ReactNode}) {
  return (
    <div className="content h-full">
      {children}
    </div>
  );
}