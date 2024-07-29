import React, { useContext } from "react";
import { getEventTime } from "../util";
import GlobalContext from '../context/GlobalContext';

const ShowMoreModal = ({ dayEvents, day, onClose }) => {
  const {
    setSelectedEvent,
    setDaySelected,
    setShowEventModal
  } = useContext(GlobalContext);

  return (
    <div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center z-20">
      <div className="bg-white rounded-lg shadow-2xl w-1/5">
        <header className="bg-gray-100 px-4 py-2 flex justify-end items-center">
          <div>
            <button onClick={() => onClose()}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header>
        <div className="py-3 cursor-pointer">
          {dayEvents.map((evt, idx) => (
            <div
              key={idx + 'dayEvents'}
              onClick={() => {
                setDaySelected(day);
                setShowEventModal(true);
                setSelectedEvent(evt);
              }}
              className={`bg-gray-200 p-1 px-2 mx-1 text-gray-600 text-sm rounded mb-1 truncate`}>
              {evt.summary}
              <br />
              {/* {dayjs(evt.start.dateTime).format("h:mm")} -{" "}
              {dayjs(evt.end.dateTime).format("h:mm")} */}
              {getEventTime(evt)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowMoreModal;
