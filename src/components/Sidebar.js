import React, { useContext, useEffect, useState } from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import GlobalContext from "../context/GlobalContext";

export default function Sidebar() {
  const gapi = window.gapi;
  const google = window.google;
  const accessToken = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  const { isLoggedIn, setIsLoggedIn } = useContext(GlobalContext);

  function handleSignoutClick() {
    const token = gapi.client.getToken();

    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      localStorage.clear();
      setIsLoggedIn(false);
    }
  }

  return (
    <aside className="border p-5 w-64">
      <CreateEventButton />
      <SmallCalendar />

      <div className="mt-10">
        <button
          className={`${
            !isLoggedIn && "hidden"
          } bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center`}
          hidden={!accessToken && !expiresIn}
          onClick={handleSignoutClick}>
          Logout
        </button>
      </div>
    </aside>
  );
}
