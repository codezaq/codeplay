import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomDropdown } from './CustomDropdown';
import { X, Plus, LogIn, LayoutGrid, Image as ImageIcon, Tag, Link, Palette, Loader2 } from 'lucide-react';
import { 
  db, 
  auth, 
  loginWithGoogle, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from '../firebase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogin: (user: any) => void;
  onProjectAdded: () => void;
  onCategoriesUpdated: () => void;
  editingProject?: any;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onLogin, 
  onProjectAdded,
  onCategoriesUpdated,
  editingProject
}) => {
  const [isLoginView, setIsLoginView] = useState(!user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    category: '',
    docsLink: '#',
    sourceLink: '#',
    color: 'from-zinc-800 to-zinc-900'
  });

  useEffect(() => {
    setIsLoginView(!user);
  }, [user]);

  useEffect(() => {
    if (editingProject) {
      setNewProject({
        title: editingProject.title || '',
        description: editingProject.description || '',
        image: editingProject.image || '',
        tags: Array.isArray(editingProject.tags) ? editingProject.tags.join(', ') : (editingProject.tags || ''),
        category: editingProject.category || '',
        docsLink: editingProject.docsLink || '#',
        sourceLink: editingProject.sourceLink || '#',
        color: editingProject.color || 'from-zinc-800 to-zinc-900'
      });
      setShowCategoryManager(false);
      setShowDeleteConfirm(false);
    } else {
      setNewProject({
        title: '',
        description: '',
        image: '',
        tags: '',
        category: categories[1] || '',
        docsLink: '#',
        sourceLink: '#',
        color: 'from-zinc-800 to-zinc-900'
      });
      setShowDeleteConfirm(false);
    }
  }, [editingProject, categories]);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data().name);
      setCategories(['All', ...data]);
      if (!newProject.category && data.length > 0) {
        setNewProject(prev => ({ ...prev, category: data[0] }));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'categories');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsLoading(true);
    try {
      const categoryId = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'categories', categoryId), {
        name: newCategoryName.trim()
      });
      setNewCategoryName('');
      fetchCategories();
      onCategoriesUpdated();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (name: string) => {
    if (name === 'All') return;
    setIsLoading(true);
    try {
      const categoryId = name.toLowerCase().replace(/\s+/g, '-');
      await deleteDoc(doc(db, 'categories', categoryId));
      fetchCategories();
      onCategoriesUpdated();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const formatLink = (link: string) => {
      if (!link || link === '#') return '#';
      if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return `https://${link}`;
      }
      return link;
    };

    try {
      const projectData = {
        ...newProject,
        docsLink: formatLink(newProject.docsLink),
        sourceLink: formatLink(newProject.sourceLink),
        tags: newProject.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        updatedAt: serverTimestamp(),
        createdAt: editingProject ? editingProject.createdAt : serverTimestamp()
      };

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }
      
      onProjectAdded();
      onClose();
      if (!editingProject) {
        setNewProject({
          title: '',
          description: '',
          image: '',
          tags: '',
          category: categories[1] || '',
          docsLink: '#',
          sourceLink: '#',
          color: 'from-zinc-800 to-zinc-900'
        });
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, 'projects');
      setError(`Failed to save project: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!editingProject) return;
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, 'projects', editingProject.id));
      onProjectAdded();
      onClose();
      setShowDeleteConfirm(false);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${editingProject.id}`);
      setError(`Delete failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle();
      const firebaseUser = result.user;
      
      // Check if user exists in Firestore, if not create as role
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      let userData;
      const role = firebaseUser.email === 'lukmanzakaria9f@gmail.com' ? 'admin' : 'user';

      if (!userSnap.exists()) {
        userData = {
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: role,
          email: firebaseUser.email
        };
        await setDoc(userRef, userData);
      } else {
        userData = userSnap.data();
      }

      onLogin({ ...firebaseUser, ...userData });
      
      // If regular user, close the modal immediately since they don't have access to CRUD
      if (userData.role !== 'admin') {
        onClose();
      } else {
        setIsLoginView(false);
      }
    } catch (err: any) {
      console.error('Login error details:', err);
      
      if (err.message?.includes('auth/api-key-not-valid')) {
        setError('Galat Infrastruktur: Firebase API Key tidak valid di server Google. Mohon tunggu proses sinkronisasi cloud atau coba muat ulang halaman.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup Terblokir: Harap izinkan popup di browser Anda untuk masuk.');
      } else {
        setError(`Login gagal: ${err.message || 'Koneksi bermasalah'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {isLoginView ? (
              <div className="py-4">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">Login</h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Access Playground Lab</p>
                </div>

                {/* Health warning removed as we are now on Firebase */}

                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-zinc-400 text-xs font-medium mb-6 leading-relaxed">
                      Sign in with your Google account to access the playground.
                    </p>
                    <button 
                      onClick={handleLoginSubmit}
                      disabled={isLoading}
                      className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          <LogIn className="w-5 h-5" />
                          Sign in with Google
                        </>
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <p className="text-red-500 text-[10px] font-black uppercase text-center leading-tight">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tight">
                      {showCategoryManager ? 'Manage Categories' : (editingProject ? 'Edit Project' : 'Add Project')}
                    </h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Logged in as {user?.username}</p>
                  </div>
                  <button 
                    onClick={() => setShowCategoryManager(!showCategoryManager)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all"
                  >
                    {showCategoryManager ? 'Back to Projects' : 'Manage Categories'}
                  </button>
                  <button 
                    onClick={() => {
                      setIsLoading(true);
                      fetchCategories();
                      setIsLoading(false);
                    }}
                    className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-yellow-400 hover:text-black transition-all"
                    title="Refresh Data"
                  >
                    <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {showCategoryManager ? (
                    <motion.div 
                      key="category-manager"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <form onSubmit={handleAddCategory} className="flex gap-2">
                        <input 
                          type="text" 
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                          placeholder="New Category Name"
                          required
                        />
                        <button 
                          type="submit"
                          disabled={isLoading}
                          className="px-6 bg-yellow-400 text-black rounded-2xl font-black uppercase text-xs hover:bg-white transition-all disabled:opacity-50"
                        >
                          Add
                        </button>
                      </form>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">Existing Categories</label>
                        <div className="grid grid-cols-1 gap-2">
                          <AnimatePresence>
                            {categories.map((cat, idx) => (
                              <motion.div 
                                key={cat}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4 group/cat hover:border-yellow-400/50 transition-colors"
                              >
                                <span className="text-sm font-bold uppercase tracking-wider">{cat}</span>
                                {cat !== 'All' && (
                                  <button 
                                    onClick={() => handleDeleteCategory(cat)}
                                    className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="project-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onSubmit={handleAddProject} 
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 gap-5">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                            <LayoutGrid className="w-3 h-3" /> Title
                          </label>
                          <motion.input 
                            whileFocus={{ scale: 1.01 }}
                            type="text" 
                            value={newProject.title}
                            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            placeholder="Project Title"
                            required
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                            Description
                          </label>
                          <motion.textarea 
                            whileFocus={{ scale: 1.01 }}
                            value={newProject.description}
                            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-yellow-400 transition-colors h-24 resize-none"
                            placeholder="Short description..."
                            required
                          />
                        </motion.div>
                        <div className="grid grid-cols-2 gap-4">
                          <CustomDropdown
                            label="Category"
                            options={categories.filter(c => c !== 'All')}
                            selected={newProject.category}
                            onChange={(val) => setNewProject({...newProject, category: val})}
                            className="w-full"
                          />
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                              <Palette className="w-3 h-3" /> Color
                            </label>
                            <input 
                              type="text" 
                              value={newProject.color}
                              onChange={(e) => setNewProject({...newProject, color: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                              placeholder="from-blue-500 to-cyan-500"
                            />
                          </motion.div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                        >
                          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                            <ImageIcon className="w-3 h-3" /> Image URL
                          </label>
                          <input 
                            type="text" 
                            value={newProject.image}
                            onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            placeholder="https://..."
                            required
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                            <Tag className="w-3 h-3" /> Tags (comma separated)
                          </label>
                          <input 
                            type="text" 
                            value={newProject.tags}
                            onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            placeholder="React, Tailwind, Motion"
                            required
                          />
                        </motion.div>
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                          >
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                              <Link className="w-3 h-3" /> Docs Link
                            </label>
                            <input 
                              type="text" 
                              value={newProject.docsLink}
                              onChange={(e) => setNewProject({...newProject, docsLink: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                          >
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1">
                              <Link className="w-3 h-3" /> Source Link
                            </label>
                            <input 
                              type="text" 
                              value={newProject.sourceLink}
                              onChange={(e) => setNewProject({...newProject, sourceLink: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                            />
                          </motion.div>
                        </div>
                      </div>

                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                        >
                          <p className="text-red-500 text-[10px] font-black uppercase text-center leading-tight">
                            {error}
                          </p>
                        </motion.div>
                      )}

                      <div className="flex flex-col gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-5 bg-yellow-400 text-black rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95 disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingProject ? 'Update Project' : 'Publish Project')}
                        </motion.button>
                        
                        {editingProject && (
                          <div className="space-y-3">
                            {!showDeleteConfirm ? (
                              <motion.button 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                              >
                                Delete Project
                              </motion.button>
                            ) : (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-4"
                              >
                                <p className="text-red-500 text-[10px] font-black uppercase text-center">Are you absolutely sure?</p>
                                <div className="flex gap-2">
                                  <button 
                                    type="button"
                                    onClick={handleDeleteProject}
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                                  >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Yes, Delete'}
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 bg-white/10 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all active:scale-95"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
};
