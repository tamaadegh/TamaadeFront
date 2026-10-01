import { redirect } from "next/navigation";

/** Visual search is not implemented — send old links to the product search instead. */
export default function VisualSearchPage() {
  redirect("/products");
}
