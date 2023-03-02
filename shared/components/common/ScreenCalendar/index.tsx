import React from "react";
import clsx from "clsx";
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/solid";

function useCalendar() {
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const days_of_month = () => {
    let kabisa = (yearin) => {
      return (
        (yearin % 4 === 0 && yearin % 100 !== 0 && yearin % 400 !== 0) ||
        (yearin % 100 === 0 && yearin % 400 === 0)
      );
    };
    let fevral = (yearin) => {
      return kabisa(yearin) ? 29 : 28;
    };
    return [31, fevral(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  };

  const hafta = (sol, ma) => {
    let day_of_week = new Date(sol, ma).getDay();
    switch (day_of_week) {
      case 0:
        day_of_week = 6;
        break;
      case 1:
        day_of_week = 0;
        break;
      case 2:
        day_of_week = 1;
        break;
      case 3:
        day_of_week = 2;
        break;
      case 4:
        day_of_week = 3;
        break;
      case 5:
        day_of_week = 4;
        break;
      case 6:
        day_of_week = 5;
        break;
      default:
        day_of_week = new Date(sol, ma).getDay();
        break;
    }
    return day_of_week;
  };

  return {
    year,
    setYear,
    days_of_month,
    month_names: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    day_names: ["Mo", "Th", "We", "Tu", "Fr", "Sa", "Su"],
    dayGenerator() {
      let days = [];
      for (let k = 0; k < days_of_month().length; k++) {
        days.push([]);
        for (let i = 1; i <= days_of_month()[k]; i++) {
          if (days[k].length < hafta(year, k)) {
            i -= i;
            days[k].push("");
            continue;
          }
          days[k].push(i);
        }
      }
      return days;
    },
    now() {
      let today = new Date();
      setYear(today.getFullYear());
    },
    isSunday(day, month) {
      const dayintable = new Date(year, month, day);
      return dayintable.getDay() == 0 ? true : false;
    },
  };
}

export const ScreenCalendar: React.FunctionComponent<{
  date: number;
  setDate: (arg: number) => void;
}> = (props) => {
  const {date, setDate} = props;
  const [currentView, setCurrentView] = React.useState(0);
  const {month_names, day_names, year, setYear, dayGenerator, isSunday} = useCalendar();
  const months = (currentView === 0 ? month_names.slice(0, 6) : month_names.slice(6)).map(
    (month, index) => {
      const monthIndex = index + (currentView === 0 ? 0 : 6);
      return {
        month,
        days: dayGenerator()[monthIndex],
        monthIndex,
      };
    }
  );

  const isDate = (day: number, month: number) => {
    const dayintable = new Date(year, month, day);
    return new Date(date).toDateString() === dayintable.toDateString() ? true : false;
  };

  const handleSetYear = (dir: "left" | "right") => () => {
    if (currentView == 1 && dir == "right") {
      setYear((prev) => prev + 1);
    } else if (currentView == 0 && dir == "left") {
      setYear((prev) => prev - 1);
    }
    setCurrentView((prev) => (prev == 1 ? 0 : 1));
  };

  const handleSetDate = (month: number, day: number) => () => {
    setDate(new Date(year, month, day).getTime());
  };

  return (
    <div className="w-full rounded-lg shadow">
      <div className="flex justify-between w-full h-12 p-1 m-1 text-xl font-bold bg-black rounded-lg shadow-lg">
        <ArrowLeftIcon className="cursor-pointer" width={20} onClick={handleSetYear("left")} />
        <p className="w-1/3 p-1 text-center text-white shadow-md cursor-pointer">{year}</p>
        <ArrowRightIcon
          className="cursor-pointer ml-2"
          width={20}
          onClick={handleSetYear("right")}
        />
      </div>
      <div className="flex flex-wrap justify-center">
        {months.map(({month, monthIndex, days}) => (
          <div className="p-1 m-1 font-sans rounded shadow-md w-72 ">
            <p className="p-1 text-sm font-semibold text-center ">{month}</p>
            <div className="p-1 m-1">
              <div className="grid grid-cols-7 font-semibold text-orange">
                {day_names.map((days) => (
                  <div className={`grid place-items-center ${days == "Ya" && "text-white"}`}>
                    <p>{days}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 font-semibold text-center text-gray-400 ">
                {days.map((day) => (
                  <div
                    className={clsx({
                      "ring-orange ring-4 rounded-full": isDate(day, monthIndex) == true,
                      "text-white ": isSunday(day, monthIndex) == true,
                      "hover:bg-orange ": isDate(day, monthIndex) == false,
                    })}
                    onClick={handleSetDate(monthIndex, day)}
                  >
                    <p>{day}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
