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

  // DATA DO CONTEXTO DO CASE: 13 de Junho de 2026
  const TODAY_STR = '2026-06-13';
  const today = new Date(TODAY_STR);

  // Lógica para mover a tarefa de coluna
  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Lógica para submeter o formulário de nova tarefa
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !responsibleId || !dueDate) {
      alert('Por favor, preencha o título, responsável e o prazo!');
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      priority,
      responsibleId,
      dueDate,
      createdAt: TODAY_STR
    };

    setTasks(prev => [newTask, ...prev]);

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsModalOpen(false);
  };

  // CÁLCULOS DINÂMICOS DOS KPIS GERAIS (Atende às dores de controle do Ricardo)
  const totalPending = tasks.filter(t => t.status !== 'done').length;
  const totalDone = tasks.filter(t => t.status === 'done').length;
  const totalOverdue = tasks.filter(t => t.status !== 'done' && new Date(t.dueDate) < today).length;

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
        
        {/* BLOCO SUPERIOR: METRICAS GERAIS DE ALERTA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demandas Ativas</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{totalPending}</h3>
            </div>
            <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold">📂</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Atrasos Críticos</p>
              <h3 className="text-2xl font-black text-red-600 mt-1">{totalOverdue}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${totalOverdue > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>⚠️</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Entregas Concluídas</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{totalDone}</h3>
            </div>
            <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center font-bold">🏆</div>
          </div>
        </div>

        {/* SEÇÃO DO DASHBOARD: CARGA DE TRABALHO POR INTEGRANTE */}
        <section className="mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">📊 Carga de Trabalho do Time</h2>
            <p className="text-xs text-slate-500">Total de tarefas pendentes (A Fazer + Em Andamento) alocadas por colaborador.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {members.map(member => {
              const pendingTasksCount = tasks.filter(
                task => task.responsibleId === member.id && task.status !== 'done'
              ).length;

              const isOverloaded = pendingTasksCount > 1;

              return (
                <div 
                  key={member.id} 
                  className={`p-3 rounded-xl border transition-all ${
                    isOverloaded 
                      ? 'bg-amber-50/60 border-amber-200' 
                      : pendingTasksCount === 0 
                        ? 'bg-slate-50/50 border-slate-150 opacity-60' 
                        : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-semibold text-xs text-slate-900 truncate block max-w-[80%]">
                      {member.name}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isOverloaded 
                        ? 'bg-amber-200 text-amber-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {pendingTasksCount}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{member.role}</p>
                  
                  {isOverloaded && (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded-sm mt-2 inline-block">
                      ⚠️ Carga Limite
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

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
                  const isOverdue = task.status !== 'done' && new Date(task.dueDate) < today;

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
                    Nenhuma atividade aqui.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE CADASTRO DE TAREFA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">Nova Atividade para o Time</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1">✕</button>
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
                  placeholder="Detalhes sobre as entregas..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Responsável *</label>
                  <select 
                    value={responsibleId}
                    onChange={e => setResponsibleId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  >
                    {members.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Prioridade</label>
                  <select 
                    value={priority}
                    onChange={e => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 text-sm font-medium">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm">Criar Atividade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}