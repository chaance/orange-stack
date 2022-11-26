import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";

import routeStylesUrl from "~/dist/styles/routes/notes.css";
import cx from "clsx";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: routeStylesUrl }];
};

export async function loader({ request }: LoaderArgs) {
	let userId = await requireUserId(request);
	let noteListItems = await getNoteListItems({ userId });
	return json({ noteListItems });
}

export default function NotesPage() {
	let data = useLoaderData<typeof loader>();
	let user = useUser();

	return (
		<div className="notes-layout">
			<div className="container inner">
				<header className="header">
					<Link to=".">
						<h1>Notes</h1>
					</Link>
					<Form action="/logout" method="post" className="logout-form">
						<p>
							Logged in as <span className="nobr">{user.email}.</span>
						</p>
						<button type="submit" className="logout-button">
							Log out.
						</button>
					</Form>
				</header>

				<main className="main">
					<div className="notes">
						{data.noteListItems.length === 0 ? (
							<p>No notes yet!</p>
						) : (
							<ol className="notes-list">
								{data.noteListItems.map((note) => (
									<li key={note.id} className="notes-item">
										<NavLink
											className={({ isActive }) =>
												cx("notes-item-link", {
													active: isActive,
												})
											}
											to={note.id}
										>
											<span className="notes-item-icon" aria-hidden>
												📝{" "}
											</span>
											{note.title}
										</NavLink>
									</li>
								))}
							</ol>
						)}
					</div>

					<div className="outlet">
						<Outlet />
					</div>
				</main>

				<footer className="footer">
					<Link
						to="new"
						className="button button-rounded new-note-button"
						title="New Note"
					>
						<span>+</span>
						<span className="sr-only">New Note</span>
					</Link>
				</footer>
			</div>
		</div>
	);
}
