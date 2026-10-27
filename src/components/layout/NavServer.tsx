import getProfile from "@/helpers/next-fetch/core/getProfile";
import { Navbar } from "./navbar";

export async function NavServer() {
  const user = await getProfile();
  return <Navbar user={user} />;
}
