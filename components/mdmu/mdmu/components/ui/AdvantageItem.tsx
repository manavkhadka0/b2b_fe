import { CheckCircle } from "lucide-react";
interface AdvantageItemProps {
  text: string;
}

export default function AdvantageItem({ text }: AdvantageItemProps) {
  return (
    <div className="flex items-center bg-gray-50 rounded-lg p-4 mb-3">
      <CheckCircle className="text-[#0A1E4B] w-5 h-5 mr-3" />
      <span className="text-gray-700 text-sm">{text}</span>
    </div>
  );
}
