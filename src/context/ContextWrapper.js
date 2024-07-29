import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
// const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
// const SCOPES = "https://www.googleapis.com/auth/calendar";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const urlParams = new URLSearchParams(window.location.search);

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(
    urlParams.get("date")
      ? Number(urlParams.get("date"))
      : dayjs().month()
  );
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // useEffect(() => {
  //   // setMonthIndex(2);
  //   console.log(urlParams.get("date"));
  //   if (urlParams.get("date")) {
  //     setMonthIndex(Number(urlParams.get("date")));
  //   } else {
  //     setMonthIndex(dayjs().month());
  //   }
  // }, []);

  // useEffect(() => {
  //   const date = urlParams.get("date");
  //   if (date) {
  //     console.log(urlParams.get("date"));
  //     listUpcomingEvents(Number(date));
  //   } else {
  //     listUpcomingEvents();
  //   }
  // }, []);

  // console.log("monthIndex", monthIndex);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  //cal
  const gapi = window.gapi;
  const accessToken = localStorage.getItem("access_token");
  const expiresIn = localStorage.getItem("expires_in");

  useEffect(() => {
    gapiLoaded();
  }, []);

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: process.env.REACT_APP_API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });

    if (accessToken && expiresIn) {
     await gapi.client.setToken({
        access_token: accessToken,
        expires_in: expiresIn,
      });
      setIsLoggedIn(true);

      const date = urlParams.get("date");
      if (date) {
        console.log(urlParams.get("date"));
        listUpcomingEvents(Number(date));
      } else {
        listUpcomingEvents();
      }

    }
  }

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("access_token") ? true : false
  );

  useEffect(() => {
    if (isLoggedIn) {
      listUpcomingEvents();
    }
  }, [isLoggedIn]);

  const [calEvents, setCalEvents] = useState([]);

  async function listUpcomingEvents(month) {
    let response;
console.log('heyyy', month);
    try {
      const request = {
        calendarId: "primary",
        timeMin: dayjs(
          new Date(dayjs().year(), (month || monthIndex) - 1, 27)
        ).format(),
        timeMax: dayjs(
          new Date(dayjs().year(), (month || monthIndex) + 1, 27)
        ).format(),

        // timeMin: new Date("01-01-2024").toISOString(),
        // timeMin: dayjs(
        //   new Date(dayjs().year(), monthIndex - 1)
        // ).toISOString(),
        // timeMax: dayjs(
        //   new Date(dayjs().year(), monthIndex + 1)
        // ).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 90,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      console.log("Error: ", err);
      if (err.status === 401 && err.result.error.status === "UNAUTHENTICATED") {
        setIsLoggedIn(false);
      }
      return;
    }

    const events = response.result.items;
    console.log("Upcoming events: ", events);
    setCalEvents(events);
  }

  const addEvent = (event) => {
    var request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
      // eventId: "mcjuq8fi8to490c0bd1rsostkc",
      conferenceDataVersion: 1,
      sendNotifications: true,
      // sendUpdates: "all",
    });

    request.execute(
      (event) => {
        console.log(event);
        listUpcomingEvents();
        // window.open(event.htmlLink);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const updateEvent = (event) => {
    var request = gapi.client.calendar.events.update({
      calendarId: "primary",
      eventId: event.id,
      resource: event,
    });
    request.execute(
      (event) => {
        console.log(event);
        listUpcomingEvents();
        // window.open(event.htmlLink);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const deleteEvent = (id) => {
    var request = gapi.client.calendar.events.delete({
      calendarId: "primary",
      eventId: id,
    });
    request.execute(
      (event) => {
        console.log(event);
        listUpcomingEvents();
        // window.open(event.htmlLink);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        selectedEvent,
        setSelectedEvent,
        calEvents,
        isLoggedIn,
        setIsLoggedIn,
        listUpcomingEvents,
        addEvent,
        updateEvent,
        deleteEvent,
      }}>
      {props.children}
    </GlobalContext.Provider>
  );
}
