/*
------------------------------------------------
File: Landing.jsx
Purpose: Public marketing landing page.
Responsibilities: Displays hero pitches, system objectives, and directs traffic to authentication panels.
Dependencies: react, framer-motion, lucide-react, react-router-dom
------------------------------------------------
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap, Video, Users, CheckSquare, Award } from 'lucide-react';
import { fadeIn, staggerContainer } from '../animations/presets';
import Button from '../components/Button';

const Landing = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 text-center flex flex-col items-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-3xl"
        >
          <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block">
            MITS CSE placement readiness engine
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Smart Soft Skills Management System
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
            Practice AI-driven mock interviews, vocabulary exercises, structured group discussions, and aptitude tests to scale your placement readiness index.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/register">
            <Button variant="primary" className="px-8 py-3.5 hover-trigger text-base">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" className="px-8 py-3.5 text-base">
              Learn More
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-16">Features built for recruitment readiness</h2>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Card 1 */}
          <div className="glass-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 w-fit rounded-2xl mb-6">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl mb-3">AI Mock Interviews</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Upload pitch recordings and receive real-time audio analysis, speech patterns evaluations, and keyword suggestions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 w-fit rounded-2xl mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl mb-3">Group Discussions</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Participate in simulated online panels governed by trainer criteria and student performance evaluations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 w-fit rounded-2xl mb-6">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl mb-3">Leaderboards</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Track student statistics across divisions and benchmark your progress using the placement readiness index.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
