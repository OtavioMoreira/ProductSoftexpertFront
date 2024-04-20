import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserList from "@/components/User/UserList";

export const metadata: Metadata = {
  title: "User",
  description:
    "User",
};


export default function User() {
    return (
        <DefaultLayout>
            <UserList></UserList>
        </DefaultLayout>
    )
}