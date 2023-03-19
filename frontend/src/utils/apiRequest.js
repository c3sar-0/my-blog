import { json, redirect } from "react-router-dom";

export default async function apiRequest(
  url,
  method = "GET",
  isAuth = true,
  body,
  contentType
) {
  try {
    const response = await fetch(url, {
      method: method,
      ...(isAuth &&
        localStorage.access && {
          headers: {
            Authorization: "Bearer " + localStorage.access,
            ...(contentType && { "Content-Type": contentType }),
          },
        }),
      ...(body && { body: body }),
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      console.log(data);
      if (data.code === "token_not_valid") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location = "/";
      }
      throw json({ message: response.message }, { status: response.status });
    }

    return data;
  } catch (error) {
    console.log("ERROR: ", error.message);
    throw json({ message: error.message });
  }
}
