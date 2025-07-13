import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  TextField,
  Snackbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRegisterUserMutation } from "../../../redux/api/login";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  dob: Yup.date().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  profileImage: Yup.mixed().required("Profile image is required"),
});

const defaultValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  dob: null,
  gender: "",
  profileImage: null,
};

export function SignUpForm(): React.JSX.Element {
  const [createRegister] = useRegisterUserMutation();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setIsPending(true);
      setApiError(null);

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("phone", values.phone);
        formData.append("address", values.address);
        formData.append("dob", dayjs(values.dob).format("YYYY-MM-DD"));
        formData.append("gender", values.gender);
        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        const result: any = await createRegister(formData);

        if ("error" in result) {
          setFieldError("general", result?.error?.message);
          setApiError(result.error.data.detail);
          return;
        }

        // Handle successful registration
        setSuccessMessage("Registration successful! Redirecting to login...");
        setOpenSnackbar(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setApiError("An unexpected error occurred");
      } finally {
        setIsPending(false);
        setSubmitting(false);
      }
    },
  });
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      formik.setFieldValue("profileImage", event.currentTarget.files[0]);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">Sign up</Typography>
          <Typography color="text.secondary" variant="body2">
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              variant="subtitle2"
            >
              Sign in
            </Link>
          </Typography>
        </Stack>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            <FormControl
              error={Boolean(formik.errors.name && formik.touched.name)}
              required
            >
              <InputLabel htmlFor="name">Full Name</InputLabel>
              <OutlinedInput
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Full Name"
              />
              {formik.errors.name && formik.touched.name ? (
                <FormHelperText>{formik.errors.name}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              error={Boolean(formik.errors.email && formik.touched.email)}
              required
            >
              <InputLabel htmlFor="email">Email address</InputLabel>
              <OutlinedInput
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Email address"
              />
              {formik.errors.email && formik.touched.email ? (
                <FormHelperText>{formik.errors.email}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              error={Boolean(formik.errors.password && formik.touched.password)}
              required
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {formik.errors.password && formik.touched.password ? (
                <FormHelperText>{formik.errors.password}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              error={Boolean(formik.errors.phone && formik.touched.phone)}
              required
            >
              <InputLabel htmlFor="phone">Phone Number</InputLabel>
              <OutlinedInput
                id="phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Phone Number"
              />
              {formik.errors.phone && formik.touched.phone ? (
                <FormHelperText>{formik.errors.phone}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              error={Boolean(formik.errors.address && formik.touched.address)}
              required
            >
              <InputLabel htmlFor="address">Address</InputLabel>
              <OutlinedInput
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Address"
                multiline
                rows={3}
              />
              {formik.errors.address && formik.touched.address ? (
                <FormHelperText>{formik.errors.address}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              error={Boolean(formik.errors.dob && formik.touched.dob)}
              required
            >
              <DatePicker
                label="Date of Birth"
                value={formik.values.dob}
                onChange={(date) => formik.setFieldValue("dob", date)}
                maxDate={dayjs().subtract(18, "year")} // Assuming users must be at least 18
                slotProps={{
                  textField: {
                    error: Boolean(formik.errors.dob && formik.touched.dob),
                    helperText:
                      formik.errors.dob && formik.touched.dob
                        ? formik.errors.dob
                        : null,
                  },
                }}
              />
            </FormControl>

            <FormControl
              error={Boolean(formik.errors.gender && formik.touched.gender)}
              required
            >
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
              {formik.errors.gender && formik.touched.gender ? (
                <FormHelperText>{formik.errors.gender}</FormHelperText>
              ) : null}
            </FormControl>

            <FormControl
              error={Boolean(
                formik.errors.profileImage && formik.touched.profileImage
              )}
              required
            >
              <InputLabel shrink htmlFor="profileImage">
                Profile Image
              </InputLabel>
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
                style={{ marginTop: 16 }}
              />
              {formik.errors.profileImage && formik.touched.profileImage ? (
                <FormHelperText>{formik.errors.profileImage}</FormHelperText>
              ) : null}
            </FormControl>
            {apiError && <Alert severity="error">{apiError}</Alert>}

            <Button
              disabled={isPending}
              type="submit"
              variant="contained"
              fullWidth
              size="large"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </Stack>
        </form>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}
