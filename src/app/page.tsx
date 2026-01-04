"use client";

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calendar, FileText, Target, Timer, BarChart3, 
  Users, User, Plus, Play, Pause, RotateCcw, Check, 
  Clock, TrendingUp, Award, Brain, Settings, Search,
  ChevronRight, Edit, Trash2, Star, Filter, Download,
  Upload, Link, MessageCircle, ThumbsUp, Send, Bell,
  Moon, Sun, Volume2, VolumeX, Home, CheckCircle2,
  Circle, AlertCircle, Calendar as CalendarIcon,
  ArrowRight, Zap, Activity, Focus, Menu, X
} from 'lucide-react';

// Tipos de dados
interface User {
  name: string;
  course: string;
  goals: string;
  avatar?: string;
}

interface Task {
  id: string;
  title: string;
  subject: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  description?: string;
}

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
  type: 'pomodoro' | 'free';
}

interface Material {
  id: string;
  title: string;
  type: 'note' | 'pdf' | 'link';
  subject: string;
  content?: string;
  url?: string;
  createdAt: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  category: string;
}

interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  subject: string;
  likes: number;
  replies: number;
  createdAt: string;
}

export default function StudyApp() {
  // Estados principais
  const [currentView, setCurrentView] = useState('onboarding');
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  
  // Estados do Pomodoro
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'break'>('work');
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Estados da UI
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('brainboost_user');
    const savedTasks = localStorage.getItem('brainboost_tasks');
    const savedSessions = localStorage.getItem('brainboost_sessions');
    const savedMaterials = localStorage.getItem('brainboost_materials');
    const savedGoals = localStorage.getItem('brainboost_goals');
    const savedPosts = localStorage.getItem('brainboost_posts');
    const savedPomodoroCount = localStorage.getItem('brainboost_pomodoro_count');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowOnboarding(false);
      setCurrentView('dashboard');
    }
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSessions) setStudySessions(JSON.parse(savedSessions));
    if (savedMaterials) setMaterials(JSON.parse(savedMaterials));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedPosts) setForumPosts(JSON.parse(savedPosts));
    if (savedPomodoroCount) setPomodoroCount(parseInt(savedPomodoroCount));
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    if (user) localStorage.setItem('brainboost_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('brainboost_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('brainboost_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  useEffect(() => {
    localStorage.setItem('brainboost_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('brainboost_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('brainboost_posts', JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem('brainboost_pomodoro_count', pomodoroCount.toString());
  }, [pomodoroCount]);

  // Timer do Pomodoro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsRunning(false);
      if (currentSession === 'work') {
        setPomodoroCount(count => count + 1);
        // Salvar sessão de estudo
        const newSession: StudySession = {
          id: Date.now().toString(),
          subject: 'Sessão Pomodoro',
          duration: 25,
          date: new Date().toISOString().split('T')[0],
          type: 'pomodoro'
        };
        setStudySessions(prev => [newSession, ...prev]);
        setPomodoroTime(5 * 60); // 5 min break
        setCurrentSession('break');
      } else {
        setPomodoroTime(25 * 60); // 25 min work
        setCurrentSession('work');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, currentSession]);

  // Componente de Onboarding
  const OnboardingView = () => {
    const [formData, setFormData] = useState({
      name: '',
      course: '',
      goals: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.name && formData.course && formData.goals) {
        setUser(formData);
        setCurrentView('dashboard');
        setShowOnboarding(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Efeitos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700"></div>
          <div className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/50 animate-pulse">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              BrainBoost
            </h1>
            <p className="text-cyan-200 text-lg">Turbine seus estudos com IA 🚀</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Qual é o seu nome?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Curso ou área de estudo
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
                placeholder="Ex: Engenharia, Medicina, etc."
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Objetivos acadêmicos
              </label>
              <textarea
                value={formData.goals}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all resize-none"
                placeholder="Descreva seus principais objetivos..."
                rows={3}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Começar jornada
              <Zap className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Componente de Header Mobile
  const MobileHeader = () => (
    <div className="md:hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 border-b border-white/10 p-4 flex items-center justify-between backdrop-blur-xl">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="text-white hover:text-cyan-400 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-white font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">BrainBoost</h1>
      </div>
      
      <div className="w-6" /> {/* Spacer para centralizar */}
    </div>
  );

  // Componente de Navegação
  const Navigation = () => {
    const navItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
      { id: 'planning', icon: Calendar, label: 'Planejamento' },
      { id: 'materials', icon: FileText, label: 'Materiais' },
      { id: 'tasks', icon: Target, label: 'Tarefas' },
      { id: 'pomodoro', icon: Timer, label: 'Foco' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
      { id: 'community', icon: Users, label: 'Comunidade' },
      { id: 'profile', icon: User, label: 'Perfil' }
    ];

    const handleNavClick = (viewId: string) => {
      setCurrentView(viewId);
      setIsSidebarOpen(false);
    };

    return (
      <>
        {/* Overlay para mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <nav className={`
          fixed md:static top-0 left-0 z-50 
          bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 border-r border-white/10 backdrop-blur-xl
          w-64 h-full p-4
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Header da sidebar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">BrainBoost</h1>
                <p className="text-cyan-200 text-sm">Olá, {user?.name}</p>
              </div>
            </div>
            
            {/* Botão fechar no mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-cyan-200 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Itens de navegação */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'text-cyan-200 hover:bg-white/10 hover:text-white hover:scale-105'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </>
    );
  };

  // Dashboard View
  const DashboardView = () => {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const todayStudyTime = studySessions
      .filter(s => s.date === new Date().toISOString().split('T')[0])
      .reduce((acc, s) => acc + s.duration, 0);

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-gray-400">Visão geral dos seus estudos</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">{completedTasks}/{totalTasks}</span>
            </div>
            <h3 className="text-white font-medium text-sm md:text-base">Tarefas Concluídas</h3>
            <p className="text-cyan-300 text-xs md:text-sm">Hoje</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">{Math.floor(todayStudyTime / 60)}h</span>
            </div>
            <h3 className="text-white font-medium text-sm md:text-base">Tempo de Estudo</h3>
            <p className="text-purple-300 text-xs md:text-sm">Hoje</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 shadow-xl shadow-pink-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500/30 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">{pomodoroCount}</span>
            </div>
            <h3 className="text-white font-medium text-sm md:text-base">Pomodoros</h3>
            <p className="text-pink-300 text-xs md:text-sm">Hoje</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
            <h3 className="text-white font-medium text-sm md:text-base">Progresso</h3>
            <p className="text-emerald-300 text-xs md:text-sm">Geral</p>
          </div>
        </div>

        {/* Próximas tarefas e metas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:border-cyan-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white">Próximas Tarefas</h2>
              <button 
                onClick={() => setCurrentView('tasks')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status !== 'completed').slice(0, 3).length > 0 ? (
                tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500 shadow-lg shadow-red-500/50' :
                      task.priority === 'medium' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 'bg-green-500 shadow-lg shadow-green-500/50'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm truncate">{task.title}</h3>
                      <p className="text-gray-400 text-xs">{task.subject}</p>
                    </div>
                    <span className="text-gray-400 text-xs whitespace-nowrap">
                      {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Nenhuma tarefa pendente. Adicione uma nova!</p>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white">Metas em Progresso</h2>
              <button 
                onClick={() => setCurrentView('tasks')}
                className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 2).length > 0 ? (
                goals.slice(0, 2).map((goal) => (
                  <div key={goal.id} className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium text-sm">{goal.title}</h3>
                      <span className="text-emerald-400 font-bold text-sm">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/50"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs">{goal.category}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Nenhuma meta criada. Defina seus objetivos!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Planning View
  const PlanningView = () => {
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Planejamento</h1>
            <p className="text-gray-400">Organize seus horários de estudo</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                viewMode === 'week' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                viewMode === 'month' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Mês
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4 mb-6">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center min-w-0">
                <h3 className="text-white font-medium mb-2 text-xs md:text-sm truncate">{day}</h3>
                <div className="space-y-1 sm:space-y-2">
                  {/* Espaço para eventos futuros */}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Evento
          </button>
        </div>
      </div>
    );
  };

  // Materials View com funcionalidade real
  const MaterialsView = () => {
    const [selectedType, setSelectedType] = useState<'all' | 'note' | 'pdf' | 'link'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMaterial, setNewMaterial] = useState({
      title: '',
      type: 'note' as 'note' | 'pdf' | 'link',
      subject: '',
      content: '',
      url: ''
    });
    
    const filteredMaterials = selectedType === 'all' 
      ? materials 
      : materials.filter(m => m.type === selectedType);

    const handleAddMaterial = () => {
      if (newMaterial.title && newMaterial.subject) {
        const material: Material = {
          id: Date.now().toString(),
          title: newMaterial.title,
          type: newMaterial.type,
          subject: newMaterial.subject,
          content: newMaterial.content,
          url: newMaterial.url,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setMaterials(prev => [material, ...prev]);
        setNewMaterial({ title: '', type: 'note', subject: '', content: '', url: '' });
        setShowAddModal(false);
      }
    };

    const handleDeleteMaterial = (id: string) => {
      setMaterials(prev => prev.filter(m => m.id !== id));
    };

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Materiais</h1>
            <p className="text-gray-400">Organize seus recursos de estudo</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Material
          </button>
        </div>

        {/* Modal de adicionar material */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Novo Material</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
                />
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value as any})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="note">Anotação</option>
                  <option value="pdf">PDF</option>
                  <option value="link">Link</option>
                </select>
                <input
                  type="text"
                  placeholder="Matéria"
                  value={newMaterial.subject}
                  onChange={(e) => setNewMaterial({...newMaterial, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                />
                {newMaterial.type === 'note' && (
                  <textarea
                    placeholder="Conteúdo"
                    value={newMaterial.content}
                    onChange={(e) => setNewMaterial({...newMaterial, content: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-pink-400 focus:outline-none resize-none"
                    rows={3}
                  />
                )}
                {(newMaterial.type === 'pdf' || newMaterial.type === 'link') && (
                  <input
                    type="url"
                    placeholder="URL"
                    value={newMaterial.url}
                    onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-pink-400 focus:outline-none"
                  />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleAddMaterial}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:shadow-xl transition-all"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Todos', icon: FileText },
            { id: 'note', label: 'Anotações', icon: Edit },
            { id: 'pdf', label: 'PDFs', icon: Download },
            { id: 'link', label: 'Links', icon: Link }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedType(filter.id as any)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                selectedType === filter.id 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Lista de materiais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <div key={material.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:border-cyan-500/50 hover:scale-105 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${
                    material.type === 'note' ? 'bg-blue-500/20 shadow-lg shadow-blue-500/30' :
                    material.type === 'pdf' ? 'bg-red-500/20 shadow-lg shadow-red-500/30' : 'bg-green-500/20 shadow-lg shadow-green-500/30'
                  }`}>
                    {material.type === 'note' && <Edit className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />}
                    {material.type === 'pdf' && <Download className="w-5 h-5 md:w-6 md:h-6 text-red-400" />}
                    {material.type === 'link' && <Link className="w-5 h-5 md:w-6 md:h-6 text-green-400" />}
                  </div>
                  <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                    <Star className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
                
                <h3 className="text-white font-medium mb-2 text-sm md:text-base">{material.title}</h3>
                <p className="text-gray-400 text-xs md:text-sm mb-4">{material.subject}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">
                    {new Date(material.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-red-400 transition-colors" onClick={() => handleDeleteMaterial(material.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400">Nenhum material encontrado. Adicione seu primeiro material!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tasks View com funcionalidade real
  const TasksView = () => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
    const [showAddTask, setShowAddTask] = useState(false);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [newTask, setNewTask] = useState({
      title: '',
      subject: '',
      priority: 'medium' as 'low' | 'medium' | 'high',
      dueDate: '',
      description: ''
    });
    const [newGoal, setNewGoal] = useState({
      title: '',
      description: '',
      category: '',
      targetDate: '',
      progress: 0
    });
    
    const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

    const handleAddTask = () => {
      if (newTask.title && newTask.subject && newTask.dueDate) {
        const task: Task = {
          id: Date.now().toString(),
          title: newTask.title,
          subject: newTask.subject,
          status: 'pending',
          priority: newTask.priority,
          dueDate: newTask.dueDate,
          description: newTask.description
        };
        setTasks(prev => [task, ...prev]);
        setNewTask({ title: '', subject: '', priority: 'medium', dueDate: '', description: '' });
        setShowAddTask(false);
      }
    };

    const handleAddGoal = () => {
      if (newGoal.title && newGoal.category && newGoal.targetDate) {
        const goal: Goal = {
          id: Date.now().toString(),
          title: newGoal.title,
          description: newGoal.description,
          category: newGoal.category,
          targetDate: newGoal.targetDate,
          progress: newGoal.progress
        };
        setGoals(prev => [goal, ...prev]);
        setNewGoal({ title: '', description: '', category: '', targetDate: '', progress: 0 });
        setShowAddGoal(false);
      }
    };

    const handleToggleTask = (id: string) => {
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          if (task.status === 'completed') {
            return { ...task, status: 'pending' };
          } else if (task.status === 'pending') {
            return { ...task, status: 'in-progress' };
          } else {
            return { ...task, status: 'completed' };
          }
        }
        return task;
      }));
    };

    const handleDeleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    };

    const handleDeleteGoal = (id: string) => {
      setGoals(prev => prev.filter(g => g.id !== id));
    };

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Tarefas e Metas</h1>
            <p className="text-gray-400">Gerencie suas atividades acadêmicas</p>
          </div>
          <button 
            onClick={() => setShowAddTask(true)}
            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </button>
        </div>

        {/* Modal adicionar tarefa */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Nova Tarefa</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título da tarefa"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Matéria"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="low">Prioridade Baixa</option>
                  <option value="medium">Prioridade Média</option>
                  <option value="high">Prioridade Alta</option>
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-pink-400 focus:outline-none"
                />
                <textarea
                  placeholder="Descrição (opcional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-pink-400 focus:outline-none resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTask}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:shadow-xl transition-all"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal adicionar meta */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 border border-white/20 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Nova Meta</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título da meta"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Categoria"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-purple-400 focus:outline-none"
                />
                <textarea
                  placeholder="Descrição"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-purple-400 focus:outline-none resize-none"
                  rows={2}
                />
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-pink-400 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddGoal}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:shadow-xl transition-all"
                  >
                    Adicionar
                  </button>
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Todas', count: tasks.length },
            { id: 'pending', label: 'Pendentes', count: tasks.filter(t => t.status === 'pending').length },
            { id: 'in-progress', label: 'Em Progresso', count: tasks.filter(t => t.status === 'in-progress').length },
            { id: 'completed', label: 'Concluídas', count: tasks.filter(t => t.status === 'completed').length }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                filter === filterOption.id 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/50' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span className="hidden sm:inline">{filterOption.label}</span>
              <span className="sm:hidden">{filterOption.label.split(' ')[0]}</span>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                {filterOption.count}
              </span>
            </button>
          ))}
        </div>

        {/* Lista de tarefas */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <button className="mt-1 flex-shrink-0" onClick={() => handleToggleTask(task.id)}>
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                    ) : task.status === 'in-progress' ? (
                      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                    ) : (
                      <Circle className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <h3 className={`font-medium text-sm md:text-base ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400 shadow-lg shadow-red-500/30' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/30' :
                          'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/30'
                        }`}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-gray-400 mb-3">
                      <span>{task.subject}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-400 text-xs md:text-sm mb-3">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhuma tarefa encontrada. Adicione sua primeira tarefa!</p>
            </div>
          )}
        </div>

        {/* Seção de Metas */}
        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Metas de Longo Prazo</h2>
            <button 
              onClick={() => setShowAddGoal(true)}
              className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/10 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Nova Meta
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {goals.length > 0 ? (
              goals.map((goal) => (
                <div key={goal.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-1 text-sm md:text-base">{goal.title}</h3>
                      <p className="text-gray-400 text-xs md:text-sm">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-emerald-400 font-bold text-lg">{goal.progress}%</span>
                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/50"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs md:text-sm">
                    <span className="text-gray-400">{goal.category}</span>
                    <span className="text-gray-400">
                      Prazo: {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">Nenhuma meta criada. Defina seus objetivos de longo prazo!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Pomodoro View
  const PomodoroView = () => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const resetTimer = () => {
      setIsRunning(false);
      setPomodoroTime(25 * 60);
      setCurrentSession('work');
    };

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Timer de Foco</h1>
          <p className="text-gray-400">Técnica Pomodoro para máxima produtividade</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 md:p-8 text-center shadow-2xl shadow-purple-500/30">
            <div className="mb-6">
              <div className={`w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full border-8 flex items-center justify-center mb-4 transition-all duration-300 ${
                currentSession === 'work' 
                  ? 'border-cyan-400 bg-cyan-400/10 shadow-2xl shadow-cyan-500/50' 
                  : 'border-pink-400 bg-pink-400/10 shadow-2xl shadow-pink-500/50'
              }`}>
                <span className="text-2xl md:text-4xl font-bold text-white">
                  {formatTime(pomodoroTime)}
                </span>
              </div>
              
              <h2 className="text-lg md:text-xl font-bold text-white mb-2">
                {currentSession === 'work' ? 'Tempo de Foco' : 'Pausa'}
              </h2>
              <p className="text-gray-400 text-sm">
                {currentSession === 'work' 
                  ? 'Concentre-se na sua tarefa atual' 
                  : 'Relaxe e descanse um pouco'
                }
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                  isRunning 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:scale-110 shadow-red-500/50' 
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-110 shadow-purple-500/50'
                }`}
              >
                {isRunning ? (
                  <Pause className="w-6 h-6 md:w-8 md:h-8 text-white" />
                ) : (
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white" />
                )}
              </button>
              
              <button
                onClick={resetTimer}
                className="w-10 h-10 md:w-12 md:h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
              >
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-3 md:p-4">
                <div className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">{pomodoroCount}</div>
                <div className="text-gray-400 text-xs md:text-sm">Pomodoros Hoje</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 md:p-4">
                <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">
                  {Math.floor(studySessions.reduce((acc, s) => acc + s.duration, 0) / 60)}h
                </div>
                <div className="text-gray-400 text-xs md:text-sm">Tempo Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessões recentes */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-4">Sessões Recentes</h3>
          <div className="space-y-3">
            {studySessions.slice(0, 5).length > 0 ? (
              studySessions.slice(0, 5).map((session) => (
                <div key={session.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shadow-lg ${
                      session.type === 'pomodoro' ? 'bg-cyan-400 shadow-cyan-500/50' : 'bg-purple-400 shadow-purple-500/50'
                    }`} />
                    <div>
                      <h4 className="text-white font-medium text-sm">{session.subject}</h4>
                      <p className="text-gray-400 text-xs">
                        {new Date(session.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium text-sm">{Math.floor(session.duration / 60)}min</div>
                    <div className="text-gray-400 text-xs capitalize">{session.type}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">Nenhuma sessão registrada ainda. Comece seu primeiro Pomodoro!</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Analytics View
  const AnalyticsView = () => {
    const totalStudyTime = studySessions.reduce((acc, s) => acc + s.duration, 0);
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calcular dias consecutivos
    const dates = studySessions.map(s => s.date).sort();
    let consecutiveDays = 0;
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = dates.length - 1; i >= 0; i--) {
      if (dates[i] === today || (i < dates.length - 1 && dates[i] === dates[i + 1])) {
        currentStreak++;
      } else {
        break;
      }
    }
    consecutiveDays = currentStreak;

    const weeklyData = [
      { day: 'Seg', hours: 0 },
      { day: 'Ter', hours: 0 },
      { day: 'Qua', hours: 0 },
      { day: 'Qui', hours: 0 },
      { day: 'Sex', hours: 0 },
      { day: 'Sáb', hours: 0 },
      { day: 'Dom', hours: 0 }
    ];

    // Calcular horas por dia da semana
    studySessions.forEach(session => {
      const date = new Date(session.date);
      const dayIndex = date.getDay();
      weeklyData[dayIndex].hours += session.duration / 60;
    });

    // Calcular tempo por matéria
    const subjectMap = new Map<string, number>();
    studySessions.forEach(session => {
      const current = subjectMap.get(session.subject) || 0;
      subjectMap.set(session.subject, current + session.duration / 60);
    });

    const subjectData = Array.from(subjectMap.entries()).map(([subject, hours], index) => ({
      subject,
      hours: Math.round(hours * 10) / 10,
      color: ['#06B6D4', '#A855F7', '#EC4899', '#10B981', '#F59E0B'][index % 5]
    }));

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Insights e Analytics</h1>
          <p className="text-gray-400">Acompanhe sua evolução nos estudos</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 shadow-xl shadow-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
              </div>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{Math.floor(totalStudyTime / 60)}h</h3>
            <p className="text-gray-400 text-xs md:text-sm">Tempo total de estudo</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{completionRate}%</h3>
            <p className="text-gray-400 text-xs md:text-sm">Taxa de conclusão</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 shadow-xl shadow-pink-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500/30 rounded-xl flex items-center justify-center">
                <Focus className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
              </div>
              <Award className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{consecutiveDays}</h3>
            <p className="text-gray-400 text-xs md:text-sm">Dias consecutivos</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 md:p-6 hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
              {studySessions.length > 0 ? Math.round((totalStudyTime / 60 / studySessions.length) * 10) / 10 : 0}h
            </h3>
            <p className="text-gray-400 text-xs md:text-sm">Média por sessão</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico semanal */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
            <h3 className="text-lg font-bold text-white mb-4">Horas de Estudo - Semana</h3>
            <div className="space-y-3">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm w-8">{day.day}</span>
                  <div className="flex-1 bg-gray-700/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
                      style={{ width: `${day.hours > 0 ? Math.min((day.hours / 4) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-white text-sm font-medium w-12">{day.hours.toFixed(1)}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distribuição por matéria */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
            <h3 className="text-lg font-bold text-white mb-4">Tempo por Matéria</h3>
            <div className="space-y-4">
              {subjectData.length > 0 ? (
                subjectData.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: subject.color, boxShadow: `0 0 20px ${subject.color}50` }}
                      />
                      <span className="text-white font-medium text-sm">{subject.subject}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold text-sm">{subject.hours}h</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Nenhum dado disponível ainda</p>
              )}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4">Insights Personalizados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completionRate >= 80 && (
              <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border-l-4 border-emerald-400 shadow-lg shadow-emerald-500/20">
                <h4 className="text-emerald-400 font-medium mb-2">Parabéns!</h4>
                <p className="text-gray-300 text-sm">
                  Você tem uma excelente taxa de conclusão de tarefas. Continue assim!
                </p>
              </div>
            )}
            {consecutiveDays >= 3 && (
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/20">
                <h4 className="text-cyan-400 font-medium mb-2">Ótimo!</h4>
                <p className="text-gray-300 text-sm">
                  Você manteve uma sequência de {consecutiveDays} dias estudando. Mantenha o ritmo!
                </p>
              </div>
            )}
            {pomodoroCount >= 5 && (
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border-l-4 border-purple-400 shadow-lg shadow-purple-500/20">
                <h4 className="text-purple-400 font-medium mb-2">Foco Total!</h4>
                <p className="text-gray-300 text-sm">
                  Você completou {pomodoroCount} pomodoros hoje. Sua concentração está excelente!
                </p>
              </div>
            )}
            {studySessions.length === 0 && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border-l-4 border-yellow-400 shadow-lg shadow-yellow-500/20">
                <h4 className="text-yellow-400 font-medium mb-2">Comece Agora!</h4>
                <p className="text-gray-300 text-sm">
                  Inicie sua primeira sessão de estudos e comece a acompanhar seu progresso!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Community View com funcionalidade real
  const CommunityView = () => {
    const [newPost, setNewPost] = useState({ title: '', content: '', subject: '' });
    
    const handleAddPost = () => {
      if (newPost.title && newPost.content && newPost.subject && user) {
        const post: ForumPost = {
          id: Date.now().toString(),
          author: user.name,
          title: newPost.title,
          content: newPost.content,
          subject: newPost.subject,
          likes: 0,
          replies: 0,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setForumPosts(prev => [post, ...prev]);
        setNewPost({ title: '', content: '', subject: '' });
      }
    };

    const handleLikePost = (id: string) => {
      setForumPosts(prev => prev.map(post => 
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      ));
    };

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Comunidade</h1>
            <p className="text-gray-400">Conecte-se com outros estudantes</p>
          </div>
        </div>

        {/* Criar post */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4">Compartilhe uma dica ou dúvida</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Título da discussão..."
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
            />
            <select
              value={newPost.subject}
              onChange={(e) => setNewPost({...newPost, subject: e.target.value})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
            >
              <option value="">Selecione a matéria</option>
              <option value="Matemática">Matemática</option>
              <option value="Física">Física</option>
              <option value="História">História</option>
              <option value="Química">Química</option>
              <option value="Geral">Geral</option>
            </select>
            <textarea
              placeholder="Descreva sua dúvida ou compartilhe uma dica..."
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all resize-none"
              rows={3}
            />
            <button 
              onClick={handleAddPost}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" />
              Publicar
            </button>
          </div>
        </div>

        {/* Posts da comunidade */}
        <div className="space-y-4">
          {forumPosts.length > 0 ? (
            forumPosts.map((post) => (
              <div key={post.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/50">
                    <span className="text-white font-bold text-xs md:text-sm">
                      {post.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-white font-medium text-sm">{post.author}</h3>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full text-xs border border-cyan-500/30">
                        {post.subject}
                      </span>
                    </div>
                    
                    <h4 className="text-white font-medium text-base md:text-lg mb-2">{post.title}</h4>
                    <p className="text-gray-400 mb-4 text-sm">{post.content}</p>
                    
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.replies} respostas</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhuma discussão ainda. Seja o primeiro a compartilhar!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Profile View
  const ProfileView = () => {
    const [profileData, setProfileData] = useState({
      name: user?.name || '',
      course: user?.course || '',
      goals: user?.goals || ''
    });

    const handleProfileUpdate = (field: string, value: string) => {
      setProfileData(prev => ({ ...prev, [field]: value }));
      if (user) {
        setUser({ ...user, [field]: value });
      }
    };

    return (
      <div className="p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">Perfil</h1>
          <p className="text-gray-400">Gerencie suas informações e preferências</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do usuário */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
              <h3 className="text-lg font-bold text-white mb-4">Informações Pessoais</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Curso</label>
                  <input
                    type="text"
                    value={profileData.course}
                    onChange={(e) => handleProfileUpdate('course', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Objetivos</label>
                  <textarea
                    value={profileData.goals}
                    onChange={(e) => handleProfileUpdate('goals', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
              <h3 className="text-lg font-bold text-white mb-4">Preferências</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Notificações</h4>
                    <p className="text-gray-400 text-sm">Receber lembretes de tarefas</p>
                  </div>
                  <button className="w-12 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full relative shadow-lg shadow-purple-500/50">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Som do Timer</h4>
                    <p className="text-gray-400 text-sm">Alertas sonoros no Pomodoro</p>
                  </div>
                  <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Modo Escuro</h4>
                    <p className="text-gray-400 text-sm">Interface em tema escuro</p>
                  </div>
                  <button className="w-12 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative shadow-lg shadow-pink-500/50">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas do usuário */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/50">
                <span className="text-white font-bold text-lg md:text-2xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{user?.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{user?.course}</p>
              <button className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300 text-sm">
                Alterar Foto
              </button>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
              <h3 className="text-lg font-bold text-white mb-4">Conquistas</h3>
              <div className="space-y-3">
                {pomodoroCount >= 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-500/20 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">Focado</h4>
                      <p className="text-gray-400 text-xs">{pomodoroCount} pomodoros</p>
                    </div>
                  </div>
                )}
                
                {tasks.filter(t => t.status === 'completed').length >= 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/20 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                      <Check className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">Organizador</h4>
                      <p className="text-gray-400 text-xs">{tasks.filter(t => t.status === 'completed').length} tarefas concluídas</p>
                    </div>
                  </div>
                )}

                {studySessions.length >= 1 && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/20 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                      <Award className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">Dedicado</h4>
                      <p className="text-gray-400 text-xs">{studySessions.length} sessões de estudo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderização principal
  if (showOnboarding && !user) {
    return <OnboardingView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex flex-col md:flex-row font-inter">
      {/* Header mobile */}
      <MobileHeader />
      
      {/* Sidebar */}
      <Navigation />
      
      {/* Conteúdo principal */}
      <main className="flex-1 overflow-auto">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'planning' && <PlanningView />}
        {currentView === 'materials' && <MaterialsView />}
        {currentView === 'tasks' && <TasksView />}
        {currentView === 'pomodoro' && <PomodoroView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'community' && <CommunityView />}
        {currentView === 'profile' && <ProfileView />}
      </main>
    </div>
  );
}
