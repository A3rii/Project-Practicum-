//* Get token
export default function authToken() {
  let token = localStorage.getItem("token") ?? "";
  token = token.replace(/"/g, "");

  return token;
}
