import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SaleList from "@/components/Sales/SaleList";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "Sale List",
  description:
    "Sale List",
};


export default function User() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista"></Breadcrumb>

            <SaleList></SaleList>
        </DefaultLayout>
    )
}