'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Filter, CircleCheck, CircleX, Eye, AlertCircle, LogOut, Users, FileText } from 'lucide-react';
import DotGrid from '@/components/DotGrid';

interface Applicant {
  _id: string;
  name: string;
  email: string;
  university: string;
  branch?: string;
  age: number;
  linkedin?: string;
  github?: string;
  primary_skill: string;
  tech_stack: string[];
  experience_level: string;
  why_join: string;
  contribution: string;
  status?: 'approved' | 'rejected' | 'pending';
  createdAt: string;
}

interface TeamMember {
  _id: string;
  name: string;
  department: string;
  role: string;
  status: string;
  email?: string;
}

export default function AdminDashboard() {
  const { admin, logout, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSkill, setFilterSkill] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'applicants' | 'team'>('applicants');

  useEffect(() => {
    if (admin) {
      fetchData();
      
      // Poll for updates every 4 seconds
      const interval = setInterval(() => {
        fetchData(true);
      }, 4000);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [admin]);

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      await Promise.all([fetchApplicants(), fetchTeamMembers()]);
    } catch (err) {
      console.error(err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplicants(data);
      }
    } catch (err: any) {
      console.error('Error fetching applicants:', err);
      if (!error) setError('Failed to load data.');
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applicants/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // If approving, also create a TeamMember
      if (status === 'approved') {
        const applicant = applicants.find(app => app._id === id);
        if (applicant) {
          try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/add-member`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: applicant.name,
                department: applicant.primary_skill,
                role: applicant.experience_level || 'Member',
                email: applicant.email,
                linkedin: applicant.linkedin || '',
                github: applicant.github || '',
                status: 'approved',
              }),
            });
            // Immediately fetch team members to update the list
            fetchTeamMembers();
          } catch (teamError) {
            console.error('Error creating team member:', teamError);
            alert('Applicant approved, but failed to create team member automatically.');
          }
        }
      }
      
      // Update local state
      setApplicants(prev => 
        prev.map(app => app._id === id ? { ...app, status } : app)
      );
      
      if (selectedApplicant && selectedApplicant._id === id) {
        setSelectedApplicant({ ...selectedApplicant, status });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!admin) {
    return null; // Will be handled by AdminAuthGuard
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

  const handleTeamManagement = () => {
    if (isAuthenticated) {
      router.push('/admin/team');
    } else {
      router.push('/admin/login');
      // Ideally we would show a toast message here
      setError("Please login to access the admin panel.");
    }
  };

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
        <div className="sm:flex sm:items-center sm:justify-between mb-8 border-b border-black/10 pb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-black">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm font-light text-black/60">
              Manage recruitment applications and team members.
            </p>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:mt-0">
            <a
              href="/admin/team"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-black/80 transition-colors flex items-center gap-2"
            >
              Manage Team
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black/60 hover:text-black border border-black/20 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'applicants' 
                ? 'bg-black text-white' 
                : 'bg-white text-black/60 hover:bg-black/5'
            }`}
          >
            <FileText className="h-4 w-4" />
            Applications ({applicants.filter(a => !a.status || a.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'team' 
                ? 'bg-black text-white' 
                : 'bg-white text-black/60 hover:bg-black/5'
            }`}
          >
            <Users className="h-4 w-4" />
            Team Members ({teamMembers.length})
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>
        ) : (
          <div className="lg:flex lg:gap-8">
            <div className={`${selectedApplicant && activeTab === 'applicants' ? 'lg:w-2/3' : 'lg:w-full'}`}>
              
              {/* Applicants View */}
              {activeTab === 'applicants' && (
                <>
                  <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4">
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
                    <div className="text-sm font-light text-black/60">
                      {filteredApplicants.length} applications
                    </div>
                  </div>

                  <div className="overflow-hidden bg-white shadow-sm border border-black/5">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-black/10">
                        <thead className="bg-black/5">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">University</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Skill</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Status</th>
                            <th className="relative px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                          {filteredApplicants.map((applicant) => (
                            <tr
                              key={applicant._id}
                              className="hover:bg-black/5 cursor-pointer transition-colors"
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
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-widest ${
                                  applicant.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  applicant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {applicant.status || 'pending'}
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
                  </div>
                </>
              )}

              {/* Team Members View */}
              {activeTab === 'team' && (
                <div className="overflow-hidden bg-white shadow-sm border border-black/5">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-black/10">
                      <thead className="bg-black/5">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/10">
                        {teamMembers.map((member) => (
                          <tr key={member._id} className="hover:bg-black/5 transition-colors">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-black sm:pl-6">
                              {member.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-light text-black/60">
                              {member.role}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-light text-black/60">
                              {member.department}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-light text-black/60">
                              {member.email || '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-widest ${
                                member.status === 'approved' ? 'bg-green-100 text-green-800' :
                                member.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {member.status || 'approved'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {teamMembers.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-black/60">No team members found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Detail View Section (Only for Applicants) */}
            {selectedApplicant && activeTab === 'applicants' && (
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
                        Status: {selectedApplicant.status || 'pending'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 border-y border-black/10 py-6">
                      <button
                        onClick={() => updateStatus(selectedApplicant._id, 'approved')}
                        disabled={updatingId === selectedApplicant._id || selectedApplicant.status === 'approved'}
                        className="flex-1 flex items-center justify-center gap-2 bg-black px-4 py-3 text-xs font-medium text-white transition-transform hover:scale-105 uppercase tracking-widest disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                      >
                        {updatingId === selectedApplicant._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleCheck className="h-4 w-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApplicant._id, 'rejected')}
                        disabled={updatingId === selectedApplicant._id || selectedApplicant.status === 'rejected'}
                        className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-black px-4 py-3 text-xs font-medium text-black transition-transform hover:scale-105 uppercase tracking-widest disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                      >
                        {updatingId === selectedApplicant._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleX className="h-4 w-4" />}
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
                        <dt className="text-xs font-medium text-black uppercase tracking-widest mb-2">Primary Skill</dt>
                        <dd className="text-sm font-light text-black/80">{selectedApplicant.primary_skill}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-xs font-medium text-black uppercase tracking-widest mb-2">Experience</dt>
                        <dd className="text-sm font-light text-black/80">{selectedApplicant.experience_level || 'N/A'}</dd>
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
                          {selectedApplicant.tech_stack && selectedApplicant.tech_stack.length > 0 ? (
                            selectedApplicant.tech_stack.map((tech: string) => (
                              <span key={tech.trim()} className="inline-flex items-center px-3 py-1 text-xs font-medium text-black/80 bg-yellow-100/50">
                                {tech.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm font-light text-black/40">None specified</span>
                          )}
                        </dd>
                      </div>

                      {/* Text Areas */}
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-medium text-black uppercase tracking-widest mb-3">Why join us?</dt>
                        <dd className="text-sm font-light leading-relaxed text-black/80 bg-yellow-100/50 p-4">{selectedApplicant.why_join || 'N/A'}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-medium text-black uppercase tracking-widest mb-3">Contribution</dt>
                        <dd className="text-sm font-light leading-relaxed text-black/80 bg-yellow-100/50 p-4">{selectedApplicant.contribution || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}