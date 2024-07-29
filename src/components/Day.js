import React, { useContext, useState, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";
import ShowMoreModal from "./ShowMoreModal";
import { getEventTime } from "../util";
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

export default function Day({ day, rowIdx }) {
  const [dayEvents, setDayEvents] = useState([]);
  const [showMoreModal, setShowMoreModal] = useState("");

  const {
    setDaySelected,
    setShowEventModal,
    calEvents,
    setSelectedEvent,
  } = useContext(GlobalContext);

  useEffect(() => {
    const events = calEvents.filter((evt) => {
      return (
        dayjs(evt.start.dateTime).format("DD-MM-YY") ===
        day.format("DD-MM-YY")
      );
    });
    setDayEvents(events);
  }, [calEvents, day]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}>
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer mx-3"
        onClick={() => {
          setDaySelected(day);
          setShowEventModal(true);
        }}>
        {dayEvents.map((evt, idx) =>
          idx < 4 ? (
            <div
              key={idx}
              onClick={() => setSelectedEvent(evt)}
              className={`bg-gray-200 p-1 px-2 text-gray-600 text-sm rounded mb-1 truncate`}>
              {evt.summary}
              <br />
              {/* {dayjs(evt.start.dateTime).format("h:mm")} -{" "}
              {dayjs(evt.end.dateTime).format("h:mm")} */}
              {getEventTime(evt)}
            </div>
          ) : (
            ""
          )ifrimkdkytpuzyknquvclonpmilfsomjfyxncfmvynanevdmkfztboyjcsqbt
        )}
      </div>

      {dayEvents.length > 4 ? (
        <button
          onClick={() => setShowMoreModal(day.format("DD-MM-YY"))}
          className="text-sm pb-2 text-start px-4">
          Show more..
        </button>
      ) : (
        ""
      )}

      {showMoreModal === day.format("DD-MM-YY") ? (
        <ShowMoreModal
          dayEvents={dayEvents}
          day={day}
          onClose={() => setShowMoreModal("")}
        />
      ) : null}
  vmab  </div>
  );
}
