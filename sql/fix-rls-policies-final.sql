-- Verificar políticas existentes para cursos
select * from pg_policies where schemaname = 'public' and tablename = 'courses';

-- Drop existing policies if they exist to avoid conflicts
drop policy if exists "courses_select_policy" on courses;
drop policy if exists "courses_insert_policy" on courses;
drop policy if exists "courses_update_policy" on courses;
drop policy if exists "courses_delete_policy" on courses;

-- Política para SELECT: permitir qualquer usuário ver cursos publicados
create policy "courses_select_policy" on courses
for select using (
  is_published = true OR
  auth.role() = 'authenticated'
);

-- Política para INSERT: permitir apenas usuários autenticados inserir
create policy "courses_insert_policy" on courses
for insert with check (
  auth.role() = 'authenticated'
);

-- Política para UPDATE: permitir apenas usuários autenticados atualizar
create policy "courses_update_policy" on courses
for update using (
  auth.role() = 'authenticated'
) with check (
  auth.role() = 'authenticated'
);

-- Política para DELETE: permitir apenas usuários autenticados deletar
create policy "courses_delete_policy" on courses
for delete using (
  auth.role() = 'authenticated'
);

-- Verificar se RLS está habilitado (deve retornar 't')
select relrowsecurity from pg_class where relname = 'courses' and relnamespace = 'public'::regnamespace;

-- Listar as políticas criadas
select * from pg_policies where schemaname = 'public' and tablename = 'courses';