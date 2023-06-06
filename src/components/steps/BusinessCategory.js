import { useDispatch, useSelector } from "react-redux";
import { setBusinessReg } from "../../state";
import { useEffect, useState } from "react";
import WidgetWrapper from "components/WidgetWrapper";
import {
  Select,
  MenuItem
} from "@mui/material";
import FlexBetween from "components/FlexBetween";

export default function BusinessCategory() {
  const businessReg = useSelector(state => state.businessReg)
  const dispatch = useDispatch()
  const [formValues,setFormValues] = useState({
    applicationType:"",
    registered:""
  })

  const handleChange = (e) => {
    e.preventDefault()
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setFormValues({
      applicationType: businessReg?.applicationType || "",
      registered: businessReg?.registered || ""
    });
  }, []);
  

  useEffect(()=>{
    dispatch(setBusinessReg(formValues))
  },[formValues])

  return (
    <WidgetWrapper>
      <div className="text-center">
        <p className="text-gray-700 text-lg font-bold">
          Business Category
        </p>
      </div>
      <div className="flex flex-col ">
        <div className="mx-2 w-full flex-1">
          <div className="mt-3 h-6 text-xs font-bold uppercase leading-8 text-gray-500">
            Application Type
          </div>
          <FlexBetween gap="1.5rem">
            <Select
              onChange={handleChange}
              value={formValues["applicationType"] || businessReg?.applicationType}
              name="applicationType"
              sx={{
                width:"300px"
              }}
            >
              <MenuItem value="">Choose Application Type</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="ammendment">Ammendment</MenuItem>
            </Select>
          </FlexBetween>
        </div>

        <div className="mx-2 w-full flex-1">
          <div className="mt-3 h-6 text-xs font-bold uppercase leading-8 text-gray-500">
          Is your business already registered
          </div>
          <FlexBetween gap="1.5rem">
            <Select
              onChange={handleChange}
              value={formValues["registered"] || businessReg?.registered}
              name="registered"
              sx={{
                width:"300px"
              }}
            >
              <MenuItem value="">Registered</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FlexBetween>
        </div>
      </div>
      </WidgetWrapper>
  );
}
