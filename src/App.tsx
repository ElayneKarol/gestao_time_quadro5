import { useState } from 'react';
import { mockMembers, mockTasks } from './mockData';
import type { Member, Task, TaskStatus, TaskPriority } from './types';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [members] = useState<Member[]>(mockMembers);
  
  // Estados para o controle de abertura do Modal de criação
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para os campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsibleId, setResponsibleId] = useState(mockMembers[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  // Função para mover a tarefa de coluna
  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Função para submeter o formulário de nova tarefa (Atende a Dor 1 e Exigência 1)
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !responsibleId || !dueDate) {
      alert('Por favor, preencha o título, responsável e o prazo!');
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`, // Gerador de ID único temporário
      title: title.trim(),
      description: description.trim(),
      status: 'todo', // Toda nova tarefa começa na coluna "A Fazer"
      priority,
      responsibleId,
      dueDate,
      createdAt: new Date().toISOString().split('T')[0] // Data de hoje no formato YYYY-MM-DD
    };

    // Adiciona a nova tarefa no início da lista
    setTasks(prev => [newTask, ...prev]);

    // Limpa o formulário e fecha o modal
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsModalOpen(false);
  };

  const columns: { id: TaskStatus; title: string; bgColor: string }[] = [
    { id: 'todo', title: '📋 A Fazer', bgColor: 'bg-gray-100/80' },
    { id: 'doing', title: '⚡ Em Andamento', bgColor: 'bg-blue-50/60' },
    { id: 'done', title: '✅ Concluído', bgColor: 'bg-green-50/60' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* HEADER DA PLATAFORMA */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quatro5 · Gestão de Times</h1>
            <p className="text-xs text-slate-500 mt-0.5">Painel de Controle do Ricardo</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              10 Colaboradores Ativos
            </div>
            
            {/* Botão de Nova Tarefa */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>➕</span> Nova Atividade
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ESPAÇO PARA OS INDICADORES (FOCO DO DIA 2) */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 shadow-xs">
          💡 **Espaço do Dashboard:** Amanhã vamos renderizar os KPIs inteligentes do Ricardo aqui em cima!
        </div>

        {/* QUADRO KANBAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div key={column.id} className={`rounded-2xl p-4 border border-slate-200/80 shadow-xs ${column.bgColor}`}>
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="font-bold text-slate-700 text-xs tracking-wider uppercase">
                  {column.title}
                </h2>
                <span className="bg-white px-2.5 py-0.5 text-xs font-bold rounded-full border border-slate-200 text-slate-600 shadow-2xs">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>

              {/* LISTA DE CARDS DA COLUNA */}
              <div className="space-y-3 min-h-[500px]">
                {tasks.filter(t => t.status === column.id).map(task => {
                  const responsible = members.find(m => m.id === task.responsibleId);
                  
                  // Lógica visual para tarefas atrasadas (Alerta de Prazo - Cura a Dor 3)
                  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < new Date('2026-06-13');

                  return (
                    <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs hover:shadow-md transition-all">
                      <div className="flex justify-between items-start gap-2 mb-2.5">
                        <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md ${
                          task.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-100' : 
                          task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                          'bg-slate-50 text-slate-600 border border-slate-100'
                        }`}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                        
                        {isOverdue && (
                          <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-md shadow-xs animate-pulse">
                            Atrasado!
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{task.description}</p>
                      )}
                      
                      <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[11px]">
                        <div className="flex flex-col">
                          <span className="text-slate-400">Responsável</span>
                          <span className="font-semibold text-slate-700 mt-0.5">{responsible?.name || 'Sem dono'}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-slate-400">Prazo</span>
                          <span className={`font-mono font-semibold mt-0.5 ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                            {task.dueDate.split('-').reverse().join('/')}
                          </span>
                        </div>
                      </div>

                      {/* CONTROLES RÁPIDOS DO KANBAN */}
                      <div className="mt-4 pt-2 border-t border-dashed border-slate-100 flex gap-1.5 justify-end">
                        {task.status !== 'todo' && (
                          <button 
                            onClick={() => moveTask(task.id, 'todo')}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md hover:bg-slate-200 transition-colors"
                          >
                            ⬅️ Voltar
                          </button>
                        )}
                        {task.status !== 'doing' && (
                          <button 
                            onClick={() => moveTask(task.id, 'doing')}
                            className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            ⚡ Iniciar
                          </button>
                        )}
                        {task.status !== 'done' && (
                          <button 
                            onClick={() => moveTask(task.id, 'done')}
                            className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-md hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            Pronto ✔️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {tasks.filter(t => t.status === column.id).length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-white/50">
                    Nenhuma atividade em andamento.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE CADASTRO DE TAREFA (Exigência 1 do Case) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">Nova Atividade para o Time</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Título da Atividade *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Desenvolver nova API de frete"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Descrição (Opcional)</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detalhes sobre as entregas necessárias..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Responsável *</label>
                  <select 
                    value={responsibleId}
                    onChange={e => setResponsibleId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Prioridade</label>
                  <select 
                    value={priority}
                    onChange={e => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Prazo de Entrega *</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 text-sm font-medium">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  Criar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}