import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
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
	const redirectTo = safeRedirect(formData.get("redirectTo"), "/notes");
	const remember = formData.get("remember");

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

	const user = await verifyLogin(email, password);

	if (!user) {
		return json(
			{ errors: { email: "Invalid email or password", password: null } },
			{ status: 400 }
		);
	}

	return createUserSession({
		request,
		userId: user.id,
		remember: remember === "on" ? true : false,
		redirectTo,
	});
}

export const meta: MetaFunction = () => {
	return {
		title: "Login",
	};
};

export default function LoginPage() {
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") || "/notes";
	const actionData = useActionData<typeof action>();
	const emailRef = React.useRef<HTMLInputElement>(null);
	const passwordRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (actionData?.errors?.email) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus();
		}
	}, [actionData]);

	return (
		<div className="login-route">
			<h1 className="sr-only">Log In</h1>
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
								aria-describedby="email-error"
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
								autoComplete="current-password"
								aria-invalid={actionData?.errors?.password ? true : undefined}
								aria-describedby="password-error"
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

					<div className="checkbox-field">
						<input
							id="remember"
							name="remember"
							type="checkbox"
							className="checkbox-field-input"
						/>
						<label htmlFor="remember" className="checkbox-field-label">
							Remember me
						</label>
					</div>

					<input type="hidden" name="redirectTo" value={redirectTo} />
					<button type="submit" className="button button-primary">
						Log In
					</button>
					<div className="auth-postfix">
						Don't have an account?{" "}
						<Link
							to={{
								pathname: "/join",
								search: searchParams.toString(),
							}}
						>
							Sign up
						</Link>
					</div>
				</Form>
			</div>
		</div>
	);
}
