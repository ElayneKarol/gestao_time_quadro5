import type { Member, Task } from './types';

export const mockMembers: Member[] = [
  { id: '1', name: 'Ricardo', role: 'Dono/Gestor' },
  { id: '2', name: 'Ana Souza', role: 'Desenvolvedora' },
  { id: '3', name: 'Bruno Lima', role: 'Desenvolvedor' },
  { id: '4', name: 'Carlos Edu', role: 'Designer UI/UX' },
  { id: '5', name: 'Daniela M.', role: 'Suporte Técnico' },
  { id: '6', name: 'Eduardo G.', role: 'Marketing' },
  { id: '7', name: 'Fernanda R.', role: 'Vendas' },
  { id: '8', name: 'Gabriel S.', role: 'Desenvolvedor' },
  { id: '9', name: 'Helena P.', role: 'Product Owner' },
  { id: '10', name: 'Igor Santos', role: 'QA / Testes' }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Ajustar layout do e-commerce',
    description: 'Corrigir bug nos botões que quebram no mobile.',
    status: 'doing',
    priority: 'high',
    responsibleId: '4',
    dueDate: '2026-06-15',
    createdAt: '2026-06-10'
  },
  {
    id: 't2',
    title: 'Subir banco de dados para produção',
    description: 'Migração crítica das tabelas de clientes.',
    status: 'todo',
    priority: 'high',
    responsibleId: '2',
    dueDate: '2026-06-12', // Essa vai aparecer como atrasada!
    createdAt: '2026-06-08'
  },
  {
    id: 't3',
    title: 'Responder e-mails de suporte atrasados',
    description: 'Focar nos chamados abertos há mais de 48h.',
    status: 'doing',
    priority: 'medium',
    responsibleId: '5',
    dueDate: '2026-06-14',
    createdAt: '2026-06-12'
  },
  {
    id: 't4',
    title: 'Criar campanha de anúncios para o São João',
    description: 'Desenvolver criativos e copy para o Instagram.',
    status: 'done',
    priority: 'medium',
    responsibleId: '6',
    dueDate: '2026-06-11',
    createdAt: '2026-06-05'
  }
];