export default function LoadingSpinner() {
  //TODO: look into places where loading states may be needed or might not be working
  return <div className="w-full h-full flex items-center justify-center"><svg className="animate-spin"/></div>;
}