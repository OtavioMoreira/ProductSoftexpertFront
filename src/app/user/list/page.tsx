import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserList from "@/components/User/UserList";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title: "User",
  description:
    "User",
};


export default function User() {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Lista"></Breadcrumb>
            <UserList></UserList>
        </DefaultLayout>
    )
}