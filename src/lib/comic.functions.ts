import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { comicSchema, defaultComic, assertAdmin, assertSameUser } from './pcj';
import { z } from 'zod';
export const readComic = createServerFn({method:'GET'}).handler(async()=>{
 const key=process.env['SUPABASE_PUBLISHABLE_KEY']; const url=process.env['SUPABASE_URL'];
 if(!key || !url) throw new Error('Conexão indisponível.');
 const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{ const headers=new Headers(init?.headers); if(key.startsWith('sb_') && headers.get('Authorization')===`Bearer ${key}`) headers.delete('Authorization'); headers.set('apikey',key); return fetch(input,{...init,headers}); }}});
 const {data,error}=await client.from('comic_settings').select('title,description,pages').eq('id',1).maybeSingle();
 if(error) throw new Error('Não foi possível carregar o gibi.');
 return data ? comicSchema.parse(data) : defaultComic;
});
export const adminAccess = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 const {data,error}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'}); assertAdmin(!error && data); return true;
});
export const confirmPassword = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({password:z.string().min(1).max(200)})).handler(async({data,context})=>{
 const {data:role,error}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'}); assertAdmin(!error && role);
 const {data:identity}=await context.supabase.auth.getUser();
 if(!identity.user?.email) throw new Error('Entre novamente.');
 const url=process.env['SUPABASE_URL']; const key=process.env['SUPABASE_PUBLISHABLE_KEY']; if(!url || !key) throw new Error('Conexão indisponível.');
 const result=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:identity.user.email,password:data.password})});
 if(!result.ok) throw new Error('Senha incorreta ou muitas tentativas. Aguarde e tente novamente.');
 const verified=await result.json() as {user?:{id?:string}}; assertSameUser(verified.user?.id,context.userId); return true;
});
export const saveComic = createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({comic:comicSchema,password:z.string().min(1).max(200)})).handler(async({data,context})=>{
 const {data:role,error}=await context.supabase.rpc('has_role',{_user_id:context.userId,_role:'admin'}); assertAdmin(!error && role);
 const {data:identity}=await context.supabase.auth.getUser(); if(!identity.user?.email) throw new Error('Entre novamente.');
 const url=process.env['SUPABASE_URL']; const key=process.env['SUPABASE_PUBLISHABLE_KEY']; if(!url || !key) throw new Error('Conexão indisponível.');
 const response=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:identity.user.email,password:data.password})});
 if(!response.ok) throw new Error('Senha incorreta ou muitas tentativas.');
 const verified=await response.json() as {user?:{id?:string}}; assertSameUser(verified.user?.id,context.userId);
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
 const {error:writeError}=await supabaseAdmin.from('comic_settings').upsert({id:1,...data.comic,updated_at:new Date().toISOString()});
 if(writeError) throw new Error('Não foi possível salvar.'); return true;
});
