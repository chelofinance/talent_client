import React, {MouseEvent} from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmationNumberOutlined from "@mui/icons-material/ConfirmationNumberOutlined";

import Card from "@shared/components/common/Card";
import Button from "@shared/components/common/Forms/Button";
import AvatarElement from "@shared/components/common/AvatarElement";
import {useRouter} from "next/router";

interface EventCardProps {
  title?: string;
  image?: string;
  eventTitle?: string;
  startDate?: number;
  endDate?: number;
  location?: string;
  isFinished: boolean;
  description?: string;
  numberOfWinners?: number;
  winners?: {wallet: string; name: string; executed: boolean}[];
  handleWinnerClick?: (wallet: string) => (event: MouseEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  image,
  eventTitle,
  startDate,
  endDate,
  location,
  numberOfWinners,
  isFinished,
  description,
  winners,
  handleWinnerClick,
}) => {
  return (
    <Card
      className={`w-2/3 py-${title ? "1" : "4"
        } w-full bg-neutral-50 text-black rounded-xl border border-gray-200 shadow-md h-full`}
      custom
    >
      {title && (
        <div className="mb-4 px-4 border-b border-gray-200">
          <span className="text-gray-500 font-semibold text-xl">{title}</span>
        </div>
      )}
      <div className="px-4">
        {image && (
          <div className="w-full flex justify-center rounded-2xl mb-5 w-full max-h-96 overflow-hidden">
            <div className="w-full flex justify-center mb-5 h-72 relative flex items-center h-max-96">
              <img
                src={image}
                alt="Event Image"
                className={`rounded-xl ${image === "/multimedia/chelo/logo_black.png" ? "opacity-75" : ""
                  } w-full max-h-72 object-cover object-center`}
              />
            </div>
          </div>
        )}
        {eventTitle && (
          <div className="mb-4">
            <span className="text-violet-500 font-bold text-2xl">{eventTitle}</span>
          </div>
        )}
        <div className="flex items-start mb-7">
          {startDate && endDate && (
            <div className="flex gap-3 items-center mr-20">
              <span className="text-violet-500">
                <CalendarMonthIcon fontSize="small" color="inherit" />
              </span>
              <div className="flex flex-col">
                <p className="text-sm">Date and time</p>
                <p className="text-gray-500 text-sm">
                  {new Date(startDate).toDateString()} - {new Date(endDate).toDateString()}
                </p>
              </div>
            </div>
          )}
          {location && (
            <div className="flex gap-3 items-center mr-20">
              <span className="text-violet-500">
                <LocationOnIcon fontSize="small" color="inherit" />
              </span>
              <div className="flex flex-col">
                <p className="text-sm">Location</p>
                <p className="text-gray-500 text-sm">{location}</p>
              </div>
            </div>
          )}
          {numberOfWinners && (
            <div className="flex gap-3 items-center">
              <span className="text-violet-500">
                <ConfirmationNumberOutlined fontSize="small" color="inherit" />
              </span>
              <div className="flex flex-col">
                <p className="text-sm">No. of winners</p>
                <p className="text-gray-500 text-sm">{numberOfWinners}</p>
              </div>
            </div>
          )}
        </div>
        {description && (
          <div className="mb-10">
            <p className="text-sm">{description}</p>
          </div>
        )}
        {isFinished && winners && (
          <div>
            <span className="text-violet-500 font-bold text-xl">Candidate Winners</span>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 my-5 mx-0 justify-center">
              {winners.map(({wallet, name, executed}, i) => (
                <div
                  key={i}
                  className={executed ? "" : "hover:bg-gray-100 cursor-pointer"}
                  onClick={handleWinnerClick && !executed ? handleWinnerClick(wallet) : undefined}
                >
                  <AvatarElement
                    address={wallet}
                    infoComponent={
                      <div className="flex flex-col">
                        <p className="text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-28">
                          {name}
                        </p>
                        <div className="flex gap-2">
                          <p className="text-xs text-gray-600">Alumni</p>
                          {executed && (
                            <p className="text-xs text-violet-500 font-semibold">Claimed</p>
                          )}
                        </div>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EventCard;
