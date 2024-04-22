import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductList from "@/components/Product/ProductList";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Product",
};


export default function User() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista"></Breadcrumb>
            <ProductList></ProductList>
        </DefaultLayout>
    )
}