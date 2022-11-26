import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
	return (
		<div className="note-index">
			<p>
				No note selected. Select a note on the left, or{" "}
				<Link
					to="new"
					style={{
						textDecoration: "underline",
					}}
				>
					create a new note.
				</Link>
			</p>
		</div>
	);
}
