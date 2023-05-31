import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createBusinessPermit } from "../../helper/helper";

export default function Final() {
  const [displaySuccess, setdisplaySuccess] = useState(false);
  const data = useSelector(
    (state) => state.global.singleBusinessPermit.singleBusinessData
  );

  useEffect(() => {
    let permitPromise = createBusinessPermit(data);
    permitPromise.then((res) => {
      setdisplaySuccess(true);
    });
  }, []);

  return (
    <div className="container md:mt-10">
      {displaySuccess && (
        <div className="flex flex-col items-center">
          <div className="wrapper">
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>

          <div className="mt-3 text-xl font-semibold uppercase text-teal-500">
            Succesfully Submitted!
          </div>
          <div className="text-lg font-semibold text-gray-500">
            A customer representative will be with you shortly.
          </div>
          <a className="mt-10" href="/">
            <button className="h-10 px-5 text-teal-700 transition-colors duration-150 border border-gray-300 rounded-lg focus:shadow-outline hover:bg-teal-500 hover:text-teal-100">
              <Link to="/">Close</Link>
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
