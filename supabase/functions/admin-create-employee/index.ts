import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing authorization" }, 401);
    }

    // Verify caller is an admin
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ error: "Invalid session" }, 401);
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return json({ error: "Admin access required" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action ?? "create";

    if (action === "list") {
      // List all employees and admins
      const { data: roles, error: rErr } = await admin
        .from("user_roles")
        .select("user_id, role");
      if (rErr) throw rErr;

      const userIds = [...new Set((roles ?? []).map((r) => r.user_id))];
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
      const enriched = await Promise.all(
        userIds.map(async (id) => {
          const { data } = await admin.auth.admin.getUserById(id);
          const profile = (profiles ?? []).find((p) => p.id === id);
          return {
            id,
            email: data.user?.email ?? profile?.email ?? "",
            full_name: profile?.full_name ?? "",
            created_at: data.user?.created_at ?? "",
            roles: (roles ?? []).filter((r) => r.user_id === id).map((r) => r.role),
          };
        })
      );
      return json({ users: enriched });
    }

    if (action === "delete") {
      const targetId = String(body.userId ?? "");
      if (!targetId) return json({ error: "Missing userId" }, 400);
      if (targetId === userData.user.id) {
        return json({ error: "Cannot delete yourself" }, 400);
      }
      const { error: delErr } = await admin.auth.admin.deleteUser(targetId);
      if (delErr) throw delErr;
      return json({ success: true });
    }

    // Default: create
    const username = String(body.username ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const fullName = String(body.fullName ?? "").trim();
    const role = body.role === "admin" ? "admin" : "employee";

    if (!/^[a-z0-9._-]{2,40}$/.test(username)) {
      return json({ error: "Username must be 2-40 chars: letters, numbers, . _ -" }, 400);
    }
    if (password.length < 8) {
      return json({ error: "Password must be at least 8 characters" }, 400);
    }

    const email = `${username}@blackandbrown.demo`;

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName || username },
    });

    if (createErr || !created.user) {
      return json({ error: createErr?.message ?? "Failed to create user" }, 400);
    }

    const { error: roleErr } = await admin
      .from("user_roles")
      .insert({ user_id: created.user.id, role });

    if (roleErr) {
      // Roll back user
      await admin.auth.admin.deleteUser(created.user.id);
      return json({ error: roleErr.message }, 400);
    }

    return json({
      success: true,
      user: { id: created.user.id, email, username, role },
    });
  } catch (e: any) {
    return json({ error: e?.message ?? "Server error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
