import { useRouter } from "next/router";
import { userService } from "../../../services";

export default function Admin() {
  const router = useRouter();

  if (router.isReady) {
    if (userService?.userValue) {
      if (userService?.userValue?.role === "Copywriter") {
        router.push('/admin/article')
      } else {
        router.push('/admin/article')
      }
    }
  }
}