import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProductTypeList from "@/components/ProductType/ProductTypeList";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Product type",
  description:
    "Product type",
};


export default function User() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Tipo produto"></Breadcrumb>
            <ProductTypeList></ProductTypeList>
        </DefaultLayout>
    )
}