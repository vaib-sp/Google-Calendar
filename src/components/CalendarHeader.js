import dayjs from "dayjs";
import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
const url = new URL(window.location.href);

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex, listUpcomingEvents } =
    useContext(GlobalContext);

  function handlePrevMonth() {
    const prev = monthIndex - 1;
    setMonthIndex(prev);
    listUpcomingEvents(prev);

    url.searchParams.set("date", prev);
    window.history.pushState({}, "", url.toString());
  }
  function handleNextMonth() {
    const next = monthIndex + 1;
    setMonthIndex(next);
    listUpcomingEvents(next);

    url.searchParams.set("date", next);
    window.history.pushState({}, "", url.toString());
  }
  function handleReset() {
    const reset =
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month();

    setMonthIndex(reset);
    listUpcomingEvents(reset);

    url.searchParams.set("date", reset);
    window.history.pushState({}, "", url.toString());
  }
  return (
    <header className="px-4 py-2 flex items-center">
      <h1 className="mr-10 text-xl text-gray-500 fond-bold">
        Calendar
      </h1>
      <button
        onClick={handleReset}
        className="border rounded py-2 px-4 mr-5">
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format(
          "MMMM YYYY"
        )}
      </h2>
    </header>
  );
}
