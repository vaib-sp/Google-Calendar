import React, { useContext, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";

const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
// const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
// const SCOPES = "https://www.googleapis.com/auth/calendar";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

let tokenClient = "";

const Welcome = () => {
  const gapi = window.gapi;
  const google = window.google;

  const accessToken = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  const { isLoggedIn, setIsLoggedIn } = useContext(GlobalContext);

  useEffect(() => {
    gisLoaded();
  }, []);

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_CLIENT_ID,
      scope: SCOPES,
      DISCOVERY_DOC: DISCOVERY_DOC,
      callback: "",
    });
  }

  //Enables user interaction after all libraries are loaded.
  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error) {
        setIsLoggedIn(false);
        throw resp;
      }

      // await listUpcomingEvents();
      const { access_token, expires_in } = gapi.client.getToken();
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
      setIsLoggedIn(true);
    };

    if (!(accessToken && expiresIn)) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  return (
    <div className="mx-auto p-6 pt-40 text-center">
      <h3 className="text-4xl">Welcome</h3>
      <h3 className="text-3xl">
        Login with your google account to continue
      </h3>

      <div className="mt-10">
        <button
          className={`mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
          onClick={handleAuthClick}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Welcome;
