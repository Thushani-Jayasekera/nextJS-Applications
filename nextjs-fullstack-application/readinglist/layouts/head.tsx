import React from "react";
import NextHead from "next/head";

export const Head = () => {
	return (
		<NextHead>
			<title>Bal-readinglist</title>
			<meta key="title" content="Bal-readinglist" property="og:title" />
			<meta content="manage reading list" property="og:description" />
			<link href="/favicon.ico" rel="icon" />
		</NextHead>
	);
};
