import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { profileService } from '../services/profile.service';
import { careerService } from '../services/career.service';
import { skillService } from '../services/skill.service';
import { useAuth } from '../hooks/useAuth';
import { Skill } from '../types/skill';
import { CareerRole } from '../types/career';
import { User, GraduationCap, Target, Award, Briefcase, Clock, Plus, Trash2, CheckCircle2, Search } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<CareerRole[]>([]);
  const [matchingSkills, setMatchingSkills] = useState<Skill[]>([]);

  // Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  const [educationLevel, setEducationLevel] = useState('Bachelor');
  const [institution, setInstitution] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');

  const [targetCareerId, setTargetCareerId] = useState('');
  const [yearsExperience, setYearsExperience] = useState<number>(0);
  const [weeklyHours, setWeeklyHours] = useState<number>(10);

  // Skill Items State
  const [selectedSkills, setSelectedSkills] = useState<
    { skill_id?: string; skill_name: string; self_reported_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'; category?: string }[]
  >([
    { skill_name: 'Python', self_reported_level: 'intermediate', category: 'Programming Languages' },
    { skill_name: 'JavaScript', self_reported_level: 'intermediate', category: 'Programming Languages' },
  ]);

  const [newSkillQuery, setNewSkillQuery] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [isSearchingSkills, setIsSearchingSkills] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<
    { name: string; description: string; role: string; github_url: string }[]
  >([
    { name: 'Portfolio Website', description: 'Personal developer showcase built with React & Tailwind CSS', role: 'Frontend Developer', github_url: 'https://github.com/example/portfolio' },
  ]);

  useEffect(() => {
    // Load dynamic Target Career Roles from API
    careerService.getCareers().then((res) => {
      if (res.data) setAvailableRoles(res.data);
    }).catch(() => {});
  }, []);

  // Live Autocomplete Search for Skills
  useEffect(() => {
    if (!newSkillQuery.trim()) {
      setMatchingSkills([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearchingSkills(true);
      skillService.getSkills(newSkillQuery)
        .then((res) => {
          if (res.data) setMatchingSkills(res.data);
        })
        .catch(() => {})
        .finally(() => setIsSearchingSkills(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [newSkillQuery]);

  const handleSelectReferenceSkill = (skill: Skill) => {
    if (!selectedSkills.some(s => s.skill_name.toLowerCase() === skill.name.toLowerCase())) {
      setSelectedSkills(prev => [
        ...prev,
        { skill_id: skill.id, skill_name: skill.name, self_reported_level: selectedSkillLevel, category: skill.category }
      ]);
    }
    setNewSkillQuery('');
    setMatchingSkills([]);
  };

  const handleAddCustomSkill = () => {
    if (!newSkillQuery.trim()) return;
    if (!selectedSkills.some(s => s.skill_name.toLowerCase() === newSkillQuery.trim().toLowerCase())) {
      setSelectedSkills(prev => [
        ...prev,
        { skill_name: newSkillQuery.trim(), self_reported_level: selectedSkillLevel, category: 'General' }
      ]);
    }
    setNewSkillQuery('');
    setMatchingSkills([]);
  };

  const removeSkill = (index: number) => {
    setSelectedSkills(prev => prev.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects(prev => [...prev, { name: '', description: '', role: '', github_url: '' }]);
  };

  const updateProject = (index: number, field: string, value: string) => {
    setProjects(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removeProject = (index: number) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await profileService.updateProfile({
        firstName,
        lastName,
        headline,
        bio,
        location,
        education_level: educationLevel,
        institution,
        field_of_study: fieldOfStudy,
        target_career_id: targetCareerId || undefined,
        years_of_experience: yearsExperience,
        weekly_learning_hours: weeklyHours,
        skills: selectedSkills,
        projects: projects.filter(p => p.name.trim().length > 0),
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save profile onboarding', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Step Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Build Your SkillCompass Profile</h1>
        <p className="text-sm text-neutral-600">Select target career roles & demonstrated skills from our reference catalog.</p>
        
        {/* Step Tabs */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {[
            { num: 1, label: 'Basic Info', icon: User },
            { num: 2, label: 'Education', icon: GraduationCap },
            { num: 3, label: 'Career Goal', icon: Target },
            { num: 4, label: 'Skills', icon: Award },
            { num: 5, label: 'Projects', icon: Briefcase },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Card className="bg-white border-neutral-200 shadow-xs">
        {/* Step 1: Basic Information */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-neutral-900" /> Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-neutral-700 mb-1">Professional Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Computer Science Student & Aspiring Full Stack Engineer"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-700 mb-1">Bio / Summary</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Brief summary of your learning journey..."
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-neutral-900" /> Academic Background
            </h3>
            <div>
              <label className="block text-xs text-neutral-700 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="High School">High School</option>
                <option value="Associate">Associate Degree</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="Doctorate">Doctorate (Ph.D.)</option>
                <option value="Self-Taught">Self-Taught / Bootcamp</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-neutral-700 mb-1">Institution / University</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-700 mb-1">Field of Study / Major</label>
              <input
                type="text"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="e.g. Computer Science & Software Engineering"
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        )}

        {/* Step 3: Target Career Goal (Dynamic Reference Data) */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-neutral-900" /> Target Career Role (Reference Taxonomy)
            </h3>
            <div>
              <label className="block text-xs text-neutral-700 mb-1">Select Target Role from Database</label>
              <select
                value={targetCareerId}
                onChange={(e) => setTargetCareerId(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
              >
                <option value="">-- Select Reference Target Role --</option>
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} ({role.category || 'General'})
                  </option>
                ))}
              </select>
              <p className="text-xs text-neutral-500 mt-1">
                Roles loaded dynamically from reference database taxonomy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs text-neutral-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-900" /> Weekly Learning Commitment (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-700 mb-1">Years of Practical Experience</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Skills Inventory (Live Autocomplete Reference Search) */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-neutral-900" /> Demonstrated Skills Inventory
            </h3>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSkills.map((s, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-lg text-xs"
                >
                  <span className="font-semibold text-neutral-900">{s.skill_name}</span>
                  {s.category && <span className="text-neutral-500 text-[10px]">[{s.category}]</span>}
                  <span className="text-neutral-800 capitalize font-mono">({s.self_reported_level})</span>
                  <button onClick={() => removeSkill(idx)} className="text-neutral-400 hover:text-rose-600 transition ml-1 cursor-pointer">
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Dynamic Search / Autocomplete Box */}
            <div className="relative space-y-2">
              <label className="block text-xs text-neutral-700">Search & Select Skills from Reference Catalog</label>
              <div className="flex items-center gap-2 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <div className="relative flex-grow">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Type to search (e.g. React, Python, PostgreSQL, AWS)..."
                    value={newSkillQuery}
                    onChange={(e) => setNewSkillQuery(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-lg pl-9 pr-8 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                  {isSearchingSkills && (
                    <div className="absolute right-2.5 top-2.5 w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>

                <select
                  value={selectedSkillLevel}
                  onChange={(e) => setSelectedSkillLevel(e.target.value as any)}
                  className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none"
                >
                  <option value="beginner">1 - Beginner</option>
                  <option value="elementary">2 - Elementary</option>
                  <option value="intermediate">3 - Intermediate</option>
                  <option value="advanced">4 - Advanced</option>
                  <option value="expert">5 - Expert</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition shrink-0 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {matchingSkills.length > 0 && (
                <div className="absolute z-20 w-full bg-white border border-neutral-200 rounded-xl shadow-xl max-h-48 overflow-y-auto mt-1 p-1">
                  {matchingSkills.map((sk) => (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => handleSelectReferenceSkill(sk)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-neutral-100 flex items-center justify-between text-neutral-800 transition cursor-pointer"
                    >
                      <span className="font-medium text-neutral-900">{sk.name}</span>
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200">
                        {sk.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Projects Showcase */}
        {activeStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-neutral-900 mb-4 border-b border-neutral-200 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-neutral-900" /> Student Projects Showcase
              </span>
              <button
                type="button"
                onClick={addProject}
                className="text-xs text-neutral-900 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </h3>

            {projects.map((proj, idx) => (
              <div key={idx} className="bg-neutral-50 border border-neutral-200 p-4 rounded-xl space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeProject(idx)}
                  className="absolute top-3 right-3 text-neutral-400 hover:text-rose-600 cursor-pointer"
                  title="Remove Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(idx, 'name', e.target.value)}
                      placeholder="My Web App"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1">Your Role</label>
                    <input
                      type="text"
                      value={proj.role}
                      onChange={(e) => updateProject(idx, 'role', e.target.value)}
                      placeholder="Sole Developer"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-neutral-700 mb-1">GitHub / Code URL</label>
                  <input
                    type="url"
                    value={proj.github_url}
                    onChange={(e) => updateProject(idx, 'github_url', e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-700 mb-1">Project Description</label>
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    rows={2}
                    placeholder="Brief description of tech stack and features built..."
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step Navigation Bar */}
        <div className="mt-8 pt-4 border-t border-neutral-200 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={activeStep === 1}
            onClick={() => setActiveStep(prev => prev - 1)}
          >
            Back
          </Button>

          {activeStep < 5 ? (
            <Button type="button" onClick={() => setActiveStep(prev => prev + 1)}>
              Next Step
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Profile...' : 'Complete Onboarding & Go to Dashboard'}</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

