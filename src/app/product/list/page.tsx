import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductList from "@/components/Product/ProductList";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Product",
};


export default function User() {
    return (
        <DefaultLayout>
            <ProductList></ProductList>
        </DefaultLayout>
    )
}