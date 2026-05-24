import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  // Clerk server-side par check karega ki user logged in hai ya nahi
  const { userId } = await auth(); 

  // Agar session active hai, seedha Trade Terminal kholo
  if (userId) {
    redirect("/trade");
  } 
  // Agar session nahi hai (logout ho chuka hai), toh Sign-In page par bhejo
  else {
    redirect("/sign-in");
  }
}