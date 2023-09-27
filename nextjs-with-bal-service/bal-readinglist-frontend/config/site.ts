export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Bal-readingList",
  description: "Manage reading lists",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Profile",
      href: "/profile",
    },
  ],
  navMenuItems: [
    {
		label: "Home",
		href: "/",
	  },
	  {
		label: "Profile",
		href: "/profile",
	  },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui-docs-v2.vercel.app",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
