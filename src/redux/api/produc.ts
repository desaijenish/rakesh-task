import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../../utils/rtkHelper";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    // Get All Products with filters
    getProducts: builder.query({
      query: (params = {}) => {
        const {
          category,
          minPrice,
          maxPrice,
          search,
          sortBy,
          sortOrder = "asc",
          limit = 10,
          page = 1,
        } = params;

        const queryParams = new URLSearchParams();

        if (category) queryParams.append("category", category);
        if (minPrice) queryParams.append("minPrice", minPrice.toString());
        if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());
        if (search) queryParams.append("search", search);
        if (sortBy) queryParams.append("sortBy", sortBy);
        queryParams.append("sortOrder", sortOrder);
        queryParams.append("limit", limit.toString());
        queryParams.append("page", page.toString());

        return `/products?${queryParams.toString()}`;
      },
      providesTags: ["Product"],
    }),

    // Get Product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Update Product
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),

    // Delete Product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
