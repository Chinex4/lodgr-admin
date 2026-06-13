import toast from "react-hot-toast";
import { errorMessage } from "../lib/api";

export async function mutate(promise, success, reload) {
  await toast.promise(promise, {
    loading: "Working...",
    success,
    error: (error) => errorMessage(error),
  });
  reload?.();
}
