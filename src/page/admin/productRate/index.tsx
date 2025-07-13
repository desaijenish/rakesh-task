// src/pages/products/rates/ProductRateList.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  TableRow,
  Typography,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import styled from "@emotion/styled";
import { formatCurrency, formatDate } from "../../../utils/formatDate";
import {
  useDeleteProductRateMutation,
  useGetProductRatesQuery,
} from "../../../redux/api/productRate";

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

const ProductRateList: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [activeOnly, setActiveOnly] = useState(true);

  const { data, isLoading, isFetching } = useGetProductRatesQuery({
    productId: productId!,
    activeOnly,
  });
  const [deleteRate] = useDeleteProductRateMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteRate(id).unwrap();
    } catch (error) {
      console.error("Failed to delete product rate:", error);
    }
  };

  const isRateActive = (rate: { startDate: string; endDate: string }) => {
    const today = new Date();
    const startDate = new Date(rate.startDate);
    const endDate = new Date(rate.endDate);
    return today >= startDate && today <= endDate;
  };

  return (
    <RootContainer>
      <HeaderContainer>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="700"
            color="#1e293b"
          >
            {data?.product.name} Rates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            SKU: {data?.product.sku}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(`/products/${productId}/rates/add`)}
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#4338ca" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Add New Rate
        </Button>
      </HeaderContainer>

      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={activeOnly}
              onChange={() => setActiveOnly(!activeOnly)}
              color="primary"
            />
          }
          label="Show only active rates"
          sx={{ mb: 2 }}
        />

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rate</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.rates.map((rate) => (
                  <TableRow key={rate.id} hover>
                    <TableCell>{formatCurrency(rate.rate)}</TableCell>
                    <TableCell>
                      {formatDate(rate.startDate)} - {formatDate(rate.endDate)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isRateActive(rate) ? "Active" : "Inactive"}
                        color={isRateActive(rate) ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          onClick={() =>
                            navigate(
                              `/products/${productId}/rates/edit/${rate.id}`
                            )
                          }
                          color="primary"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(rate.id!)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </RootContainer>
  );
};

export default ProductRateList;
