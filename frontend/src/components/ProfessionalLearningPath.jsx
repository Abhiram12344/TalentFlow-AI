import React, { useState, useEffect } from 'react';
import { BookOpen, Code, CheckCircle, Circle, Flame, HelpCircle, ArrowRight, Zap, Sparkles, Send } from 'lucide-react';

export default function ProfessionalLearningPath({ apiBase }) {
  const [activeDomain, setActiveDomain] = useState('dsa');
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedItems, setCompletedItems] = useState({});
  const [streakCount, setStreakCount] = useState(5);

  // Socratic Practice Tutor Modal State
  const [tutorModalOpen, setTutorModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [candidateDoubt, setCandidateDoubt] = useState('');
  const [tutorResponse, setTutorResponse] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(false);

  const fetchDomainPath = async (domain) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/learning/path/${domain}`);
      const data = await res.json();
      setCurriculum(data.curriculum);
    } catch (e) {
      console.warn("Failed to fetch domain path, using fallback curriculum:", e);
      // Fallback domain sheets
      const fallbacks = {
        dsa: {
          title: "DSA Sheet & Problem Solving",
          description: "TakeUForward Striver Inspired A2Z DSA Curriculum — Arrays to Advanced Dynamic Programming & Graphs.",
          topics: [
            { day: 1, title: "Arrays & Pointers Optimization", daily_learn: "Kadane's Algorithm, Two Pointers Technique, and Sliding Window Optimization.", daily_practice: "Find Maximum Subarray Sum & 3Sum Problem (LeetCode Medium)", difficulty: "Medium", time_minutes: 45 },
            { day: 2, title: "Hashing & Frequency Maps", daily_learn: "Hash Table Collision Resolution, Subarray with Given Sum, and Frequency Counting.", daily_practice: "Longest Consecutive Sequence in O(N) Time", difficulty: "Medium", time_minutes: 45 },
            { day: 3, title: "Binary Search & Search Space", daily_learn: "Lower Bound, Upper Bound, Search on Rotated Sorted Array, Search Space Reduction.", daily_practice: "Book Allocation Problem & Capacity To Ship Packages Within N Days", difficulty: "Hard", time_minutes: 60 },
            { day: 4, title: "Linked Lists & Fast/Slow Pointers", daily_learn: "Cycle Detection (Floyd's Tortoise & Hare), Reversing Linked List, Merge K Sorted Lists.", daily_practice: "Detect and Remove Loop in Linked List", difficulty: "Medium", time_minutes: 50 },
            { day: 5, title: "Trees & Graph Traversals", daily_learn: "DFS, BFS, Binary Search Tree Properties, LCA, Dijkstra's Shortest Path.", daily_practice: "Lowest Common Ancestor in Binary Tree & Topological Sort", difficulty: "Hard", time_minutes: 60 }
          ]
        },
        core_cs: {
          title: "Core CS Fundamentals (OS, DBMS, Networks)",
          description: "Essential Core CS subjects required for top technical rounds and university excellence.",
          topics: [
            { day: 1, title: "Operating Systems: Concurrency & Threads", daily_learn: "Process vs Thread, Semaphores, Mutex Locks, Deadlock Conditions & Bankers Algorithm.", daily_practice: "Analyze Producer-Consumer Problem using Semaphores & Deadlock Prevention Rules", difficulty: "Medium", time_minutes: 50 },
            { day: 2, title: "DBMS: SQL Indexing & Normalization", daily_learn: "B-Tree vs Hash Indexes, 1NF to BCNF Normalization, ACID Properties, Isolation Levels.", daily_practice: "Write Nth Highest Salary SQL Query & Design Normalized E-Commerce Schema", difficulty: "Medium", time_minutes: 45 },
            { day: 3, title: "Computer Networks: TCP/IP & HTTP/3", daily_learn: "TCP 3-Way Handshake, SSL/TLS Encryption Handshake, DNS Resolution, HTTP vs HTTPS.", daily_practice: "Trace Packet Flow from Browser URL Bar to Web Server Response", difficulty: "Medium", time_minutes: 40 }
          ]
        },
        system_design: {
          title: "System Design (HLD & LLD)",
          description: "High Level & Low Level System Design for scalable distributed platforms.",
          topics: [
            { day: 1, title: "High Level Design: Load Balancing & Caching", daily_learn: "Consistent Hashing, CDN Caching Strategies (Write-Through vs Cache-Aside), Redis Cluster.", daily_practice: "Design a Distributed Rate Limiter (Token Bucket Algorithm)", difficulty: "Hard", time_minutes: 60 },
            { day: 2, title: "Low Level Design: Object-Oriented Patterns", daily_learn: "SOLID Principles, Factory, Strategy, Observer, and Singleton Patterns.", daily_practice: "Design a Parking Lot System using SOLID Design Principles", difficulty: "Medium", time_minutes: 55 }
          ]
        },
        aptitude: {
          title: "Aptitude & Logical Reasoning",
          description: "Quantitative Aptitude, Logical Reasoning, and Data Interpretation for screening rounds.",
          topics: [
            { day: 1, title: "Quantitative: Speed, Distance & Work", daily_learn: "Relative Speed Formulas, Work Rate Formulas, Train & Stream Problems.", daily_practice: "Solve 10 Quantitative Problems on Pipes & Cisterns and Time-Work", difficulty: "Easy-Medium", time_minutes: 35 },
            { day: 2, title: "Logical Reasoning: Syllogisms & Seating", daily_learn: "Venn Diagram Method for Syllogisms, Circular & Linear Seating Arrangements.", daily_practice: "Solve 8 Complex Seating Arrangement Puzzles", difficulty: "Medium", time_minutes: 40 }
          ]
        }
      };
      setCurriculum(fallbacks[domain] || fallbacks.dsa);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomainPath(activeDomain);
  }, [activeDomain]);

  const toggleItemComplete = (itemId) => {
    setCompletedItems(prev => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      // Update streak
      const totalDone = Object.values(next).filter(Boolean).length;
      setStreakCount(5 + Math.floor(totalDone / 2));
      return next;
    });
  };

  const handleOpenTutor = (topic) => {
    setSelectedTopic(topic);
    setCandidateDoubt('');
    setTutorResponse(null);
    setTutorModalOpen(true);
  };

  const handleAskTutor = async () => {
    if (!selectedTopic) return;
    setLoadingTutor(true);
    try {
      const res = await fetch(`${apiBase}/learning/practice-hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_title: selectedTopic.title,
          problem_description: selectedTopic.daily_practice,
          candidate_query: candidateDoubt
        })
      });
      const data = await res.json();
      setTutorResponse(data.data || data);
    } catch (e) {
      setTutorResponse({
        simple_explanation: `Intuition for '${selectedTopic.title}': Think of it like keeping track of the best window or sum seen so far without checking all pairs.`,
        key_constraints_and_edge_cases: ["Handle all negative values", "Check single-item edge cases"],
        socratic_hints: [
          "Hint 1: Can you solve this in a single pass O(N)?",
          "Hint 2: What condition causes you to reset your current running total?"
        ],
        target_complexity: { time: "O(N)", space: "O(1)" },
        encouraging_guidance: "Try coding the loop logic using these hints! Notice that no direct solution code is given so you learn by building it yourself."
      });
    } finally {
      setLoadingTutor(false);
    }
  };

  const calculateProgress = () => {
    if (!curriculum || !curriculum.topics) return 0;
    const total = curriculum.topics.length * 2; // Learn + Practice per day
    let done = 0;
    curriculum.topics.forEach((t, idx) => {
      if (completedItems[`${activeDomain}-${idx}-learn`]) done++;
      if (completedItems[`${activeDomain}-${idx}-practice`]) done++;
    });
    return Math.round((done / total) * 100);
  };

  const progressPct = calculateProgress();

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Header & Streak */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }} className="gradient-text">
            Professional Learning Path & Daily Planner
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            TakeUForward-inspired structured curricula across DSA, Core CS, System Design, and Aptitude.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="badge badge-amber" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <Flame size={16} color="#f59e0b" /> {streakCount}-Day Study Streak
          </div>
          <div className="badge badge-purple" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Progress: {progressPct}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: 'rgba(255, 255, 255, 0.06)', height: '8px', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ width: `${progressPct}%`, background: 'var(--primary-gradient)', height: '100%', transition: 'width 0.3s ease' }}></div>
      </div>

      {/* Domain Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button className={`btn-secondary ${activeDomain === 'dsa' ? 'active' : ''}`} onClick={() => setActiveDomain('dsa')}>
          <Code size={15} /> DSA Sheet (Striver Inspired)
        </button>
        <button className={`btn-secondary ${activeDomain === 'core_cs' ? 'active' : ''}`} onClick={() => setActiveDomain('core_cs')}>
          <BookOpen size={15} /> Core CS (OS, DBMS, Networks)
        </button>
        <button className={`btn-secondary ${activeDomain === 'system_design' ? 'active' : ''}`} onClick={() => setActiveDomain('system_design')}>
          <Zap size={15} /> System Design (HLD & LLD)
        </button>
        <button className={`btn-secondary ${activeDomain === 'aptitude' ? 'active' : ''}`} onClick={() => setActiveDomain('aptitude')}>
          <Sparkles size={15} /> Aptitude & Reasoning
        </button>
      </div>

      {/* Curriculum View */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>Loading TakeUForward-inspired curriculum...</p>
      ) : curriculum ? (
        <div>
          <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', borderLeft: '4px solid #6366f1' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{curriculum.title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{curriculum.description}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {curriculum.topics.map((t, idx) => {
              const learnId = `${activeDomain}-${idx}-learn`;
              const practiceId = `${activeDomain}-${idx}-practice`;
              const isLearnDone = !!completedItems[learnId];
              const isPracticeDone = !!completedItems[practiceId];

              return (
                <div key={idx} className="glass-panel" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-purple">Day {t.day}</span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{t.title}</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-amber">{t.difficulty}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱️ {t.time_minutes} mins</span>
                    </div>
                  </div>

                  {/* Daily Learn Section */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        📖 Daily Learn
                      </span>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{t.daily_learn}</p>
                    </div>
                    <button 
                      onClick={() => toggleItemComplete(learnId)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isLearnDone ? '#4ade80' : 'var(--text-dim)', paddingTop: '0.2rem' }}
                    >
                      {isLearnDone ? <CheckCircle size={22} /> : <Circle size={22} />}
                    </button>
                  </div>

                  {/* Daily Practice Section */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        💻 Daily Practice Challenge
                      </span>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{t.daily_practice}</p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        className="btn-secondary" 
                        onClick={() => handleOpenTutor(t)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        title="Get Socratic Hints & Ask Doubts (Zero Solution Code Revealed)"
                      >
                        <HelpCircle size={14} color="#f59e0b" /> Ask Doubt / Hints
                      </button>

                      <button 
                        onClick={() => toggleItemComplete(practiceId)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isPracticeDone ? '#4ade80' : 'var(--text-dim)', paddingTop: '0.2rem' }}
                      >
                        {isPracticeDone ? <CheckCircle size={22} /> : <Circle size={22} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Socratic Practice Tutor Modal */}
      {tutorModalOpen && selectedTopic && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="glass-panel" style={{ maxWidth: '650px', width: '100%', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#f59e0b" />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Socratic Practice Tutor Agent</h4>
              </div>
              <button onClick={() => setTutorModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Challenge:</p>
              <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{selectedTopic.daily_practice}</h5>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Ask your specific doubt or request an intuitive hint:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={candidateDoubt}
                  onChange={(e) => setCandidateDoubt(e.target.value)}
                  placeholder="e.g. How do I optimize the time complexity? What are the edge cases?"
                />
                <button className="btn-primary" onClick={handleAskTutor} disabled={loadingTutor} style={{ whiteSpace: 'nowrap' }}>
                  {loadingTutor ? "Thinking..." : "Ask Tutor"} <Send size={14} />
                </button>
              </div>
            </div>

            {tutorResponse && (
              <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '1.25rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <span className="badge badge-amber">Strict Zero-Solution Guardrail Active</span>
                </div>

                <h5 style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '0.35rem' }}>💡 Intuitive Analogy & Breakdown</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem' }}>{tutorResponse.simple_explanation}</p>

                <h5 style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '0.35rem' }}>🔍 Key Constraints & Edge Cases</h5>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', marginBottom: '1rem' }}>
                  {(tutorResponse.key_constraints_and_edge_cases || []).map((c, i) => <li key={i}>{c}</li>)}
                </ul>

                <h5 style={{ fontSize: '0.9rem', color: '#fbbf24', marginBottom: '0.35rem' }}>🎯 Socratic Guided Hints</h5>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', marginBottom: '1rem' }}>
                  {(tutorResponse.socratic_hints || []).map((h, i) => <li key={i}>{h}</li>)}
                </ul>

                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-dim)' }}>
                  {tutorResponse.encouraging_guidance}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
