import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBusinessReg } from "../../state";
import {
  InputBase,
  useTheme,
  TextareaAutosize,
  Select,
  MenuItem,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { getCategories, getSubCategories } from "helper/helper";

export default function BusinessActivity() {
  const businessReg = useSelector((state) => state.businessReg);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState();
  const [subcategories, setSubCategories] = useState();

  const [formValues, setFormValues] = useState({
    business_category: "",
    business_sub_category: "",
    business_description: "",
    no_of_employees: "",
    additional_activity: "",
    premise_size: "",
    sub_category_fee: 0
  });

  useEffect(() => {
    getCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setFormValues({
      business_category: businessReg?.business_category || "",
      business_sub_category: businessReg?.business_sub_category || "",
      business_description: businessReg?.business_description || "",
      no_of_employees: businessReg?.no_of_employees || "",
      additional_activity: businessReg?.additional_activity || "",
      premise_size: businessReg?.premise_size || "",
      sub_category_fee: businessReg?.sub_category_fee || 0
    });
  }, []);

  useEffect(() => {
    dispatch(setBusinessReg(formValues));
  }, [formValues, dispatch]);

  useEffect(() => {
    let selectedCategory =
      categories &&
      categories.filter((category) => {
        return category.name === formValues.business_category;
      });

    categories && getSubCategories({ id: selectedCategory[0]?._id }).then(({ data }) =>
      setSubCategories(data)
    );
  }, [formValues.business_category, categories]);

  useEffect(() => {
    let selectedSubCategory = subcategories && subcategories.filter((item) => {
      return subcategories.name === formValues.business_sub_category
    })

    console.log("selected sub cat:",selectedSubCategory)
    subcategories && setFormValues({sub_category_fee: selectedSubCategory[0]?.price})
  },[formValues.business_sub_category,subcategories])

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
            <Select
              onChange={handleChange}
              value={
                formValues["business_category"] ||
                businessReg?.business_category
              }
              name="business_category"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "0.3rem 0.3rem",
              }}
            >
              <MenuItem value="">Choose Business Category</MenuItem>
              {categories?.map((category) => (
                <MenuItem value={category.name}>{category.name}</MenuItem>
              ))}
            </Select>
          </FlexBetween>
        </div>
        <div className="w-full mx-2 flex-1">
          <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
            business sub-category
          </div>
          <FlexBetween gap="1.5rem">
            <Select
              onChange={handleChange}
              value={
                formValues["business_sub_category"] ||
                businessReg?.business_sub_category
              }
              name="business_sub_category"
              sx={{
                width: "95%",
                backgroundColor: palette.neutral.light,
                borderRadius: "0.5rem",
                padding: "0.3rem 0.3rem",
              }}
            >
              <MenuItem value="">Choose Business Sub-Category</MenuItem>
              {subcategories?.map((subcategory) => (
                <MenuItem value={subcategory.name}>{subcategory.name}</MenuItem>
              ))}
            </Select>
          </FlexBetween>
          <input value="" hidden/>
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
              value={
                formValues["business_description"] ||
                businessReg?.business_description
              }
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
              value={
                formValues["no_of_employees"] || businessReg?.no_of_employees
              }
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
              value={
                formValues["additional_activity"] ||
                businessReg?.additional_activity
              }
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
