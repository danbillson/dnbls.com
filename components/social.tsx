import { siGithub, siInstagram, siLinkedin, siMedium, siX } from "simple-icons";

const social = [
  {
    icon: siGithub.svg,
    link: `https://github.com/danbillson`,
  },
  {
    icon: siInstagram.svg,
    link: `https://www.instagram.com/danbillson/`,
  },
  {
    icon: siX.svg,
    link: `https://x.com/dbillson`,
  },
  {
    icon: siLinkedin.svg,
    link: `https://www.linkedin.com/in/danielbillson/`,
  },
  {
    icon: siMedium.svg,
    link: `https://medium.com/@danielbillson`,
  },
];

export default function Social() {
  return (
    <div className="flex justify-center m-6 gap-3 mt-12 print:hidden">
      {social.map(({ icon, link }) => (
        <a
          key={link}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{ __html: icon }}
          className="w-6 h-6 mx-2"
        />
      ))}
    </div>
  );
}
