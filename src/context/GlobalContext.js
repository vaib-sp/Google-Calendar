import React from "react";

const GlobalContext = React.createContext({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: (index) => {},
  daySelected: null,
  setDaySelected: (day) => {},
  showEventModal: false,
  setShowEventModal: () => {},
  calEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  isLoggedIn: localStorage.getItem("access_token") ? true : false,
  setIsLoggedIn: () => {},
  listUpcomingEvents: () => {},
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
});

export default GlobalContext;
