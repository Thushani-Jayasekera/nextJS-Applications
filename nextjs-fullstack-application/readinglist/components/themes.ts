import { tv } from "tailwind-variants";

export const title = tv({
	base: "tracking-tight inline font-semibold",
	variants: {
		color: {
			title: "from-[#00b7fa] to-[#01cfea]",
			foreground: "light:from-[#FFFFFF] light:to-[#4B4B4B]",
		},
		fullWidth: {
			true: "w-full block",
		},
	},
	compoundVariants: [
		{
			color: [
				"title",
				"foreground",
			],
			class: "bg-clip-text text-transparent bg-gradient-to-b",
		},
	],
});

export const subtitle = tv({
	base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
	variants: {
		fullWidth: {
			true: "!w-full",
		},
	},
  defaultVariants:{
    fullWidth: true
  }
});
