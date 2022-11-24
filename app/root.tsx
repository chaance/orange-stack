import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import resetsStylesUrl from "~/dist/styles/resets.css";
import appStylesUrl from "~/dist/styles/app.css";
import { getUser } from "~/session.server";

export const links: LinksFunction = () => {
	return [
		{
			as: "font",
			crossOrigin: "anonymous",
			href: "/fonts/inter-var.woff2",
			rel: "preload",
			type: "font/woff2",
		},
		{ rel: "stylesheet", href: resetsStylesUrl },
		{ rel: "stylesheet", href: appStylesUrl },
	];
};

export const meta: MetaFunction = () => {
	return {
		charSet: "utf-8",
		title: "Remix Notes",
		viewport: "width=device-width,initial-scale=1",
	};
};

export async function loader({ request }: LoaderArgs) {
	return json({
		user: await getUser(request),
	});
}

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
