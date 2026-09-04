import type { StudySessionPlan } from '../types/schema';

export const QUANTUM_PHYSICS_DEMO: StudySessionPlan = {
  id: 'study_quantum_demo',
  topic: 'Quantum Mechanics & Wave-Particle Duality',
  summary: 'Core principles of quantum mechanics including wavefunctions, Heisenberg uncertainty principle, and superposition.',
  createdAt: new Date().toISOString(),
  flashcards: [
    {
      id: 'fc_q1',
      question: 'What is Wave-Particle Duality?',
      answer: 'The concept that light and matter exhibit behaviors of both waves (diffraction, interference) and particles (photons, localized impact).',
    },
    {
      id: 'fc_q2',
      question: 'State Heisenberg\'s Uncertainty Principle.',
      answer: 'It is fundamentally impossible to simultaneously know both the exact position (x) and momentum (p) of a subatomic particle (Δx · Δp ≥ ħ/2).',
    },
    {
      id: 'fc_q3',
      question: 'What does the Schrödinger Wave Equation calculate?',
      answer: 'It calculates the wavefunction (Ψ) of a quantum system, describing the probability amplitude of finding a particle in a given state or location.',
    },
    {
      id: 'fc_q4',
      question: 'What is Quantum Superposition?',
      answer: 'A principle where a physical system exists in a linear combination of multiple physical states until a measurement forces a collapse into a single state.',
    },
  ],
  quiz: [
    {
      id: 'qz_q1',
      question: 'Which experiment proved the wave nature of light?',
      options: ['Double-Slit Experiment', 'Photoelectric Effect', 'Stern-Gerlach Experiment', 'Compton Scattering'],
      correctIndex: 0,
      explanation: 'Thomas Young\'s double-slit experiment demonstrated interference fringes characteristic of coherent light waves.',
    },
    {
      id: 'qz_q2',
      question: 'What phenomenon did Albert Einstein explain to win his 1921 Nobel Prize in Physics?',
      options: ['General Relativity', 'Photoelectric Effect', 'Special Relativity', 'Brownian Motion'],
      correctIndex: 1,
      explanation: 'Einstein showed that light quanta (photons) eject electrons from metal, establishing the particle nature of light.',
    },
    {
      id: 'qz_q3',
      question: 'In quantum mechanics, what is a "qubit"?',
      options: ['A binary transistor', 'The fundamental unit of quantum information', 'A high-energy photon', 'A subatomic quark'],
      correctIndex: 1,
      explanation: 'A qubit is the basic unit of quantum info, capable of existing in state |0⟩, |1⟩, or any superposition of both.',
    },
    {
      id: 'qz_q4',
      question: 'What happens to a wavefunction during a physical measurement?',
      options: ['It expands infinitely', 'It collapses to an eigenstate', 'It reverses in time', 'It creates a magnetic monopole'],
      correctIndex: 1,
      explanation: 'According to the Copenhagen interpretation, measurement forces a wave function to collapse to a single definite state.',
    },
  ],
};

export const REACT_FIBER_DEMO: StudySessionPlan = {
  id: 'study_react_demo',
  topic: 'React Fiber Architecture & Concurrent Mode',
  summary: 'Deep dive into React\'s reconciliation engine, fiber node trees, scheduling priorities, and time-slicing.',
  createdAt: new Date().toISOString(),
  flashcards: [
    {
      id: 'fc_r1',
      question: 'What is React Fiber?',
      answer: 'React Fiber is a complete rewrite of React\'s core algorithm. Its main feature is incremental rendering: splitting rendering work into chunks and spreading it over multiple frames.',
    },
    {
      id: 'fc_r2',
      question: 'What is the double buffering strategy in Fiber?',
      answer: 'React uses two fiber trees: current (visible on screen) and workInProgress (built asynchronously in background). Upon completion, React swaps pointers.',
    },
    {
      id: 'fc_r3',
      question: 'What are the two main phases of React Fiber rendering?',
      answer: '1. Render Phase (asynchronous, interruptible, calculates diffs)\n2. Commit Phase (synchronous, uninterruptible, mutates the DOM).',
    },
  ],
  quiz: [
    {
      id: 'qz_r1',
      question: 'Which phase in React Fiber is interruptible by higher-priority browser events?',
      options: ['Commit Phase', 'Render Phase', 'DOM Update Phase', 'Hydration Phase'],
      correctIndex: 1,
      explanation: 'The Render phase is pure and side-effect free, allowing React to pause and resume work without UI tearing.',
    },
    {
      id: 'qz_r2',
      question: 'What data structure underpins a Fiber node tree?',
      options: ['Binary Search Tree', 'Singly-linked tree structure (child, sibling, return)', 'Hash Map', 'Circular Queue'],
      correctIndex: 1,
      explanation: 'Fiber nodes form a singly linked tree with child, sibling, and return (parent) pointers to enable call-stack traversal.',
    },
  ],
};
