import { supabase } from "./src/supabase-client";

async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user.id);

  return user.id;
}

export default getUser;
