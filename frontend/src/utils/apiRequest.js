import { json } from "react-router-dom";

export async function apiRequest(
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
    if (!response.ok) {
      throw json({ message: response.message }, { status: response.status });
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    return data;
  } catch (error) {
    console.log("ERROR: ", error.message);
    throw json({ message: error.message });
  }
}
