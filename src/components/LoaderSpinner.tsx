import { Loader2 } from "lucide-react";

const LoaderSpinner = () => {
  return (
    <div className="flex-center h-screen w-full">
      <Loader2 size={64} className="animate-spin text-orange-1" />
    </div>
  );
};

export default LoaderSpinner;
