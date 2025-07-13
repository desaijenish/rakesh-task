// src/pages/orders/OrderForm.tsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBack,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Order } from "../../../types/orderTypes";
import {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
} from "../../../redux/api/order";
import { formatCurrency } from "../../../utils/formatDate";

const validationSchema = Yup.object({
  userId: Yup.number().required("User ID is required"),
  address: Yup.string().required("Address is required"),
  OrderItems: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.number().required("Product ID is required"),
        quantity: Yup.number()
          .required("Quantity is required")
          .min(1, "Quantity must be at least 1"),
        price: Yup.number()
          .required("Price is required")
          .min(0, "Price must be positive"),
      })
    )
    .min(1, "At least one item is required"),
});

const OrderForm: React.FC = () => {
  const { id } = useParams();
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

  const { data: order, isLoading } = useGetOrderByIdQuery(id, {
    skip: !id,
  });
  const [createOrder] = useCreateOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const formik = useFormik({
    initialValues: {
      userId: 0,
      address: "",
      OrderItems: [
        {
          productId: 0,
          quantity: 1,
          price: 0,
          Product: { name: "", sku: "" },
        },
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const orderData = {
          userId: values.userId,
          address: values.address,
          OrderItems: values.OrderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        };

        if (id) {
          await updateOrder({ id: id as string, data: orderData }).unwrap();
          setSnackbar({
            open: true,
            message: "Order updated successfully!",
            severity: "success",
          });
        } else {
          await createOrder(orderData).unwrap();
          setSnackbar({
            open: true,
            message: "Order created successfully!",
            severity: "success",
          });
          navigate("/orders");
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
    if (order) {
      formik.setValues({
        userId: order.userId,
        address: order.address,
        OrderItems: order.OrderItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          Product: item.Product,
        })),
      });
    }
  }, [order]);

  const addItem = () => {
    formik.setFieldValue("OrderItems", [
      ...formik.values.OrderItems,
      { productId: 0, quantity: 1, price: 0, Product: { name: "", sku: "" } },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...formik.values.OrderItems];
    newItems.splice(index, 1);
    formik.setFieldValue("OrderItems", newItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof (typeof formik.values.OrderItems)[0],
    value: any
  ) => {
    const newItems = [...formik.values.OrderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    formik.setFieldValue("OrderItems", newItems);
  };

  // Mock products data - in a real app, you would fetch this from your API
  const mockProducts = [
    { id: 3, name: "Premium Wireless Headphones", sku: "MC165", price: 500 },
    { id: 1, name: "Smartphone X", sku: "SPX2023", price: 999 },
    { id: 2, name: "Bluetooth Speaker", sku: "BTS450", price: 150 },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box mb={4} display="flex" alignItems="center">
        <IconButton onClick={() => navigate("/orders")}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" ml={2}>
          {id ? "Edit Order" : "Create New Order"}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="User ID"
                  name="userId"
                  type="number"
                  value={formik.values.userId}
                  onChange={formik.handleChange}
                  error={formik.touched.userId && Boolean(formik.errors.userId)}
                  helperText={formik.touched.userId && formik.errors.userId}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addItem}
                  sx={{ mb: 2 }}
                >
                  Add Item
                </Button>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ maxHeight: 400 }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formik.values.OrderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Autocomplete
                              options={mockProducts}
                              getOptionLabel={(option) =>
                                `${option.name} (${option.sku})`
                              }
                              value={
                                mockProducts.find(
                                  (p) => p.id === item.productId
                                ) || null
                              }
                              onChange={(e, newValue) => {
                                handleItemChange(
                                  index,
                                  "productId",
                                  newValue?.id || 0
                                );
                                handleItemChange(
                                  index,
                                  "price",
                                  newValue?.price || 0
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  placeholder="Select product"
                                  error={
                                    formik.touched.OrderItems &&
                                    Boolean(
                                      (formik.errors.OrderItems as any)?.[index]
                                        ?.productId
                                    )
                                  }
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  parseInt(e.target.value)
                                )
                              }
                              error={
                                formik.touched.OrderItems &&
                                Boolean(
                                  (formik.errors.OrderItems as any)?.[index]
                                    ?.quantity
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "price",
                                  parseFloat(e.target.value)
                                )
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
                              error={
                                formik.touched.OrderItems &&
                                Boolean(
                                  (formik.errors.OrderItems as any)?.[index]
                                    ?.price
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.quantity * item.price)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => removeItem(index)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {formik.touched.OrderItems &&
                  formik.errors.OrderItems &&
                  typeof formik.errors.OrderItems === "string" && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {formik.errors.OrderItems}
                    </Typography>
                  )}
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
                    "Update Order"
                  ) : (
                    "Create Order"
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

export default OrderForm;
