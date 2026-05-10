import { useMutation } from "@tanstack/react-query";
import { toast } from "@workspace/ui/components/toast";

import { ApiError } from "../../../lib/api";
import { changePassword } from "../lib/account.api";

export const useChangePassword = () =>
  useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Unable to update password";
      toast.error({ description: message, title: "Password update failed" });
    },
    onSuccess: () => {
      toast.success({
        description: "Use your new password the next time you sign in.",
        title: "Password updated",
      });
    },
  });
