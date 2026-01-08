import { cn } from "@/lib/utils";

type HeaderSubtitleProps = {
  title: string;
  subtitle: string;
  className?: string;
  isRichtext?: boolean;
};

export const HeaderSubtitle = ({
  title,
  subtitle,
  className,
  isRichtext = false,
}: HeaderSubtitleProps) => {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-gray-600 mt-2">
        {isRichtext ? (
          <div
            className="text-gray-600 mt-2 space-y-4 text-left prose prose-sm sm:prose md:prose-lg lg:prose-xl "
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        ) : (
          subtitle
        )}
      </p>
    </div>
  );
};
