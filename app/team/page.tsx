'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Linkedin, Github } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TeamMember {
  _id: string;
  name: string;
  department: string;
  role: string;
  avatar: string;
  linkedin: string;
  github: string;
}

const departments = ['All', 'Development', 'Marketing', 'Design', 'Management', 'Research'];

export default function TeamPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, selectedDepartment]);

  const fetchTeamMembers = async () => {
    try {
      // Fetch only approved members
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team/members?status=approved`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(member => member.department === selectedDepartment);
    }

    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  };

  const TeamMemberCard = ({ member }: { member: TeamMember }) => (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-black/5 p-6 text-center group"
      whileHover={{ 
        y: -8,
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="mb-4">
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-black/10"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto bg-black/5 flex items-center justify-center text-black/40 text-2xl font-medium">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-medium text-black mb-1">{member.name}</h3>
      
      <div className="inline-block px-3 py-1 bg-black/5 text-black/70 text-xs font-medium rounded-full mb-2">
        {member.department}
      </div>
      
      <p className="text-sm text-black/60 mb-4 leading-relaxed">{member.role}</p>
      
      <div className="flex justify-center gap-3">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          >
            <Linkedin className="w-4 h-4 text-black/60" />
          </a>
        )}
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          >
            <Github className="w-4 h-4 text-black/60" />
          </a>
        )}
      </div>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-black/5 p-6 animate-pulse">
          <div className="w-24 h-24 rounded-full mx-auto bg-black/10 mb-4" />
          <div className="h-4 bg-black/10 rounded mb-2 mx-auto w-3/4" />
          <div className="h-3 bg-black/10 rounded mb-2 mx-auto w-1/2" />
          <div className="h-3 bg-black/10 rounded mb-4 mx-auto w-full" />
          <div className="flex justify-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/10" />
            <div className="w-8 h-8 rounded-full bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-black mb-4">Our Team</h1>
          <p className="text-lg text-black/60 max-w-2xl mx-auto">
            Meet the talented individuals who make our mission possible
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/40 w-4 h-4" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-black/10 rounded-lg bg-white text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-black text-white'
                      : 'bg-white text-black/60 hover:bg-black/5 border border-black/10'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <TeamMemberCard key={member._id} member={member} />
            ))}
          </div>
        )}

        {!loading && filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-black/60">No team members found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}