// src/pages/products/rates/ProductRateForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useCreateProductRateMutation,
  useGetProductRatesQuery,
  useUpdateProductRateMutation,
} from "../../../redux/api/productRate";

const validationSchema = Yup.object({
  rate: Yup.number()
    .required("Rate is required")
    .min(0, "Rate must be positive"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
});

const ProductRateForm: React.FC = () => {
  const { productId, id } = useParams<{ productId: string; id?: string }>();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: productRates } = useGetProductRatesQuery({
    productId: productId!,
  });
  const [createRate] = useCreateProductRateMutation();
  const [updateRate] = useUpdateProductRateMutation();

  const formik = useFormik({
    initialValues: {
      rate: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const rateData = {
          rate: values.rate,
          startDate: values.startDate.toISOString().split("T")[0],
          endDate: values.endDate.toISOString().split("T")[0],
        };

        if (id) {
          await updateRate({ id, data: rateData }).unwrap();
          setSnackbar({
            open: true,
            message: "Rate updated successfully!",
            severity: "success",
          });
        } else {
          await createRate({ productId: productId!, data: rateData }).unwrap();
          setSnackbar({
            open: true,
            message: "Rate created successfully!",
            severity: "success",
          });
          navigate(`/products/${productId}/rates`);
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: "An error occurred",
          severity: "error",
        });
      }
    },
  });

  useEffect(() => {
    if (id && productRates?.rates) {
      const rateToEdit = productRates.rates.find((rate) => rate.id === id);
      if (rateToEdit) {
        formik.setValues({
          rate: rateToEdit.rate,
          startDate: new Date(rateToEdit.startDate),
          endDate: new Date(rateToEdit.endDate),
        });
      }
    }
  }, [id, productRates]);

  return (
    <Box p={4}>
      <Box mb={4} display="flex" alignItems="center">
        <IconButton onClick={() => navigate(`/products/${productId}/rates`)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" ml={2}>
          {id ? "Edit Product Rate" : "Add New Product Rate"}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Product: {productRates?.product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  SKU: {productRates?.product.sku}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rate"
                  name="rate"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  value={formik.values.rate}
                  onChange={formik.handleChange}
                  error={formik.touched.rate && Boolean(formik.errors.rate)}
                  helperText={formik.touched.rate && formik.errors.rate}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Start Date
                  </Typography>
                  <DatePicker
                    selected={formik.values.startDate}
                    onChange={(date: Date | null) => {
                      if (date) {
                        formik.setFieldValue("startDate", date);
                      }
                    }}
                    selectsStart
                    startDate={formik.values.startDate}
                    endDate={formik.values.endDate}
                    className="date-picker-input"
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <Typography color="error" variant="body2">
                      {formik.errors.startDate as string}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    End Date
                  </Typography>
                  <DatePicker
                    onChange={(date: Date | null) => {
                      if (date) {
                        formik.setFieldValue("endDate", date);
                      }
                    }}
                    selectsEnd
                    startDate={formik.values.startDate}
                    endDate={formik.values.endDate}
                    minDate={formik.values.startDate}
                    className="date-picker-input"
                  />
                  {formik.touched.endDate && formik.errors.endDate && (
                    <Typography color="error" variant="body2">
                      {formik.errors.endDate as string}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : id ? (
                    "Update Rate"
                  ) : (
                    "Create Rate"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductRateForm;
