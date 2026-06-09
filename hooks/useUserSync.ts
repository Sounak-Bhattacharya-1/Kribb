import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect } from "react";
import { useSupabase } from "./useSupabase";

export const useUserSync = () => {
  const { user } = useUser();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);
  const authSupabase = useSupabase();

  useEffect(() => {
    if (!user) return;
    syncUser();
  }, [user]);

  const syncUser = async () => {
    if (!user) return; // guard: avoid user! dereference

    try {
      const { data, error: selectError } = await authSupabase
        .from("users")
        .select("clerk_id, is_admin")
        .eq("clerk_id", user.id)
        .single();

      if (selectError && selectError.code !== "PGRST116") {
        // PGRST116 = "no rows found" — not a real error here
        throw selectError;
      }

      if (data) {
        setIsAdmin(data.is_admin ?? false);
        return;
      }

      const { data: newUser, error: insertError } = await authSupabase
        .from("users")
        .insert({
          clerk_id: user.id,
          email: user.emailAddresses[0].emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
          avatar_url: user.imageUrl,
        })
        .select("is_admin")
        .single();

      if (insertError) throw insertError;

      setIsAdmin(newUser?.is_admin ?? false);
    } catch (err) {
      console.error("[useUserSync] syncUser failed:", err);
      setIsAdmin(false); // safe default
    }
  };
};
