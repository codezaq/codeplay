import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  BookOpen, 
  Terminal, 
  Sparkles,
  Rocket,
  Gamepad2,
  Code2,
  ChevronLeft,
  ChevronRight,
  X,
  Eye
} from 'lucide-react';
import { PROJECTS, CATEGORIES } from './constants';
import { useState, useMemo } from 'react';
import { Project } from './types';

const ITEMS_PER_PAGE = 4;

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Filter logic
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return PROJECTS;
    return PROJECTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Reset page when filter changes
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-400 selection:text-black font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter italic uppercase">
              Code<span className="text-yellow-400">Playground</span>
            </span>
          </motion.div>
          
          <nav className="flex items-center gap-8">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2 bg-yellow-400 text-black text-sm font-black uppercase rounded-full hover:bg-white transition-all transform active:scale-95 shadow-lg shadow-yellow-400/10"
            >
              Let's Explore
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Experiments & Fun</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-[0.85] mb-8">
              Where Code <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
                Comes to Life
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-zinc-400 text-lg md:text-xl font-medium mb-12">
              A collection of digital toys, interactive experiments, and creative coding projects. No boring stuff allowed!
            </p>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-yellow-400 text-black font-black uppercase rounded-2xl shadow-2xl shadow-yellow-400/20 group"
            >
              Explore Playground
              <Rocket className="w-5 h-5 group-hover:translate-y-[-4px] transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
            <h2 className="font-display text-3xl font-black uppercase italic">The Lab</h2>
            
            {/* Filter UI */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory + currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 min-h-[400px] sm:min-h-[600px]"
            >
              {paginatedProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -10 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color || 'from-zinc-800 to-zinc-900'} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
                  
                  <div className="relative bg-zinc-900/50 border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-sm overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 border border-white/5 group/img">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setSelectedProject(project)}
                          className="px-8 py-3 bg-yellow-400 text-black rounded-full font-black uppercase text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110 shadow-xl shadow-yellow-400/20"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-400/20">
                          {project.category}
                        </span>
                        {project.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    <h3 
                        onClick={() => setSelectedProject(project)}
                        className="text-2xl sm:text-3xl font-black uppercase italic mb-3 hover:text-yellow-400 transition-colors cursor-pointer inline-block"
                      >
                        {project.title}
                      </h3>
                      <p className="text-zinc-400 font-medium leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="mt-20 flex items-center justify-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 rounded-xl font-black transition-all ${
                      currentPage === i + 1 
                        ? 'bg-yellow-400 text-black' 
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 transition-all backdrop-blur-md"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="aspect-video lg:aspect-auto h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                  <img 
                    src={selectedProject.image} 
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-[10px] font-black uppercase tracking-widest">
                      {selectedProject.category}
                    </span>
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 text-zinc-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic mb-4 sm:mb-6 leading-tight">
                    {selectedProject.title}
                  </h2>
                  
                  <p className="text-zinc-400 text-base sm:text-lg font-medium leading-relaxed mb-8 sm:mb-10">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.a
                      href={selectedProject.docsLink}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-3 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs sm:text-sm font-black uppercase transition-all whitespace-nowrap px-4"
                    >
                      <BookOpen className="w-5 h-5 flex-shrink-0" />
                      Documentation
                    </motion.a>
                    <motion.a
                      href={selectedProject.sourceLink}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 flex items-center justify-center gap-3 py-5 bg-yellow-400 text-black rounded-2xl text-xs sm:text-sm font-black uppercase transition-all whitespace-nowrap px-4"
                    >
                      <Github className="w-5 h-5 flex-shrink-0" />
                      Source Code
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="font-display font-black text-xl tracking-tighter uppercase italic">
              Code<span className="text-yellow-400">Playground</span>
            </span>
          </div>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-8">
            Built with chaos and code by <span className="text-white">Lukman</span>
          </p>
          <div className="flex justify-center gap-8">
            {['Github', 'Twitter', 'Discord'].map(social => (
              <a key={social} href="#" className="text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
