import { cn } from "@/lib/utils";

type HeaderSubtitleProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export const HeaderSubtitle = ({
  title,
  subtitle,
  className,
}: HeaderSubtitleProps) => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
};
