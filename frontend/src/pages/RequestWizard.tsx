import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, MOCK_CATEGORIES, MOCK_FAMILY_MEMBERS } from '../services/api';
import {
  Wrench,
  Sparkle,
  Upload,
  CheckCircle2,
  ChevronRight,
  Users,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RequestWizard: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state || {};

  const [step, setStep] = useState(1);
  const [problemDescription, setProblemDescription] = useState(locationState.problemDescription || '');
  const [categoryId, setCategoryId] = useState<number | null>(locationState.categoryId || null);
  const [familyMemberId, setFamilyMemberId] = useState<number | null>(null);
  const [providerId] = useState<number | null>(locationState.providerId || null);
  const [address, setAddress] = useState('No. 45, Galle Road, Colombo 03, Sri Lanka');
  const [latitude, setLatitude] = useState(6.9147);
  const [longitude, setLongitude] = useState(79.8510);
  const [preferredDate, setPreferredDate] = useState('2026-09-26');
  const [preferredTime, setPreferredTime] = useState('10:00 - 12:00');
  const [urgency, setUrgency] = useState<'NORMAL' | 'TODAY' | 'URGENT'>('NORMAL');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState<any>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger AI Classification on step 1 -> step 2
  const handleNextStep1 = async () => {
    if (!problemDescription.trim()) return;
    setIsClassifying(true);
    try {
      const res = await api.classifyAiProblem(problemDescription);
      setAiResult(res);
      if (res.suggestedCategoryId && !categoryId) {
        setCategoryId(res.suggestedCategoryId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsClassifying(false);
      setStep(2);
    }
  };

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setMediaUrls([...mediaUrls, url]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const handleSelectFamilyMember = (fmId: number) => {
    setFamilyMemberId(fmId);
    const member = MOCK_FAMILY_MEMBERS.find((m) => m.id === fmId);
    if (member) {
      setAddress(member.address);
      if (member.latitude) setLatitude(member.latitude);
      if (member.longitude) setLongitude(member.longitude);
    }
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setIsSubmitting(true);
    try {
      const payload = {
        problemDescription,
        categoryId: categoryId || 1,
        familyMemberId,
        providerId,
        address,
        latitude,
        longitude,
        preferredDate,
        preferredTime,
        urgency,
        aiSuggestion: aiResult?.summary,
        mediaUrls,
        isDraft,
      };

      const req = await api.createServiceRequest(payload);
      navigate(`/app/requests/${req.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 pt-4">
      {/* Step Progress Indicator (1 - 8) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
          <span>STEP {step} OF 8</span>
          <span className="text-emerald-500 font-bold">
            {step === 1 && 'Describe Problem'}
            {step === 2 && 'AI Suggestion'}
            {step === 3 && 'Service Category'}
            {step === 4 && 'Upload Photos/Videos'}
            {step === 5 && 'Select Location'}
            {step === 6 && 'Date & Time'}
            {step === 7 && 'Select Urgency'}
            {step === 8 && 'Review & Submit'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-slate-900 dark:bg-slate-100 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Views Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: Describe Problem */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Step 1: What is the issue?</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Describe what's wrong in your own words. Our AI will help categorize it.</p>
              
              <textarea
                rows={5}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="e.g. My washing machine is making a loud grinding noise during spin cycle and leaking water underneath."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />

              <button
                onClick={handleNextStep1}
                disabled={!problemDescription.trim() || isClassifying}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                {isClassifying ? <span>AI Analyzing...</span> : <span>Next: AI Suggestion</span>}
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: AI Suggestion */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Step 2: AI Classification</h2>

              {aiResult && (
                <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase">
                    <Sparkle className="w-4 h-4 text-emerald-500" /> AI Classification
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{aiResult.suggestedCategoryName}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{aiResult.summary}</p>
                  
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">Suggested Clarifying Questions:</span>
                    {aiResult.clarifyingQuestions?.map((q: string, idx: number) => (
                      <p key={idx} className="text-xs text-slate-700 dark:text-slate-300">• {q}</p>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 italic">⚠️ {aiResult.disclaimer}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(1)} className="px-5 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-bold">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow">
                  Accept Suggestion & Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Select Category */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Step 3: Confirm Category</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select or change the category for your request.</p>

              <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {MOCK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition-all ${
                      categoryId === cat.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(2)} className="px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-bold">Back</button>
                <button onClick={() => setStep(4)} disabled={!categoryId} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow">Next: Media</button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Upload Media */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Step 4: Upload Media</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Upload photos or short videos of the problem to help providers estimate pricing.</p>

              <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-slate-900 dark:hover:border-slate-100 transition-colors">
                <Upload className="w-8 h-8 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to upload photo/video</span>
                <input type="file" accept="image/*,video/*" onChange={handleMediaAdd} className="hidden" />
              </label>

              {/* Previews */}
              {mediaUrls.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {mediaUrls.map((url, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                      <img src={url} alt="upload" className="w-full h-full object-cover" />
                      <button onClick={() => handleRemoveMedia(i)} className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(3)} className="px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-bold">Back</button>
                <button onClick={() => setStep(5)} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow">Next: Location</button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Select Location */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Step 5: Select Location</h2>

              {/* Family Assistance Selection */}
              <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <Users className="w-4 h-4 text-emerald-500" /> Request for Family Member?
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setFamilyMemberId(null); setAddress('No. 45, Galle Road, Colombo 03'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${!familyMemberId ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}
                  >
                    My Home
                  </button>
                  {MOCK_FAMILY_MEMBERS.map((fm) => (
                    <button
                      key={fm.id}
                      onClick={() => handleSelectFamilyMember(fm.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${familyMemberId === fm.id ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'}`}
                    >
                      {fm.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Service Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(4)} className="px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-bold">Back</button>
                <button onClick={() => setStep(6)} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow">Next: Date & Time</button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Select Date & Time */}
          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Step 6: Preferred Date & Time</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
                  >
                    <option value="08:00 - 10:00">Morning (08:00 - 10:00)</option>
                    <option value="10:00 - 12:00">Late Morning (10:00 - 12:00)</option>
                    <option value="14:00 - 16:00">Afternoon (14:00 - 16:00)</option>
                    <option value="16:00 - 18:00">Evening (16:00 - 18:00)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(5)} className="px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-bold">Back</button>
                <button onClick={() => setStep(7)} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow">Next: Urgency</button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: Select Urgency */}
          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Step 7: Urgency Level</h2>

              <div className="space-y-3">
                {[
                  { key: 'NORMAL', label: 'Normal', desc: 'Schedule for preferred date/time slot' },
                  { key: 'TODAY', label: 'Today', desc: 'Technician visit required within today' },
                  { key: 'URGENT', label: 'Urgent Breakdown', desc: 'Emergency immediate provider dispatch' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setUrgency(item.key as any)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      urgency === item.key
                        ? 'border-slate-900 bg-slate-900 text-white ring-2 ring-slate-900 shadow'
                        : 'border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold">{item.label}</h4>
                      <p className="text-xs opacity-80">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep(6)} className="px-5 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-bold">Back</button>
                <button onClick={() => setStep(8)} className="flex-1 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow">Next: Review & Submit</button>
              </div>
            </motion.div>
          )}

          {/* STEP 8: Review & Submit */}
          {step === 8 && (
            <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Step 8: Review & Submit</h2>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <p><strong>Problem:</strong> {problemDescription}</p>
                <p><strong>Category:</strong> {MOCK_CATEGORIES.find((c) => c.id === categoryId)?.name}</p>
                <p><strong>Address:</strong> {address}</p>
                <p><strong>Date & Time:</strong> {preferredDate} ({preferredTime})</p>
                <p><strong>Urgency:</strong> {urgency}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Save className="w-4 h-4" /> Save Draft
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Submit Service Request
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
