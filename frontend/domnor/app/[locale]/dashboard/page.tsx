"use client";
import { useQuery } from "@tanstack/react-query";

import { getJSON } from "@/https/https";

import { toast } from "react-toastify";

export default function Dashboard() {
  const { isPending, error, data } = useQuery({
    queryKey: ["placeHolder"],
    queryFn: () => getJSON("/me"),
  });

  if (error) {
    toast.error(error.message);
  }

  console.log(data);

  return <h1>hi</h1>;
}
