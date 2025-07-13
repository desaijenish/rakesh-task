// pages/ProductForm.tsx
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
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ArrowBack, Delete, CloudUpload } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../../../redux/api/produc";

const validationSchema = Yup.object({
  name: Yup.string().required("Product name is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be positive"),
  description: Yup.string().required("Description is required"),
  sku: Yup.string().required("SKU is required"),
  category: Yup.string().required("Category is required"),
  currentStock: Yup.number()
    .required("Stock is required")
    .min(0, "Stock must be positive"),
});

const ProductForm: React.FC = () => {
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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { data: product, isLoading } = useGetProductByIdQuery(id, {
    skip: !id,
  });
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      sku: "",
      categoryId: "", // Changed from 'category' to 'categoryId'
      currentStock: 0,
      image: [] as string[],
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        if (id) {
          await updateProduct({ id, ...values }).unwrap();
          setSnackbar({
            open: true,
            message: "Product updated successfully!",
            severity: "success",
          });
        } else {
          await createProduct(values).unwrap();
          setSnackbar({
            open: true,
            message: "Product created successfully!",
            severity: "success",
          });
          navigate("/products");
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
    if (product) {
      formik.setValues({
        name: product.name,
        price: product.price,
        description: product.description,
        sku: product.sku,
        categoryId: product.categoryId, // Changed from 'category' to 'categoryId'
        currentStock: product.currentStock,
        image: product.image || [],
      });
      setImagePreviews(product.image || []);
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);

      // In a real app, you would upload the images here and get back URLs
      // Then set those URLs in formik.values.image
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    // Also remove from formik.values.image if needed
  };

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
        <IconButton onClick={() => navigate("/products")}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" ml={2}>
          {id ? "Edit Product" : "Add New Product"}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  margin="normal"
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.price && Boolean(formik.errors.price)
                      }
                      helperText={formik.touched.price && formik.errors.price}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Current Stock"
                      name="currentStock"
                      type="number"
                      value={formik.values.currentStock}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.currentStock &&
                        Boolean(formik.errors.currentStock)
                      }
                      helperText={
                        formik.touched.currentStock &&
                        formik.errors.currentStock
                      }
                      margin="normal"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="SKU"
                      name="sku"
                      value={formik.values.sku}
                      onChange={formik.handleChange}
                      error={formik.touched.sku && Boolean(formik.errors.sku)}
                      helperText={formik.touched.sku && formik.errors.sku}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="categoryId" // Changed from 'category' to 'categoryId'
                        value={formik.values.categoryId}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.categoryId &&
                          Boolean(formik.errors.categoryId)
                        }
                        label="Category"
                      >
                        <MenuItem value="1">Electronics</MenuItem>
                        <MenuItem value="2">Clothing</MenuItem>
                        <MenuItem value="3">Home & Kitchen</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Product Images
                </Typography>
                <Box mb={2}>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUpload />}
                    fullWidth
                  >
                    Upload Images
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </Button>
                </Box>

                <Grid container spacing={1}>
                  {/* {imagePreviews.map((preview, index) => (
                    <Grid item xs={6} key={index}>
                      <Box position="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.7)",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))} */}
                </Grid>
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
                    "Update Product"
                  ) : (
                    "Create Product"
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

export default ProductForm;
