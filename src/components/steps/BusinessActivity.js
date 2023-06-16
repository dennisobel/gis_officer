import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessReg } from "../../state";
import {
  InputBase,
  useTheme,
  TextareaAutosize,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

export default function BusinessActivity() {
  const businessReg = useSelector(state => state.businessReg)
  const { palette } = useTheme();
  const dispatch = useDispatch()

  const [formValues, setFormValues] = useState({
    business_category: "",
    business_sub_category: "",
    business_description: "",
    no_of_employees: "",
    additional_activity: "",
    premise_size: "",
  });

  useEffect(() => {
    setFormValues({
      business_category: businessReg?.business_category || "",
      business_sub_category: businessReg?.business_sub_category || "",
      business_description: businessReg?.business_description || "",
      no_of_employees: businessReg?.no_of_employees || "",
      additional_activity: businessReg?.additional_activity || "",
      premise_size: businessReg?.premise_size || "",
    });
  }, []);

  useEffect(()=>{
    dispatch(setBusinessReg(formValues))
  },[formValues,dispatch])

  const handleChange = (e) => {
    e.preventDefault();
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <WidgetWrapper>
      <div className="text-center">
        <p className="text-gray-700 text-lg mb-1 text-4xl font-bold">
          Business Activity & Information
        </p>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase mb-1">
            business category
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["business_category"] || businessReg?.business_category}
              name="business_category"
              placeholder="Health"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            business sub-category
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["business_sub_category"] || businessReg?.business_sub_category}
              name="business_sub_category"
              placeholder="Clinic"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Business Description
          </div>
          <FlexBetween gap="1.5rem">
            <TextareaAutosize
              rows={4}
              placeholder="Enter business description"
              onChange={handleChange}
              value={formValues["business_description"] || businessReg?.business_description}
              name="business_description"
              style={{
                width: "95%",
                resize: "vertical",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            />
          </FlexBetween>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Number of employees
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["no_of_employees"] || businessReg?.no_of_employees}
              name="no_of_employees"
              placeholder="0"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Additional activity if any (Optional)
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["additional_activity"] || businessReg?.additional_activity}
              name="additional_activity"
              placeholder="Additional activity"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            Premises Size (Area) in Sq. Metres
          </div>
          <FlexBetween gap="1.5rem">
            <InputBase
              onChange={handleChange}
              value={formValues["premise_size"] || businessReg?.premise_size}
              name="premise_size"
              placeholder="Premises Size (Area)"
              type="text"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "1rem 2rem",
              }}
            />
          </FlexBetween>
        </div>
      </div>
    </WidgetWrapper>
  );
}
