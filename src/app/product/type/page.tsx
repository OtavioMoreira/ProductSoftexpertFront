import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductTypeList from "@/components/ProductType/ProductTypeList";

export const metadata: Metadata = {
  title: "Product type",
  description:
    "Product type",
};


export default function User() {
    return (
        <DefaultLayout>
            <ProductTypeList></ProductTypeList>
        </DefaultLayout>
    )
}