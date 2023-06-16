import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import 'react-toastify/dist/ReactToastify.css';
import { useStepperContext } from "../../contexts/StepperContext";
import { useSelector, useDispatch } from 'react-redux';
import { updateReviewAccept } from "../../state";
import { useEffect } from "react";

export default function ReviewAccept() {
  const { userData, setUserData } = useStepperContext();
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState();

  const review = [
    {
      name: "Business Category",
      fields: [
        {
          name: "Business Category",
          value: "Hospitality",
        },
        {
          name: "Business Sub Category",
          value: "Hotel",
        },
      ],
    },
    {
      name: "Business Details",
      fields: [
        {
          name: "",
          value: "",
        },
      ],
    },
    {
      name: "Business Activity Information",
      fields: [
        {
          name: "",
          value: "",
        },
      ],
    },
    {
      name: "Business Contacts",
      fields: [
        {
          name: "",
          value: "",
        },
      ],
    },
  ];

  const [isAccordionOpen, setIsAccordionOpen] = useState(
    Array(review.length).fill(false)
  );

  const handleAccordionClick = (index) => {
    const newAccordionOpen = [...isAccordionOpen];
    newAccordionOpen[index] = !newAccordionOpen[index];
    setIsAccordionOpen(newAccordionOpen);
  };

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setIsChecked(checked)
    setUserData({ ...userData, [name]: !checked });
    dispatch(updateReviewAccept({ [name]: checked }));
  };

  return (
    <>
      <div className="text-center">
        <p className="text-gray-700 text-lg mb-8 text-4xl font-bold">
          Review & Submit
        </p>
      </div>
      <div className="flex flex-col">
        {review.map((item, index) => {
          return (
            <div className="w-full mx-2" key={index} style={{ marginBottom: "1rem" }}>
              <button
                className="flex items-center justify-between w-full bg-white text-gray-600 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={() => handleAccordionClick(index)}
              >
                <span className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase" style={{ padding: "0 1rem 0 1rem", margin: "1rem" }}>
                  {item.name}
                </span>
                <ChevronDownIcon
                  className={`${isAccordionOpen[index] ? "transform rotate-180" : ""
                    } h-5 w-5 text-gray-500`}
                />
              </button>
              {isAccordionOpen[index] && (
                <>
                  {item.fields.map((field, index) => {
                    return (
                      <div className="" key={index} style={{
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        border: "1px outset gray",
                        borderRadius: "0.5rem,",
                        backgroundColor: "white",
                        padding: "2px"
                      }}>

                        <div className="text-gray-500 text-sm mb-1 text-4xl font-bold" style={{ padding: "0 3px 0 3px", margin: "3px", border: "1 solid white" }}>
                          {field.name}
                        </div>

                        <div className="text-gray-700 text-lg mb-1 text-4xl" style={{ padding: "0 3px 0 3px", margin: "3px" }}>
                          {field.value}
                        </div>

                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
        {/* <Faq/> */}

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              name="terms"
              aria-describedby="terms"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
              required=""
              checked={isChecked}
              onChange={handleChange}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="terms"
              className="font-light text-gray-500 dark:text-gray-300"
            >
              I accept the{" "}
              <a
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                href="/legal"
              >
                Terms and Conditions
              </a>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
