interface HeaderSectionProps {
  title: string;
  subtitle: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
};

export default HeaderSection;
