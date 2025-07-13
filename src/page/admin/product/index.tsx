// pages/ProductList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import styled from "@emotion/styled";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../../redux/api/produc";

const RootContainer = styled(Box)({
  padding: "32px",
  backgroundColor: "#f8fafc",
  minHeight: "100vh",
});

const HeaderContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
  flexWrap: "wrap",
  gap: "16px",
});

const SearchContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "24px",
  "& .MuiTextField-root": {
    flexGrow: 1,
    maxWidth: "400px",
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
  },
}));

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    data: products,
    isLoading,
    isFetching,
  } = useGetProductsQuery({
    page,
    limit,
    ...filters,
  });
  const [deleteProduct] = useDeleteProductMutation();

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
    setPage(1);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const getCurrentPrice = (productRates: any[]) => {
    if (!productRates || productRates.length === 0) return "N/A";
    // Assuming the first rate is the current one (you might need to adjust this logic)
    return `$${productRates[0].rate}`;
  };

  return (
    <RootContainer>
      <HeaderContainer>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="700"
          color="#1e293b"
        >
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/products/add")}
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#4338ca" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add New Product
        </Button>
      </HeaderContainer>

      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <SearchContainer>
          <TextField
            fullWidth
            label="Search products..."
            placeholder="Search by name, description..."
            variant="outlined"
            size="medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={isFetching}
          >
            Search
          </Button>
        </SearchContainer>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products?.map((product: any) => (
                    <StyledTableRow key={product.id} hover>
                      <TableCell>
                        <Typography fontWeight="500">{product.name}</Typography>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.Category?.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {product.description?.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description}
                      </TableCell>
                      <TableCell>
                        {getCurrentPrice(product.ProductRates)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.currentStock}
                          size="small"
                          color={product.currentStock > 0 ? "success" : "error"}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            onClick={() =>
                              navigate(`/products/edit/${product.id}`)
                            }
                            color="primary"
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(product.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={products?.total || 0}
              page={page - 1}
              onPageChange={handleChangePage}
              rowsPerPage={limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Paper>
    </RootContainer>
  );
};

export default ProductList;
