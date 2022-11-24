import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";
import routeStylesUrl from "~/dist/styles/routes/index.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export default function Index() {
	let user = useOptionalUser();
	return (
		<div className="index-route">
			<div className="inner">
				<header className="header">
					<a href="https://remix.run" className="remix-logo-link">
						<picture className="remix-logo">
							<source
								media="(prefers-color-scheme: dark)"
								srcSet="/img/remix-dark.svg"
							/>
							<img src="/img/remix.svg" alt="" />
						</picture>
						<span className="sr-only">Remix</span>
					</a>

					<h1 className="sr-only">Orange Stack</h1>
					<picture className="stack-logo">
						<source
							media="(prefers-color-scheme: dark)"
							srcSet="/img/orange-stack-dark.svg"
						/>
						<img src="/img/orange-stack.svg" alt="" />
					</picture>
				</header>

				<main className="main">
					<p className="intro">
						Check the <code>README.md</code> file for instructions on how to get
						this project deployed.
					</p>

					<div className="actions">
						{user ? (
							<Link to="/notes" className="button">
								View Notes for {user.email}
							</Link>
						) : (
							<>
								<Link to="/join" className="button">
									Sign up
								</Link>
								<Link to="/login" className="button">
									Log In
								</Link>
							</>
						)}
					</div>
				</main>

				<footer className="logos">
					{[
						{
							src: {
								default: "/img/flyio.svg",
								dark: "/img/flyio-dark.svg",
							},
							alt: "Fly.io",
							href: "https://fly.io",
						},
						{
							src: {
								default: "/img/sqlite.svg",
								dark: "/img/sqlite-dark.svg",
							},
							alt: "SQLite",
							href: "https://sqlite.org",
						},
						{
							src: {
								default: "/img/prisma.svg",
								dark: "/img/prisma-dark.svg",
							},
							alt: "Prisma",
							href: "https://prisma.io",
						},
						{
							src: "/img/sass.svg",
							alt: "Sass",
							href: "https://sass-lang.com/",
						},
						{
							src: "/img/postcss.svg",
							alt: "PostCSS",
							href: "https://postcss.org/",
						},
						{
							src: {
								default: "/img/cypress.svg",
								dark: "/img/cypress-dark.svg",
							},
							alt: "Cypress",
							href: "https://www.cypress.io",
						},
						{
							src: "/img/msw.svg",
							alt: "MSW",
							href: "https://mswjs.io",
						},
						{
							src: "/img/vitest.svg",
							alt: "Vitest",
							href: "https://vitest.dev",
						},
						{
							src: "/img/testing-library.svg",
							alt: "Testing Library",
							href: "https://testing-library.com",
						},
						{
							src: {
								default: "/img/prettier.svg",
								dark: "/img/prettier-dark.svg",
							},
							alt: "Prettier",
							href: "https://prettier.io",
						},
						{
							src: "/img/eslint.svg",
							alt: "ESLint",
							href: "https://eslint.org",
						},
						{
							src: "/img/typescript.svg",
							alt: "TypeScript",
							href: "https://typescriptlang.org",
						},
					].map((img) => (
						<a key={img.href} href={img.href} className="logo-link">
							{typeof img.src === "object" ? (
								<picture className="logo-wrap">
									<source
										media="(prefers-color-scheme: dark)"
										srcSet={img.src.dark}
									/>
									<img alt={img.alt} src={img.src.default} className="logo" />
								</picture>
							) : (
								<img alt={img.alt} src={img.src} className="logo" />
							)}
						</a>
					))}
				</footer>
			</div>
		</div>
	);
}
