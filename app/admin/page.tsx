'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTermsProtection } from '@/hooks/useTermsProtection';
import { databases, storage, Query } from '@/lib/appwrite';
import { Models } from 'appwrite';
import { motion } from 'motion/react';
import { Loader2, Search, Filter, CircleCheck, CircleX, Eye, AlertCircle } from 'lucide-react';
import DotGrid from '@/components/DotGrid';

interface Applicant extends Models.Document {
  name: string;
  university: string;
  roll_number?: string;
  branch?: string;
  age: number;
  email: string;
  linkedin?: string;
  github?: string;
  primary_skill: string;
  tech_stack: string[];
  experience_level: string;
  why_join: string;
  ambition: string;
  contribution: string;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string;
  photoId?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { isAllowed: termsAccepted, isLoading: termsLoading } = useTermsProtection();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSkill, setFilterSkill] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin && termsAccepted && !termsLoading) {
      fetchApplicants();
    }
  }, [isAdmin, termsAccepted, termsLoading]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
        [Query.orderDesc('created_at')]
      );
      setApplicants(response.documents as unknown as Applicant[]);
    } catch (err: any) {
      console.error('Error fetching applicants:', err);
      setError('Failed to load applicants. Check your Appwrite configuration.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setUpdatingId(id);
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
        id,
        { status }
      );
      
      // Update local state
      setApplicants(prev => 
        prev.map(app => app.$id === id ? { ...app, status } as Applicant : app)
      );
      
      if (selectedApplicant && selectedApplicant.$id === id) {
        setSelectedApplicant({ ...selectedApplicant, status } as Applicant);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || termsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-yellow-50">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-yellow-50 px-4 text-center">
        <div className="rounded-full bg-black/5 p-4 mb-6">
          <AlertCircle className="h-10 w-10 text-black" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-black">Access Denied</h1>
        <p className="mt-4 text-black/60 font-light max-w-md">
          You do not have permission to view this page. This area is restricted to administrators only.
        </p>
      </div>
    );
  }

  const filteredApplicants = applicants.filter(app => {
    const matchesSkill = filterSkill ? app.primary_skill === filterSkill : true;
    const matchesSearch = searchQuery 
      ? app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        app.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSkill && matchesSearch;
  });

  const uniqueSkills = Array.from(new Set(applicants.map(app => app.primary_skill).filter(Boolean)));

  return (
    <div className="min-h-screen bg-yellow-50 py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <DotGrid
            dotSize={11}
            gap={10}
            baseColor="#271E37"
            activeColor="#66eaad"
            proximity={330}
            shockRadius={170}
            shockStrength={5}
            resistance={1100}
            returnDuration={2.7} style={undefined}          />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:flex sm:items-center sm:justify-between mb-12 border-b border-black/10 pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-black">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm font-light text-black/60">
              Manage recruitment applications and team members.
            </p>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:mt-0">
            {/* Avatar Group */}
            {applicants.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3 overflow-hidden">
                  {applicants.slice(0, 5).map((app) => (
                    <div key={app.$id} className="inline-block h-10 w-10 rounded-full ring-2 ring-yellow-50 overflow-hidden bg-black/5">
                      {app.photoId ? (
                        <img 
                          src={storage.getFilePreview(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "profile-photos", app.photoId).toString()} 
                          alt={app.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/10 text-xs font-medium text-black uppercase">
                          {app.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-sm font-light text-black/60">
                  {applicants.length} Total
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-black/40" />
              </div>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full border-0 border-b border-black/20 bg-transparent py-2 pl-10 pr-3 text-black focus:border-black focus:ring-0 sm:text-sm font-light transition-colors placeholder:text-black/40"
              />
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Filter className="h-4 w-4 text-black/40" />
              </div>
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="block w-full border-0 border-b border-black/20 bg-transparent py-2 pl-10 pr-10 text-black focus:border-black focus:ring-0 sm:text-sm font-light transition-colors appearance-none"
              >
                <option value="">All Skills</option>
                {uniqueSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-black/5 p-6 border-l-2 border-black">
            <p className="text-sm font-light text-black/80">{error}</p>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Table Section */}
          <div className={`flex-1 ${selectedApplicant ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}>
            <div className="overflow-hidden bg-yellow-100/50 border border-black/10">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-black/40" />
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-black/40">
                  <Search className="mb-4 h-8 w-8 opacity-20" />
                  <p className="font-light">No applicants found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-black/5">
                    <thead className="bg-black/5">
                      <tr>
                        <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-medium text-black uppercase tracking-widest sm:pl-6">Name</th>
                        <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-black uppercase tracking-widest">Email</th>
                        <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-black uppercase tracking-widest">University</th>
                        <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-black uppercase tracking-widest">Skill</th>
                        <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-black uppercase tracking-widest">Experience</th>
                        <th scope="col" className="px-3 py-4 text-left text-xs font-medium text-black uppercase tracking-widest">Status</th>
                        <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 bg-transparent">
                      {filteredApplicants.map((applicant) => (
                        <tr 
                          key={applicant.$id} 
                          className={`hover:bg-black/5 transition-colors cursor-pointer ${selectedApplicant?.$id === applicant.$id ? 'bg-black/5 border-l-2 border-black' : 'border-l-2 border-transparent'}`}
                          onClick={() => setSelectedApplicant(applicant)}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-black sm:pl-6">
                            {applicant.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-light text-black/60">
                            {applicant.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-light text-black/60">
                            {applicant.university}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-light text-black/60">
                            <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-black/80 bg-black/5">
                              {applicant.primary_skill}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-light text-black/60">
                            {applicant.experience_level.split(' ')[0]}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-widest ${
                              applicant.status === 'approved' ? 'bg-green-100 text-green-800' :
                              applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {applicant.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApplicant(applicant);
                              }}
                              className="text-black/40 hover:text-black flex items-center gap-2 ml-auto uppercase tracking-widest text-xs transition-colors"
                            >
                              <Eye className="h-4 w-4" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Detail View Section */}
          {selectedApplicant && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/3"
            >
              <div className="bg-black/5 p-8 sticky top-32">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-black">{selectedApplicant.name}</h3>
                    <p className="text-sm font-light text-black/60 mt-1">{selectedApplicant.email}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedApplicant(null)}
                    className="text-black/40 hover:text-black transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <CircleX className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-8 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                  
                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium uppercase tracking-widest ${
                      selectedApplicant.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedApplicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      Status: {selectedApplicant.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 border-y border-black/10 py-6">
                    <button
                      onClick={() => updateStatus(selectedApplicant.$id, 'approved')}
                      disabled={updatingId === selectedApplicant.$id || selectedApplicant.status === 'approved'}
                      className="flex-1 flex items-center justify-center gap-2 bg-black px-4 py-3 text-xs font-medium text-white transition-transform hover:scale-105 uppercase tracking-widest disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {updatingId === selectedApplicant.$id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleCheck className="h-4 w-4" />}
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedApplicant.$id, 'rejected')}
                      disabled={updatingId === selectedApplicant.$id || selectedApplicant.status === 'rejected'}
                      className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-black px-4 py-3 text-xs font-medium text-black transition-transform hover:scale-105 uppercase tracking-widest disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {updatingId === selectedApplicant.$id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleX className="h-4 w-4" />}
                      Reject
                    </button>
                  </div>

                  {/* Details Grid */}
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-2">University</dt>
                      <dd className="text-sm font-light text-black/80">{selectedApplicant.university}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-2">Branch</dt>
                      <dd className="text-sm font-light text-black/80">{selectedApplicant.branch || 'N/A'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-2">Roll Number</dt>
                      <dd className="text-sm font-light text-black/80">{selectedApplicant.roll_number || 'N/A'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-2">Primary Skill</dt>
                      <dd className="text-sm font-light text-black/80">{selectedApplicant.primary_skill}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-2">Experience</dt>
                      <dd className="text-sm font-light text-black/80">{selectedApplicant.experience_level}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-2">Age</dt>
                      <dd className="text-sm font-light text-black/80">{selectedApplicant.age}</dd>
                    </div>
                    
                    {/* Links */}
                    <div className="sm:col-span-2 flex gap-6">
                      {selectedApplicant.linkedin && (
                        <a href={selectedApplicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium uppercase tracking-widest text-black hover:text-black/60 transition-colors">
                          LinkedIn ↗
                        </a>
                      )}
                      {selectedApplicant.github && (
                        <a href={selectedApplicant.github} target="_blank" rel="noopener noreferrer" className="text-sm font-medium uppercase tracking-widest text-black hover:text-black/60 transition-colors">
                          GitHub ↗
                        </a>
                      )}
                    </div>

                    {/* Tech Stack */}
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-4">Tech Stack</dt>
                      <dd className="flex flex-wrap gap-2">
                        {selectedApplicant.tech_stack?.map((tech: string) => (
                          <span key={tech} className="inline-flex items-center px-3 py-1 text-xs font-medium text-black/80 bg-yellow-100/50">
                            {tech}
                          </span>
                        )) || <span className="text-sm font-light text-black/40">None specified</span>}
                      </dd>
                    </div>

                    {/* Text Areas */}
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-3">Why join us?</dt>
                      <dd className="text-sm font-light leading-relaxed text-black/80 bg-yellow-100/50 p-4">{selectedApplicant.why_join}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-3">Ambition</dt>
                      <dd className="text-sm font-light leading-relaxed text-black/80 bg-yellow-100/50 p-4">{selectedApplicant.ambition}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium text-black uppercase tracking-widest mb-3">Contribution</dt>
                      <dd className="text-sm font-light leading-relaxed text-black/80 bg-yellow-100/50 p-4">{selectedApplicant.contribution}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
