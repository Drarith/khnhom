'use client'
import { useQuery } from "@tanstack/react-query";

import { getJSON } from "@/https/https";

export default function Dashboard() {
  const { isPending, error, data } = useQuery({
    queryKey: ["placeHolder"],
    queryFn: () => getJSON("/me"),
  });

  console.log(data)

  return <h1>hi</h1>;
}
