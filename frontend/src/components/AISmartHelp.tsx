import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Bot, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export const AISmartHelp: React.FC = () => {
  const navigate = useNavigate();
  const [userQuery, setUserQuery] = useState('My washing machine is making a loud noise');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>({
    suggestedCategoryName: 'Washing Machine Repair',
    suggestedCategoryId: 5,
    summary: 'Detected washing machine drum noise or spin cycle bearing issue.',
    disclaimer: 'AI suggestions are for service categorization only.',
  });

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setLoading(true);
    try {
      const res = await api.classifyAiProblem(userQuery);
      setAiResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseService = () => {
    navigate('/app/request', {
      state: {
        problemDescription: userQuery,
        categoryId: aiResult?.suggestedCategoryId || 5,
        aiSuggestion: aiResult?.summary || 'Washing Machine Repair',
      },
    });
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Glowing AI Card Container */}
        <div className="relative rounded-3xl md:rounded-[2.5rem] bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/60 p-6 sm:p-10 lg:p-14 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Mobile Phone & Floating Conversation Card Art */}
            <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-sm">
                {/* Mobile Artwork Frame */}
                <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-4 shadow-2xl border-4 border-slate-800 dark:border-slate-700">
                  <div className="relative bg-gradient-to-b from-teal-900/60 to-slate-900 rounded-[2rem] p-5 text-white overflow-hidden min-h-[360px] flex flex-col justify-between">
                    {/* Bot Avatar Top Bar */}
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs">LankaEase AI Bot</h4>
                        <p className="text-[10px] text-emerald-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online Assistant
                        </p>
                      </div>
                    </div>

                    {/* Chat Bubble: User Input */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="self-end bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[85%] shadow-md my-4"
                    >
                      "{userQuery}"
                    </motion.div>

                    {/* Floating Response Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white text-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 space-y-2"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Suggested Service</span>
                      </div>
                      <h5 className="font-extrabold text-base text-slate-900">
                        {aiResult?.suggestedCategoryName || 'Washing Machine Repair'}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {aiResult?.summary || 'Washing machine servicing & diagnostics'}
                      </p>
                      <button
                        onClick={handleUseService}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1 transition-colors mt-1"
                      >
                        <span>Use This Service</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Section Content & Input Form */}
            <div className="lg:col-span-7 space-y-5 text-left order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Not sure what service you need?
              </h2>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Tell LankaEase what's wrong.
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  Our AI helps you find the right service category based on your description.
                </p>
              </div>

              {/* Interactive Problem Form */}
              <form onSubmit={handleClassify} className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-800 p-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-md">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder="e.g. My washing machine is making a loud noise..."
                    className="flex-1 px-5 py-3 bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-full shadow-md flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Try AI Smart Help</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
