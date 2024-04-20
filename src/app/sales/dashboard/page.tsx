import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserList from "@/components/User/UserList";

export const metadata: Metadata = {
  title: "Sale dash",
  description:
    "Sale dash",
};


export default function User() {
    return (
        <DefaultLayout>
            <div></div>
        </DefaultLayout>
    )
}