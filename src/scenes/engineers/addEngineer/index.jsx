import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";

// react
import { useState } from "react";

// mui libraries
import { Box, Button, useTheme, TextField,NativeSelect,  InputLabel,FormControl,MenuItem  } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

//External libraries
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { baseUrl } from "../../../shared/baseUrl";
import { createEngineerApi } from "../../../shared/APIs";


const AddEngineer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleFormSubmit = (values) => {
    console.log(values);
    axios.post(`${baseUrl}${createEngineerApi}`,values,{
      headers:{}
    }).then(function(response){
      console.log(response);
    })
    };
  
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "0945587900",
    engineer_specialization_id: "1",
    password: "",
    years_of_experience:"3"

  };
  const spicializations = [
    "Civil Engineer",
    "Electro Engineer",
    "micaninc engineer",
  ];
  const phoneRegExp =
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  const userSchema = yup.object().shape({
    first_name: yup.string().required("required"),

    last_name: yup.string().required("required"),

    email: yup.string().email("invalid email").required("required"),

    phone_number: yup
      .string()
      .matches(phoneRegExp, "Phone number is invalid")
      .required("required"),

      // engineer_specialization_id: yup.string().required("required"),

    password: yup.string().required("required"),
  });

  return (
    <Box m="10px">
      <Header
        title="Create New Engineer"
        subtitle="create a new account"
      ></Header>
      <Box
        
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={userSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.first_name}
                  name="first_name"
                  error={!!touched.first_name && !!errors.first_name}
                  helperText={touched.first_name && errors.first_name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.last_name}
                  name="last_name"
                  error={!!touched.last_name && !!errors.last_name}
                  helperText={touched.last_name && errors.last_name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Phone Number"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phone_number}
                  name="phone_number"
                  error={!!touched.phone_number && !!errors.phone_number}
                  helperText={touched.phone_number && errors.phone_number}
                  sx={{ gridColumn: "span 4" }}
                />
<FormControl
                  fullWidth
                  variant="filled"
                  sx={{ gridColumn: "span 4" }}
                  name="engineer_specialization_id"
                  error={!!touched.engineer_specialization_id && !!errors.engineer_specialization_id}
                >
                  <Box m="10px">
                  <InputLabel htmlFor="spicialization-native-select"> 
                    Spicialization
                  </InputLabel>
                  </Box>
                  <NativeSelect
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputProps={{
                      name: "spicialization",
                      id: "spicialization-native-select",
                    }}
                    sx={{ padding: "14px 12px", border: "none" }} // Adjust padding to match TextField's visual style if needed
                  >
                    <option value="">-- Select an Address --</option>{" "}
                    {/* Optional: default empty option */}
                    {spicializations.map((spicializationOption) => (
                      <option key={spicializationOption} value={spicializationOption}>
                        {spicializationOption}
                      </option>
                    ))}
                  </NativeSelect>
                  {touched.address && errors.address && (
                    <Box
                      sx={{
                        color: theme.palette.error.main,
                        fontSize: "0.75rem",
                        mt: "3px",
                        ml: "14px",
                      }}
                    >
                      {errors.address}
                    </Box>
                  )}
                </FormControl>
                      
                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </Box>

              <Box display="flex" justifyContent="end" mt="20px">
                <Button
                  type="submit"
                  style={{
                    backgroundColor: colors.greenAccent[700],
                    color: colors.blueAccent[100],
                  }}
                  variant="contained"
                >
                  Create New User
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AddEngineer;
