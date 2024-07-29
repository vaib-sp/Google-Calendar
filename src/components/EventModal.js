import React, { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";
import TimePicker from "./TimePicker";
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
    addEvent,
    updateEvent,
    deleteEvent
  } = useContext(GlobalContext);
  console.log(selectedEvent);
  const [title, setTitle] = useState(
    selectedEvent ? selectedEvent.summary : ""
  );
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [email, setEmail] = useState(
    selectedEvent
      ? selectedEvent?.attendees && selectedEvent?.attendees[1].email
      : ""
  );

  function handleSubmit(e) {
    e.preventDefault();

    const calendarEvent = {
      summary: title,
      description,

      start: {
        dateTime:
          // daySelected.format("YYYY-MM-DD"),
          dayjs(daySelected.format("YYYY-MM-DD") + time.timeStart)
            .utc()
            .format(),
        timeZone: "UTC",
      },
      end: {
        dateTime:
          // daySelected.format("YYYY-MM-DD"),
          dayjs(daySelected.format("YYYY-MM-DD") + time.timeEnd)
            .utc()
            .format(),
        timeZone: "UTC",
      },
      attendees: [
        {
          email: "vaibhav_dalakoti@softprodigy.com",
          organizer: true,
          self: true,
          responseStatus: "accepted",
        },
        {
          email,
        },
      ],
      eventType: "default",
      conferenceData: {
        createRequest: {
          requestId: "rus-bfjb-cjgg", // A unique identifier for the request
          conferenceSolutionKey: {
            type: "hangoutsMeet", // Use 'hangoutsMeet' for Google Meet
          },
        },
      },
    };

    console.log("calendarEvent", calendarEvent);

    if (selectedEvent) {
      updateEvent({...calendarEvent, id: selectedEvent.id });
    } else {
      addEvent(calendarEvent);
    }

    setShowEventModal(false);
  }

  const [time, setTime] = useState({
    timeStart: selectedEvent?.start?.dateTime
      ? dayjs(selectedEvent?.start?.dateTime).format("HH:mm")
      : "09:30",
    timeEnd: selectedEvent?.start?.dateTime
      ? dayjs(selectedEvent?.end?.dateTime).format("HH:mm")
      : "10:30",
  });

  console.log(time);

  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center z-30">
      <form className="bg-white rounded-lg shadow-2xl w-1/4">
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                onClick={() => {
                  deleteEvent(selectedEvent.id);
                  setShowEventModal(false);
                }}
                className="material-icons-outlined text-gray-400 cursor-pointer">
                delete
              </span>
            )}
            <button onClick={() => setShowEventModal(false)}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />

            <span className="material-icons-outlined text-gray-400">
              segment
            </span>
            <input
              type="text"
              name="description"
              placeholder="Add a description"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            />

            <span className="material-icons-outlined text-gray-400">
              segment
            </span>
            <input
              type="text"
              name="email"
              placeholder="Invite people"
              value={email}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
            />

            <span className="material-icons-outlined text-gray-400">
              bookmark_border
            </span>
            <p>{daySelected.format("dddd, MMMM DD")}</p>

            <span className="material-icons-outlined text-gray-400">
              schedule
            </span>
            <TimePicker time={time} setTime={setTime} />
          </div>
        </div>
        <footer className="flex justify-end border-t p-3 mt-5">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded text-white">
            Save
          </button>
        </footer>
      </form>
    </div>
  );
}
