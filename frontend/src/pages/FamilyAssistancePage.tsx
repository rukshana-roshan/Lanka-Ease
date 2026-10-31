import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { FamilyMember } from '../types';
import { Plus, MapPin, Phone, Heart, ChevronRight } from 'lucide-react';

export const FamilyAssistancePage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { let active = true; api.getFamilyMembers().then(rows => { if (active) setMembers(rows); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, []);
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<any>('MOTHER');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;
    setError('');
    try {
      const newMember = await api.addFamilyMember({ name, relationship, phone, address });
      setMembers(previous => [...previous, newMember]); setShowAddModal(false);
      setName(''); setPhone(''); setAddress('');
    } catch (error) { setError(error instanceof Error ? error.message : 'The family member could not be saved.'); }
  };

  const handleCreateForMember = (member: FamilyMember) => {
    navigate('/app/request', {
      state: {
        familyMemberId: member.id,
        address: member.address,
      },
    });
  };

  return (
    <div className="designed-page family-assistance-page space-y-6 pb-24 pt-4">
      {error && <p role="alert" className="p-3 text-xs bg-rose-50 text-rose-800 rounded-xl">{error}</p>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Family Assistance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Arrange trusted service providers for your parents or family members anywhere in Sri Lanka.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Family Member
        </button>
      </div>

<section className="family-care-banner"><img src="/images/ease-family-v2.png" alt="Thoughtful everyday assistance for a Sri Lankan family" /><div><span className="design-eyebrow">CLOSE, EVEN FROM FAR AWAY</span><h2>For the people<br /><em>who mean home.</em></h2><p>Keep your loved ones’ details together and arrange a little help whenever they need it.</p></div></section>
      {/* Family Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div key={member.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {member.relationship}
                </span>
                <span className="text-[10px] text-slate-400">Added Family Address</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">{member.name}</h3>

              <div className="space-y-1 mt-3 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{member.address}</span>
                </p>
                {member.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>{member.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => handleCreateForMember(member)}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1 transition-all"
            >
              <span>Request Service for {member.name.split(' ')[0]}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Add Family Member</h3>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kamala Perera (Mother)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                >
                  <option value="MOTHER">Mother</option>
                  <option value="FATHER">Father</option>
                  <option value="SISTER">Sister</option>
                  <option value="BROTHER">Brother</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+94717778899"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full House Address</label>
                <textarea
                  rows={2}
                  required
                  placeholder="No. 88, Peradeniya Road, Kandy"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl shadow"
                >
                  Save Family Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
