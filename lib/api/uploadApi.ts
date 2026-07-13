import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UploadedImage } from "@/domain/media/media.types";

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadedImage, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return { url: "/upload", method: "POST", body: formData };
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
