import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SaleList from "@/components/Sales/SaleList";

export const metadata: Metadata = {
  title: "Sale List",
  description:
    "Sale List",
};


export default function User() {
    return (
        <DefaultLayout>
            <SaleList></SaleList>
        </DefaultLayout>
    )
}