import { useState } from "react";
import Stepper from "../../components/Stepper";
import StepperControl from "../../components/StepperControl";
import { UseContextProvider } from "../../contexts/StepperContext";

import BusinessCategory from "./BusinessCategory";
import BusinessDetails from "./BusinessDetails";
import BusinessActivity from "./BusinessActivity";
import BusinessContacts from "./BusinessContacts";
import Review from "../../components/steps/Review";
import Final from "../../components/steps/Final";

function SingleBusinessPermitReg() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <BusinessCategory />;
      case 2:
        return <BusinessDetails />;
      case 3:
        return <BusinessActivity />;
      case 4:
        return <BusinessContacts />;
      case 5:
        return <Review />;
      case 6:
        return <Final />;
      default:
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  return (
    // <div className="mx-auto rounded-2xl bg-white pb-2 shadow-xl md:w-1/2">
      <div className="mx-auto rounded-2xl pb-2 shadow-xl md:w-1/2 bg-teal-10">
      <div className="horizontal container mt-5 ">
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-8 text-4xl font-bold">
            Single Business Permit Application
          </p>
        </div>
        <Stepper steps={steps} currentStep={currentStep} />

        <div className="my-10 p-10 ">
          <UseContextProvider>{displayStep(currentStep)}</UseContextProvider>
        </div>
      </div>

      {currentStep !== steps.length && (
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
        />
      )}
    </div>
  );
}

export default SingleBusinessPermitReg;
