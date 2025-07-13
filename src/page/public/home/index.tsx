// src/pages/public/home.tsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Container,
  Paper,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import {
  ShoppingCart,
  Category,
  LibraryBooks,
  People,
  BarChart,
  Settings,
  LocalShipping,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

const StyledHero = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(8, 0),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(4),
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <ShoppingCart fontSize="large" color="primary" />,
      title: "Product Management",
      description:
        "Manage your products, inventory, and pricing all in one place.",
      path: "/products",
    },
    {
      icon: <LocalShipping fontSize="large" color="primary" />,
      title: "Order Processing",
      description: "Track and fulfill customer orders efficiently.",
      path: "/orders",
    },
  ];

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <StyledHero>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            Welcome to Admin Dashboard
          </Typography>
          <Typography variant="h5" component="p" align="center" paragraph>
            Manage your e-commerce platform with powerful tools and analytics
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} mt={4}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/products/add")}
            >
              Add New Product
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate("/orders")}
            >
              View Orders
            </Button>
          </Box>
        </Container>
      </StyledHero>

      {/* Quick Stats */}

      {/* Features Grid */}
      <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
        Dashboard Features
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard elevation={3}>
              <CardActionArea
                onClick={() => navigate(feature.path)}
                sx={{ p: 3, flexGrow: 1 }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  textAlign="center"
                >
                  <Box mb={2}>{feature.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    fontWeight="bold"
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </CardActionArea>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity and Overview */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: theme.shape.borderRadius }}
          >
            <Typography
              variant="h5"
              component="h3"
              gutterBottom
              fontWeight="bold"
            >
              Quick Links
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={<ShoppingCart />}
                onClick={() => navigate("/products")}
                fullWidth
              >
                Product List
              </Button>
              <Button
                variant="outlined"
                startIcon={<LocalShipping />}
                onClick={() => navigate("/orders")}
                fullWidth
              >
                Order Management
              </Button>
              <Button
                variant="outlined"
                startIcon={<Category />}
                onClick={() => navigate("/category")}
                fullWidth
              >
                Categories
              </Button>
              <Button
                variant="outlined"
                startIcon={<LibraryBooks />}
                onClick={() => navigate("/blog")}
                fullWidth
              >
                Blog Posts
              </Button>
              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={() => navigate("/settings")}
                fullWidth
              >
                Settings
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
