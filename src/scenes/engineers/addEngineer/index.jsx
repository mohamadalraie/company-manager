// imports
import { Header } from "../../../components/Header";
import { tokens } from "../../../theme";
import { baseUrl } from "../../../shared/baseUrl";
import { createEngineerApi } from "../../../shared/APIs";
import CustomSnackbar from "../../../components/CustomSnackbar";

// react
import { useState, useRef } from "react"; // استورد useRef

// mui libraries
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  TextField,
  InputLabel,
  FormControl,
  NativeSelect,
  CircularProgress,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Visibility from "@mui/icons-material/Visibility"; // <--- Import this
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//External libraries
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";

const AddEngineer = () => {
  //colors setup
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //responsive design setup
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // password visibility
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // handling create engineer Api
  const [isLoading, setIsLoading] = useState(false);
  const snackbarRef = useRef(null);

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true); // Set loading state to true
    try {
      console.log("Submitting values:", values);
      const response = await axios.post(
        `${baseUrl}${createEngineerApi}`,
        values,
        {
          headers: {
            // Add any required headers here
          },
        }
      );

      console.log("Engineer created successfully:", response.data);
      // استدعاء showSnackbar من خلال الـ ref
      snackbarRef.current.showSnackbar(
        "Engineer created successfully!",
        "success"
      );
      resetForm(); // Reset the form fields after successful submission
    } catch (error) {
      console.error(
        "Error creating engineer:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create engineer. Please try again.";
      // استدعاء showSnackbar من خلال الـ ref
      snackbarRef.current.showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    engineer_specialization_id: "",
    password: "",
    years_of_experience: "",
  };

  const specializations = [
    { id: 1, name: "Civil Engineering" },
    { id: 2, name: "Electrical Engineering" },
    { id: 3, name: "Mechanical Engineering" },
    { id: 4, name: "Architectural Engineering" },
    { id: 5, name: "Computer Engineering" },
    { id: 6, name: "Environmental Engineering" },
    { id: 7, name: "Industrial Engineering" },
    { id: 8, name: "Structural Engineering" },
    { id: 9, name: "Geotechnical Engineering" },
    { id: 10, name: "Chemical Engineering" },
  ];
  const phoneRegExp =
    /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  //handle validations
  const userSchema = yup.object().shape({
    first_name: yup.string().required("required"),
    last_name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    phone_number: yup
      .string()
      .matches(phoneRegExp, "Phone number is invalid")
      .required("required"),
    engineer_specialization_id: yup.string().required("required"),
    password: yup.string().required("required"),
    years_of_experience: yup
      .number()
      .typeError("Experience must be a number")
      .required("required")
      .min(0, "Cannot be negative"),
  });

  // the main return
  return (
    <Box m="10px">
      <Header
        title="Create New Engineer"
        subtitle="Create a new account"
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
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="25px 30px"
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
                  error={
                    !!touched.engineer_specialization_id &&
                    !!errors.engineer_specialization_id
                  }
                >
                  <Box m="10px">
                    <InputLabel htmlFor="specialization-native-select">
                      Specialization
                    </InputLabel>
                  </Box>
                  <NativeSelect
                    value={values.engineer_specialization_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputProps={{
                      name: "engineer_specialization_id",
                      id: "specialization-native-select",
                    }}
                    sx={{ padding: "20px 0px 12px", border: "none" }}
                  >
                    <option value="">-- Select a Specialization --</option>
                    {specializations.map((specializationOption) => (
                      <option
                        key={specializationOption.id}
                        value={specializationOption.id}
                      >
                        {specializationOption.name}
                      </option>
                    ))}
                  </NativeSelect>
                  {touched.engineer_specialization_id &&
                    errors.engineer_specialization_id && (
                      <Box
                        sx={{
                          color: theme.palette.error.main,
                          fontSize: "0.75rem",
                          mt: "3px",
                          ml: "14px",
                        }}
                      >
                        {errors.engineer_specialization_id}
                      </Box>
                    )}
                </FormControl>

                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Years of Experience"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.years_of_experience}
                  name="years_of_experience"
                  error={
                    !!touched.years_of_experience &&
                    !!errors.years_of_experience
                  }
                  helperText={
                    touched.years_of_experience && errors.years_of_experience
                  }
                  sx={{ gridColumn: "span 4" }}
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
                  // Conditionally set type based on showPassword state
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                  // Add the InputAdornment
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="end" mt="20px" mb="20px">
                <Button
                  type="submit"
                  style={{
                    backgroundColor: colors.greenAccent[700],
                    color: colors.blueAccent[100],
                  }}
                  variant="contained"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create New User"
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {/* هنا نضع مكون CustomSnackbar ونمرر الـ ref له */}
      <CustomSnackbar ref={snackbarRef} />
    </Box>
  );
};

export default AddEngineer;
