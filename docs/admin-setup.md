# KD Enterprises admin setup

The website is a static frontend. Supabase provides the authenticated user
backend and the `admin_members` access list. The PDF-to-DXF conversion runs in
the browser, so uploaded drawings are not sent to the website or Supabase.

## Activate admin access

1. In the Supabase project `prdemfcyvsqjozfrkteo`, run
   `supabase/migrations/20261110_admin_members.sql` in the SQL Editor.
2. Create or invite the intended admin account under Authentication → Users.
   Do not share or commit that account's password.
3. Copy the new user's UUID and run this in the SQL Editor:

   ```sql
   insert into public.admin_members (user_id, role)
   values ('<auth-user-uuid>', 'admin')
   on conflict (user_id) do update set role = excluded.role;
   ```

4. Put the project's **publishable/anon key** in
   `src/supabase-config.js`, and set `ADMIN_LOGIN_EMAIL` to the account's
   email address so the `kdenterprises` username resolves to that account.
   This is a browser key, not a service-role key.
   Never put a service-role key in this repository.
5. Run `npm install && npm run build`, deploy the resulting `public/` folder,
   and test sign-in with an admin and a non-admin account.

The current product catalogue PDF is a static website asset. It is linked from
the admin dashboard but its URL is not confidential. Move it to a private
Supabase Storage bucket and serve signed URLs if the catalogue must be private.

## Drawing tool scope

The converter reads vector paths from one PDF page at a time. The removal
options use PDF color, path size and page-region heuristics; outlined text or
dimensions may still require manual cleanup. The brush and box tools remove
whole vector paths. Calibrate a known length before export, then verify the
DXF's scale, closed contours and holes in CAD before manufacturing. Scanned
or raster-only drawings are rejected rather than silently traced inaccurately.

The catalogue PDF can be regenerated with `scripts/generate_catalogue.py`
using a Python installation with ReportLab. It reflects the product and size
information currently present in `src/app.jsx`; unknown sizes are not invented.
