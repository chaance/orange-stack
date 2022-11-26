import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
	const userId = await requireUserId(request);

	const formData = await request.formData();
	const title = formData.get("title");
	const body = formData.get("body");

	if (typeof title !== "string" || title.length === 0) {
		return json(
			{ errors: { title: "Title is required", body: null } },
			{ status: 400 }
		);
	}

	if (typeof body !== "string" || body.length === 0) {
		return json(
			{ errors: { title: null, body: "Body is required" } },
			{ status: 400 }
		);
	}

	const note = await createNote({ title, body, userId });

	return redirect(`/notes/${note.id}`);
}

export default function NewNotePage() {
	const actionData = useActionData<typeof action>();
	const titleRef = React.useRef<HTMLInputElement>(null);
	const bodyRef = React.useRef<HTMLTextAreaElement>(null);

	React.useEffect(() => {
		if (actionData?.errors?.title) {
			titleRef.current?.focus();
		} else if (actionData?.errors?.body) {
			bodyRef.current?.focus();
		}
	}, [actionData]);

	return (
		<Form
			method="post"
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 8,
				width: "100%",
			}}
		>
			<div>
				<label>
					<span>Title</span>
					<input
						ref={titleRef}
						name="title"
						aria-invalid={actionData?.errors?.title ? true : undefined}
						aria-errormessage={
							actionData?.errors?.title ? "title-error" : undefined
						}
					/>
				</label>
				{actionData?.errors?.title && (
					<div id="title-error">{actionData.errors.title}</div>
				)}
			</div>

			<div>
				<label>
					<span>Body</span>
					<textarea
						ref={bodyRef}
						name="body"
						rows={8}
						aria-invalid={actionData?.errors?.body ? true : undefined}
						aria-errormessage={
							actionData?.errors?.body ? "body-error" : undefined
						}
					/>
				</label>
				{actionData?.errors?.body && (
					<div id="body-error">{actionData.errors.body}</div>
				)}
			</div>

			<div>
				<button type="submit" className="button">
					Save
				</button>
			</div>
		</Form>
	);
}
