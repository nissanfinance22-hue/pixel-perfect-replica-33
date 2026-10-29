import p1 from '@/assets/01_GIBI.png.asset.json';
import p2 from '@/assets/02_GIBI.png.asset.json';
import p3 from '@/assets/03_gibi.png.asset.json';
import p4 from '@/assets/04_gibi.png.asset.json';
import { z } from 'zod';
export const comicSchema = z.object({ title: z.string().trim().min(3).max(160), description: z.string().trim().min(10).max(2500), pages: z.array(z.object({ src: z.string().refine(s => s.startsWith('/__l5e/assets-v1/') || /^https:\/\//.test(s), 'Use uma imagem HTTPS.'), alt: z.string().min(1).max(200) })).min(1).max(40) });
export type Comic = z.infer<typeof comicSchema>;
export const defaultComic: Comic = { title: 'Concessão Judicial de Seguro de Vida', description: 'Uma narrativa jurídica que acompanha a negativa de um seguro de vida, a atuação dos advogados, o processo judicial e a conquista do direito da beneficiária — contada em quadrinhos, com linguagem simples e envolvente.', pages: [p1,p2,p3,p4].map((p,i)=>({src:p.url,alt:`Página ${i+1} do gibi`})) };
export function assertAdmin(isAdmin: unknown) { if (isAdmin !== true) throw new Error('Acesso reservado ao administrador.'); }
export function assertSameUser(actual: string | undefined, expected: string) { if (actual !== expected) throw new Error('Confirmação de senha inválida.'); }
