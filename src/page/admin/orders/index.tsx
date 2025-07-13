// src/pages/orders/OrderList.tsx
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
  Typography,
  Chip,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

import styled from "@emotion/styled";
import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
} from "../../../redux/api/order";
import { formatCurrency, formatDate } from "../../../utils/formatDate";

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

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isFetching } = useGetOrdersQuery({ page, limit });
  const [deleteOrder] = useDeleteOrderMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id as any).unwrap();
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const getItemCount = (order: any) => {
    return order.OrderItems.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
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
          Order Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/orders/add")}
          sx={{
            backgroundColor: "#4f46e5",
            "&:hover": { backgroundColor: "#4338ca" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Create New Order
        </Button>
      </HeaderContainer>

      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
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
                    <TableCell>Order No</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.orders.map((order: any) => (
                    <TableRow key={order.id} hover>
                      <TableCell>
                        <Typography fontWeight="500">
                          {order.orderNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32 }}>
                            {order.User.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography>{order.User.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.User.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography>{getItemCount(order)} items</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {order.OrderItems[0]?.Product.name}
                            {order.OrderItems.length > 1 &&
                              ` +${order.OrderItems.length - 1} more`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{formatCurrency(order.grandTotal)}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <Tooltip title={order.address}>
                          <Typography
                            sx={{
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.address}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            onClick={() => navigate(`/orders/${order.id}`)}
                            color="primary"
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => navigate(`/orders/edit/${order.id}`)}
                            color="info"
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(order.id)}
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

            <TablePagination
              component="div"
              count={data?.total || 0}
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

export default OrderList;
