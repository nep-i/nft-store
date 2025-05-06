import axios from "axios";
import Keycloak from "keycloak-js";

const keycloakInitConfig = {
  url: "http://localhost:8080",
  realm: "products",
  clientId: "account",
  redirectUri: "http://localhost:3000/",
};

export const exchangeCodeForToken = async (code: string, state: string) => {
  const localObject: string | null = localStorage.getItem(
    "kc-callback-" + state
  );
  let codeVerifier: string | null = null;
  if (localObject) {
    codeVerifier = JSON.parse(localObject)["pkceCodeVerifier"];
  }
  try {
    console.log("codeVeri----------", codeVerifier);
    const response = await axios.post(
      `${keycloakInitConfig.url}/realms/${keycloakInitConfig.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: keycloakInitConfig.clientId,
        grant_type: "authorization_code",
        redirect_uri: "http://localhost:3000/", // Must match Keycloak client settings
        code: code, // The authorization code from URL
        code_verifier: codeVerifier ? codeVerifier : "",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Tokens Received:", response.data);

    return response.data; // Contains access_token & refresh_token
  } catch (err) {
    console.error("Error exchanging code for token:", err);
    return null;
  }
};
