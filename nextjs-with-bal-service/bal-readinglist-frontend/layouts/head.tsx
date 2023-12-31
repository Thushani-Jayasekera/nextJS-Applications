import React from "react";
import NextHead from "next/head";

export const Head = () => {
	return (
		<NextHead>
			<title>ReadingList</title>
			<meta key="title" content="ReadingList" property="og:title" />
			<meta content="Manage reading lists" property="og:description" />
			<link href="/favicon.ico" rel="icon" />
		</NextHead>
	);
};
