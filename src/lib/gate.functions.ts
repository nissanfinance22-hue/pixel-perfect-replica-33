import { createServerFn } from '@tanstack/react-start';
import { useSession } from '@tanstack/react-start/server';
import { redirect } from '@tanstack/react-router';
import { createHash, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { defaultComic } from './pcj';

type AdminSession = { unlocked?: boolean };
const config = () => ({
  password: process.env['SESSION_SECRET']!,
  name: 'pcj-admin',
  maxAge: 60 * 60 * 8,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/' },
});
function matches(input: string, expected: string) {
  const a = createHash('sha256').update(input, 'utf8').digest();
  const b = createHash('sha256').update(expected, 'utf8').digest();
  return timingSafeEqual(a, b);
}

export const unlockAdmin = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ pin: z.string().regex(/^\d{1,32}$/) }))
  .handler(async ({ data }) => {
    const expected = process.env['ADMIN_PIN'];
    if (!expected) throw new Error('Código não configurado.');
    if (!matches(data.pin, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(config());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const getAdminData = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useSession<AdminSession>(config());
  if (!session.data.unlocked) throw redirect({ to: '/auth' });
  return defaultComic;
});

export const lockAdmin = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useSession<AdminSession>(config());
  await session.clear();
  return { ok: true as const };
});
