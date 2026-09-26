import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { profileService } from '../services/profile.service';
import { getLatestSkillIntelligence } from '../services/ai.service';
import { getAllMarketSkills } from '../services/market.service';
import { StudentProfileData, UserSkillItem } from '../types';
import { SkillIntelligenceResponse } from '../types/ai';
import { MarketSkillSignal } from '../types/market';
import {
  Award,
  GitGraph,
  CheckCircle2,
  Plus,
  Search,
  BookOpen,
  TrendingUp,
  X,
  Target,
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'career' | 'user_skill' | 'skill_gap' | 'recommended_skill';
  category?: string;
  selfLevel?: string;
  verifiedLevel?: string;
  requiredLevel?: string;
  importance?: string;
  marketSignal?: MarketSkillSignal;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}

export const SkillsPage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<SkillIntelligenceResponse | null>(null);
  const [marketSignals, setMarketSignals] = useState<MarketSkillSignal[]>([]);
  const [activeTab, setActiveTab] = useState<'graph' | 'inventory'>('graph');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add skill modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [savingSkill, setSavingSkill] = useState<boolean>(false);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [profileRes, aiRes, marketSignalsData] = await Promise.all([
          profileService.getProfile(),
          getLatestSkillIntelligence().catch(() => null),
          getAllMarketSkills().catch(() => []),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (aiRes) setAiAnalysis(aiRes);
        if (Array.isArray(marketSignalsData)) setMarketSignals(marketSignalsData);
      } catch (err) {
        console.error('Error loading skills page data:', err);
      }
    };

    loadAll();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setSavingSkill(true);
    try {
      const updatedSkills: UserSkillItem[] = [
        ...(profile?.skills || []),
        {
          skill_name: newSkillName.trim(),
          self_reported_level: newSkillLevel,
        },
      ];

      await profileService.updateProfile({
        skills: updatedSkills,
      });

      // Refresh profile data
      const refreshRes = await profileService.getProfile();
      if (refreshRes.data) setProfile(refreshRes.data);

      setShowAddModal(false);
      setNewSkillName('');
    } catch (err) {
      console.error('Failed to add skill:', err);
    } finally {
      setSavingSkill(false);
    }
  };

  // Build SVG Skill Graph Nodes & Edges from real stored relationships
  const buildGraph = (): { nodes: GraphNode[]; edges: GraphEdge[] } => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const careerName = profile?.targetCareer?.name || 'Target Career';
    const careerNodeId = 'node-career';

    // 1. Central Career Node
    nodes.push({
      id: careerNodeId,
      label: careerName,
      type: 'career',
      x: 350,
      y: 50,
    });

    const userSkills = profile?.skills || [];
    const gaps = aiAnalysis?.skillGaps || [];
    const recommendations = aiAnalysis?.recommendedSkills || [];

    // Helper map for market signals
    const marketMap = new Map<string, MarketSkillSignal>();
    marketSignals.forEach((m) => marketMap.set(m.slug.toLowerCase(), m));

    // 2. User Skills Column (Left: x = 120)
    userSkills.forEach((s, idx) => {
      const sName = s.skill_name || 'Skill';
      const nodeId = `user-skill-${idx}`;
      const signal = marketMap.get(sName.toLowerCase());
      nodes.push({
        id: nodeId,
        label: sName,
        type: 'user_skill',
        category: s.category || 'Demonstrated Skill',
        selfLevel: s.self_reported_level,
        verifiedLevel: s.verified_level || undefined,
        marketSignal: signal,
        x: 120,
        y: 120 + idx * 75,
      });

      edges.push({ from: careerNodeId, to: nodeId, label: 'demonstrates' });
    });

    // 3. Skill Gaps Column (Middle: x = 380)
    gaps.forEach((g, idx) => {
      const nodeId = `gap-${idx}`;
      const signal = marketMap.get(g.skillName.toLowerCase());
      nodes.push({
        id: nodeId,
        label: g.skillName,
        type: 'skill_gap',
        category: 'Skill Gap',
        selfLevel: String(g.currentLevel),
        requiredLevel: String(g.requiredLevel),
        importance: g.importance,
        marketSignal: signal,
        x: 380,
        y: 140 + idx * 80,
      });

      edges.push({ from: careerNodeId, to: nodeId, label: 'requires' });
    });

    // 4. Recommended Next Skills Column (Right: x = 620)
    recommendations.forEach((r, idx) => {
      const nodeId = `rec-${idx}`;
      const signal = marketMap.get(r.skillName.toLowerCase());
      nodes.push({
        id: nodeId,
        label: r.skillName,
        type: 'recommended_skill',
        category: 'AI Recommendation',
        importance: r.priority,
        marketSignal: signal,
        x: 620,
        y: 130 + idx * 85,
      });

      // Link matching gap to recommendation if available
      const matchingGapIdx = gaps.findIndex(
        (g) => g.skillName.toLowerCase() === r.skillName.toLowerCase()
      );
      if (matchingGapIdx !== -1) {
        edges.push({ from: `gap-${matchingGapIdx}`, to: nodeId, label: 'recommend' });
      } else {
        edges.push({ from: careerNodeId, to: nodeId, label: 'recommended' });
      }
    });

    return { nodes, edges };
  };

  const { nodes, edges } = buildGraph();

  const filteredUserSkills = (profile?.skills || []).filter((s) =>
    (s.skill_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-900">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Skills Matrix & Knowledge Graph
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600">
              Interactive structural map of demonstrated skills, requirements, gaps, and market demand.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center border-b border-neutral-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('graph')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'graph'
              ? 'border-neutral-900 text-neutral-900 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <GitGraph className="w-4 h-4" />
          <span>Interactive Skill Graph</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-neutral-900 text-neutral-900 font-bold'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Skills Inventory List ({profile?.skills?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Visual Interactive Skill Graph */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-4 bg-neutral-50 border-neutral-200 overflow-x-auto min-h-[500px] flex flex-col justify-between relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                Click any node to inspect level requirements & market demand
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-neutral-900 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 inline-block" /> Career
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> User Skill
                </span>
                <span className="flex items-center gap-1 text-amber-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> Skill Gap
                </span>
                <span className="flex items-center gap-1 text-neutral-700 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" /> Recommendation
                </span>
              </div>
            </div>

            {/* SVG Renderer */}
            <svg viewBox="0 0 750 480" className="w-full h-auto max-h-[460px] select-none">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#a3a3a3" />
                </marker>
              </defs>

              {/* Render Edges */}
              {edges.map((edge, idx) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                return (
                  <line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#d4d4d4"
                    strokeWidth="1.5"
                    strokeDasharray={edge.label === 'recommend' ? '4 3' : undefined}
                    markerEnd="url(#arrow)"
                  />
                );
              })}

              {/* Render Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                let fillBg = '#ffffff';
                let strokeColor = '#d4d4d4';
                let textColor = '#111111';

                if (node.type === 'career') {
                  fillBg = '#111111';
                  strokeColor = '#2a2a2a';
                  textColor = '#ffffff';
                } else if (node.type === 'user_skill') {
                  fillBg = '#f0fdf4';
                  strokeColor = '#16a34a';
                  textColor = '#15803d';
                } else if (node.type === 'skill_gap') {
                  fillBg = '#fffbeb';
                  strokeColor = '#d97706';
                  textColor = '#b45309';
                } else if (node.type === 'recommended_skill') {
                  fillBg = '#f5f5f5';
                  strokeColor = '#525252';
                  textColor = '#171717';
                }

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <rect
                      x={node.x - 70}
                      y={node.y - 20}
                      width="140"
                      height="40"
                      rx="8"
                      fill={fillBg}
                      stroke={isSelected ? '#111111' : strokeColor}
                      strokeWidth={isSelected ? '3' : '1.5'}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {node.label.length > 18 ? `${node.label.substring(0, 16)}...` : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Card>

          {/* Node Inspector Detail Panel */}
          <Card className="p-6 border-neutral-200 bg-white flex flex-col justify-between shadow-xs">
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                      {selectedNode.category || 'Node Inspection'}
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{selectedNode.label}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-neutral-400 hover:text-neutral-900 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-neutral-100">
                    <span className="text-neutral-500">Node Type:</span>
                    <span className="font-semibold text-neutral-900 capitalize">
                      {selectedNode.type.replace('_', ' ')}
                    </span>
                  </div>

                  {selectedNode.selfLevel && (
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-500">Self-Reported Level:</span>
                      <span className="font-semibold text-neutral-900 capitalize">
                        {selectedNode.selfLevel}
                      </span>
                    </div>
                  )}

                  {selectedNode.verifiedLevel && (
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-500">Verified Assessment:</span>
                      <span className="font-semibold text-emerald-700 capitalize flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {selectedNode.verifiedLevel}
                      </span>
                    </div>
                  )}

                  {selectedNode.requiredLevel && (
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-500">Target Required Level:</span>
                      <span className="font-semibold text-amber-700 capitalize">
                        {selectedNode.requiredLevel}
                      </span>
                    </div>
                  )}

                  {selectedNode.importance && (
                    <div className="flex justify-between py-1 border-b border-neutral-100">
                      <span className="text-neutral-500">Importance / Priority:</span>
                      <span className="font-semibold text-neutral-900 capitalize">
                        {selectedNode.importance}
                      </span>
                    </div>
                  )}

                  {selectedNode.marketSignal ? (
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5 mt-3">
                      <div className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Market Dataset Signal</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Mention Rate:</span>
                        <span className="font-bold text-neutral-900 font-mono">
                          {selectedNode.marketSignal.mentionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Trend:</span>
                        <span className="font-semibold text-neutral-800 capitalize">
                          {selectedNode.marketSignal.trendDirection}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500 pt-2">
                      Market mention benchmark signal processing available in Market Trends section.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500 my-auto">
                <Target className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-900">No Skill Selected</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Click any node on the graph to inspect detailed requirements, levels, and market signals.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 2: Skills Inventory List */}
      {activeTab === 'inventory' && (
        <Card>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills inventory..."
                className="w-full bg-white border border-neutral-200 text-neutral-900 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:border-neutral-900 focus:outline-none"
              />
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              Showing {filteredUserSkills.length} of {profile?.skills?.length || 0} skills
            </span>
          </div>

          {filteredUserSkills.length === 0 ? (
            <p className="text-xs text-neutral-500 py-8 text-center">
              No skills found matching "{searchQuery}".
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUserSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-neutral-200 rounded-xl space-y-2 hover:border-neutral-300 transition shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{sk.skill_name}</h4>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {sk.category || 'General Skill'}
                      </span>
                    </div>
                    {sk.verified_level && (
                      <span className="p-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-[10px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Self-Reported:</span>
                    <span className="font-semibold text-neutral-800 capitalize">
                      {sk.self_reported_level}
                    </span>
                  </div>

                  {sk.verified_level && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Verified Level:</span>
                      <span className="font-semibold text-emerald-700 capitalize">
                        {sk.verified_level}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-base font-bold text-neutral-900">Add Demonstrated Skill</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. TypeScript, React, Docker..."
                  className="w-full bg-white border border-neutral-200 text-neutral-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Self-Reported Proficiency Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e: any) => setNewSkillLevel(e.target.value)}
                  className="w-full bg-white border border-neutral-200 text-neutral-900 text-xs rounded-xl px-3.5 py-2.5 focus:border-neutral-900 focus:outline-none capitalize"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSkill}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  {savingSkill ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

