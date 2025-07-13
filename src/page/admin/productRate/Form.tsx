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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
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
import { useGetProductsQuery } from "../../../redux/api/produc";

const validationSchema = Yup.object({
  productId: Yup.string().required("Product is required"),
  rate: Yup.number()
    .required("Rate is required")
    .min(0, "Rate must be positive"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
});

const ProductRateForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
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

  // Formik must be initialized before using its values in hooks
  const formik = useFormik({
    initialValues: {
      productId: "",
      rate: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      productName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const rateData: any = {
          productId: values.productId,
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
          await createRate(rateData).unwrap();
          setSnackbar({
            open: true,
            message: "Rate created successfully!",
            severity: "success",
          });
          navigate("/products-rates");
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

  // Fetch all products for the dropdown
  const { data: products } = useGetProductsQuery({});
  // Fetch product rates if editing
  const { data: productRates } = useGetProductRatesQuery(
    { productId: formik.values.productId },
    { skip: !formik.values.productId || !id }
  );

  const [createRate] = useCreateProductRateMutation();
  const [updateRate] = useUpdateProductRateMutation();

  useEffect(() => {
    if (id && productRates?.rates) {
      const rateToEdit = productRates.rates.find((rate) => rate.id === id);
      if (rateToEdit) {
        formik.setValues({
          productId: rateToEdit.productId,
          rate: rateToEdit.rate,
          startDate: new Date(rateToEdit.startDate),
          endDate: new Date(rateToEdit.endDate),
          productName: rateToEdit.product?.name || "",
        });
      }
    }
  }, [id, productRates]);

  return (
    <Box p={4}>
      <Box mb={4} display="flex" alignItems="center">
        <IconButton onClick={() => navigate("/products-rates")}>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="product-select-label">Product</InputLabel>
                  <Select
                    labelId="product-select-label"
                    id="productId"
                    name="productId"
                    value={formik.values.productId}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.productId &&
                      Boolean(formik.errors.productId)
                    }
                    label="Product"
                    disabled={!!id} // Disable when editing
                  >
                    {products?.map((product: any) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.productId && formik.errors.productId && (
                    <Typography color="error" variant="body2">
                      {formik.errors.productId}
                    </Typography>
                  )}
                </FormControl>
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
                        // Auto-set end date if it's before start date
                        if (formik.values.endDate < date) {
                          formik.setFieldValue(
                            "endDate",
                            new Date(date.setMonth(date.getMonth() + 1))
                          );
                        }
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
                    selected={formik.values.endDate}
                    onChange={(date: Date | null) => {
                      if (date) formik.setFieldValue("endDate", date);
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
