import { redirect } from "next/navigation";
import { experience } from "@/lib/content";

export default function Work() {
  redirect(`/work/${experience[0].slug}`);
}
