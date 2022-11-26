import * as React from "react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";

export async function loader({ request }: LoaderArgs) {
	const userId = await getUserId(request);
	if (userId) return redirect("/");
	return json({});
}

export async function action({ request }: ActionArgs) {
	const formData = await request.formData();
	const email = formData.get("email");
	const password = formData.get("password");
	const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

	if (!validateEmail(email)) {
		return json(
			{ errors: { email: "Email is invalid", password: null } },
			{ status: 400 }
		);
	}

	if (typeof password !== "string" || password.length === 0) {
		return json(
			{ errors: { email: null, password: "Password is required" } },
			{ status: 400 }
		);
	}

	if (password.length < 8) {
		return json(
			{ errors: { email: null, password: "Password is too short" } },
			{ status: 400 }
		);
	}

	const existingUser = await getUserByEmail(email);
	if (existingUser) {
		return json(
			{
				errors: {
					email: "A user already exists with this email",
					password: null,
				},
			},
			{ status: 400 }
		);
	}

	const user = await createUser(email, password);

	return createUserSession({
		request,
		userId: user.id,
		remember: false,
		redirectTo,
	});
}

export const meta: MetaFunction = () => {
	return {
		title: "Sign Up",
	};
};

export default function Join() {
	let [searchParams] = useSearchParams();
	let redirectTo = searchParams.get("redirectTo") ?? undefined;
	let actionData = useActionData<typeof action>();
	let emailRef = React.useRef<HTMLInputElement>(null);
	let passwordRef = React.useRef<HTMLInputElement>(null);

	// actionData = { errors: { email: null, password: "You done fucked up" } };

	React.useEffect(() => {
		if (actionData?.errors?.email) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus();
		}
	}, [actionData]);

	return (
		<div className="join-route">
			<h1 className="sr-only">Join</h1>
			<div className="auth-box">
				<Form method="post" className="form">
					<div className="text-field">
						<label htmlFor="email" className="text-field-label">
							Email address
						</label>
						<div className="text-field-input-wrap">
							<input
								ref={emailRef}
								id="email"
								required
								autoFocus={true}
								name="email"
								type="email"
								autoComplete="email"
								aria-invalid={actionData?.errors?.email ? true : undefined}
								aria-errormessage={
									actionData?.errors?.email ? "email-error" : undefined
								}
								className="text-field-input"
							/>
							{actionData?.errors?.email && (
								<div className="text-field-messages">
									<div className="text-field-error" id="email-error">
										{actionData.errors.email}
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="text-field">
						<label htmlFor="password" className="text-field-label">
							Password
						</label>
						<div className="text-field-input-wrap">
							<input
								id="password"
								ref={passwordRef}
								name="password"
								type="password"
								autoComplete="new-password"
								aria-invalid={actionData?.errors?.password ? true : undefined}
								aria-describedby={
									actionData?.errors?.password ? "password-error" : undefined
								}
								className="text-field-input"
							/>
							{actionData?.errors?.password && (
								<div className="text-field-messages">
									<div className="text-field-error" id="password-error">
										{actionData.errors.password}
									</div>
								</div>
							)}
						</div>
					</div>

					<input type="hidden" name="redirectTo" value={redirectTo} />
					<button type="submit" className="button button-primary">
						Create Account
					</button>
					<p className="auth-postfix">
						Already have an account?{" "}
						<Link
							to={{
								pathname: "/login",
								search: searchParams.toString(),
							}}
						>
							Log in
						</Link>
					</p>
				</Form>
			</div>
		</div>
	);
}
