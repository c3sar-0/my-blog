import React from "react";
import AuthForm from "../components/AuthForm";
import { redirect } from "react-router-dom";

const Auth = () => {
  return (
    <>
      <AuthForm />
    </>
  );
};

export default Auth;

export async function action({ request, params }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode");

  let url = "http://localhost:8000/api/user/";

  if (mode === "login") {
    url = url + "token/";
  } else if (mode === "register") {
    url = url + "create/";
  }

  const formData = await request.formData();
  let body = {
    email: formData.get("email"),
    password: formData.get("password"),
  };
  if (mode === "register") {
    body = { ...body, name: formData.get("name") };
  }

  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  if (!response.ok) {
    // check if error on credentials or other (if other, throw error (json))
    // throw json({ message: response.statusText }, { status: response.status });
    return response;
  }

  // manage token
  const resData = await response.json();
  localStorage.setItem("access", resData.access);
  localStorage.setItem("refresh", resData.refresh);

  return redirect("/");
}
