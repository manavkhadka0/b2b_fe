import Link from "next/link";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import { categories } from "@/lib/categories";

const Footerbot = () => {
  const socialLinks = [
    {
      name: "Github",
      icon: GithubIcon,
      link: "https://www.github.com/jobbriz",
    },
    {
      name: "Youtube",
      icon: YoutubeIcon,
      link: "https://www.youtube.com/jobbriz",
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      link: "https://www.linkedin.com/company/jobbriz",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      link: "https://instagram.com/jobbriz",
    },
    { name: "Twitter", icon: TwitterIcon, link: "https://twitter.com/jobbriz" },
  ];

  const sections = [
    {
      header: "Job Categories",
      links: categories.map(({ name }) => ({
        name,
        link: `/search?category=${name}`,
      })),
    },
    {
      header: "About Us",
      links: [
        { name: "Our Story", link: "#" },
        { name: "Careers", link: "#" },
        { name: "Media & Press", link: "#" },
        { name: "Privacy Policy", link: "#" },
        { name: "Terms of Service", link: "#" },
        { name: "Contact Us", link: "#" },
      ],
    },
    {
      header: "Support",
      links: [
        { name: "Help Center", link: "#" },
        { name: "Safety Guidelines", link: "#" },
        { name: "Hiring on JobBriz", link: "#" },
        { name: "Freelancing on JobBriz", link: "#" },
      ],
    },
    {
      header: "Community",
      links: [
        { name: "Success Stories", link: "#" },
        { name: "Community Hub", link: "#" },
        { name: "Events", link: "#" },
        { name: "Blog", link: "#" },
        { name: "Affiliates", link: "#" },
        { name: "Invite a Friend", link: "#" },
        { name: "Become a Freelancer", link: "#" },
      ],
    },
    {
      header: "More from JobBriz",
      links: [
        { name: "JobBriz Pro", link: "#" },
        { name: "JobBriz Business", link: "#" },
        { name: "Freelancer Resources", link: "#" },
        { name: "Guides & Tips", link: "#" },
        { name: "JobBriz Workspace", link: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full mx-auto px-8 md:px-32 py-16 bg-gray-100 border-t border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {sections.map(({ header, links }) => (
          <div key={header}>
            <h3 className="font-bold">{header}</h3>
            <ul className="mt-4 space-y-2">
              {links.map(({ name, link }) => (
                <li key={name} className="text-gray-700 hover:text-gray-900">
                  <Link href={link}>{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="">
          <img src="/JobBriz.svg" alt="Jobbriz" className="h-12 w-auto" />
        </Link>
        {/* support by Chamber of Industry Morang */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <img
            src="/logo.png"
            alt="Chamber of Industry Morang"
            className="w-12 h-auto"
          />
          <p>Support by Chamber of Industry Morang</p>
        </div>
        <ul className="flex gap-4 mt-6 md:mt-0">
          {socialLinks.map(({ icon: Icon, link, name }) => (
            <li
              key={name}
              className="text-xl text-gray-700 hover:text-[#1DBF73] transition-all"
            >
              <Link
                href={link}
                aria-label={name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footerbot;
