-- ═════════════════════════════════════════════════════════════════════════
-- Robcar Veículos — catálogo de veículos (V1)
-- Tabelas, RLS e Storage. Execute no SQL Editor do Supabase ou via CLI
-- (`supabase db push`).
--
-- Modelo de permissão:
--   • Visitantes (anon) leem apenas veículos publicados.
--   • Somente usuários listados em public.admin_users podem escrever.
--   • Nenhuma chave privilegiada (service_role) é usada no frontend.
-- ═════════════════════════════════════════════════════════════════════════

-- ─── Administradores ─────────────────────────────────────────────────────
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- Sem políticas: a tabela não é acessível via API. Gerencie pelo SQL Editor.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ─── Veículos ────────────────────────────────────────────────────────────
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  brand text not null check (length(brand) between 1 and 60),
  model text not null check (length(model) between 1 and 80),
  version text not null default '' check (length(version) <= 120),
  year_manufacture smallint not null check (year_manufacture between 1950 and 2100),
  year_model smallint not null check (year_model between 1950 and 2100),
  mileage integer not null default 0 check (mileage >= 0),
  transmission text not null check (transmission in ('manual', 'automatico', 'cvt', 'automatizado')),
  fuel text not null check (fuel in ('flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico')),
  color text not null default '',
  body_type text not null default 'outro' check (body_type in ('hatch', 'sedan', 'suv', 'picape', 'outro')),
  price numeric(12, 2) check (price is null or price >= 0), -- null = sob consulta
  description text not null default '',
  options text[] not null default '{}',
  images jsonb not null default '[]'::jsonb check (jsonb_typeof(images) = 'array'), -- [{ url, alt }]
  status text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'vendido')),
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vehicles_published_idx on public.vehicles (published, status, created_at desc);
create index if not exists vehicles_featured_idx on public.vehicles (featured) where featured;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vehicles_touch_updated_at on public.vehicles;
create trigger vehicles_touch_updated_at
  before update on public.vehicles
  for each row execute function public.touch_updated_at();

alter table public.vehicles enable row level security;

drop policy if exists "Leitura pública de veículos publicados" on public.vehicles;
create policy "Leitura pública de veículos publicados"
  on public.vehicles for select
  to anon, authenticated
  using (published = true or public.is_admin());

drop policy if exists "Administradores inserem veículos" on public.vehicles;
create policy "Administradores inserem veículos"
  on public.vehicles for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Administradores alteram veículos" on public.vehicles;
create policy "Administradores alteram veículos"
  on public.vehicles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Administradores excluem veículos" on public.vehicles;
create policy "Administradores excluem veículos"
  on public.vehicles for delete
  to authenticated
  using (public.is_admin());

-- ─── Storage: fotos dos veículos ─────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-images', 'vehicle-images', true, 12582912, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- A leitura pública é feita pela URL pública do bucket. A política de select abaixo
-- é exigida pela API do Storage para que administradores consigam remover arquivos.
drop policy if exists "Administradores consultam fotos" on storage.objects;
create policy "Administradores consultam fotos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'vehicle-images' and public.is_admin());

drop policy if exists "Administradores enviam fotos" on storage.objects;
create policy "Administradores enviam fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehicle-images' and public.is_admin());

drop policy if exists "Administradores alteram fotos" on storage.objects;
create policy "Administradores alteram fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehicle-images' and public.is_admin());

drop policy if exists "Administradores removem fotos" on storage.objects;
create policy "Administradores removem fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehicle-images' and public.is_admin());

-- ─── Primeiro administrador ──────────────────────────────────────────────
-- 1. Crie o usuário em Authentication > Users (e-mail + senha).
-- 2. Desative o cadastro público em Authentication > Providers > Email ("Allow new users to sign up").
-- 3. Execute, trocando o e-mail:
--    insert into public.admin_users (user_id)
--    select id from auth.users where email = 'admin@exemplo.com.br';
