// src/redux/api/productRateApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../../utils/rtkHelper";
import {
  ProductRate,
  ProductRateListResponse,
} from "../../types/productRateTypes";

export const productRateApi = createApi({
  reducerPath: "productRateApi",
  baseQuery: customBaseQuery,
  tagTypes: ["ProductRate"],
  endpoints: (builder) => ({
    createProductRate: builder.mutation<
      ProductRate,
      { productId: string; data: Partial<ProductRate> }
    >({
      query: ({ productId, data }) => ({
        url: `/products/${productId}/rates`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProductRate"],
    }),

    getProductRates: builder.query<
      ProductRateListResponse,
      { productId: string; activeOnly?: boolean }
    >({
      query: ({ productId, activeOnly }) => ({
        url: `/products/${productId}/rates`,
        params: { activeOnly },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.rates.map(({ id }) => ({
                type: "ProductRate" as const,
                id,
              })),
              { type: "ProductRate", id: "LIST" },
            ]
          : [{ type: "ProductRate", id: "LIST" }],
    }),

    updateProductRate: builder.mutation<
      ProductRate,
      { id: string; data: Partial<ProductRate> }
    >({
      query: ({ id, data }) => ({
        url: `/products/rates/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "ProductRate", id }],
    }),

    deleteProductRate: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/rates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "ProductRate", id }],
    }),
  }),
});

export const {
  useCreateProductRateMutation,
  useGetProductRatesQuery,
  useUpdateProductRateMutation,
  useDeleteProductRateMutation,
} = productRateApi;
