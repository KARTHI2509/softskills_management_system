/*
------------------------------------------------
File: ManageQuestions.jsx
Purpose: Faculty admin screen for importing questions.
Responsibilities: Manages bulk questions copy-pasting, CSV string parsing, and category filters.
Dependencies: react, axiosClient, Card, Button, Toast
------------------------------------------------
*/

import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { Upload, FileSpreadsheet, CheckCircle, HelpCircle } from 'lucide-react';

const ManageQuestions = () => {
  const [listType, setListType] = useState('csv');
  const [category, setCategory] = useState('QUANTITATIVE');
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    setLoading(true);
    try {
      const res = await axiosClient.post('/faculty/questions/import', {
        csvText,
        listType
      });

      if (res.data.success) {
        setToast({ message: res.data.message, type: 'success' });
        setCsvText('');
      }
    } catch (err) {
      setToast({ 
        message: err.response?.data?.message || 'Failed to import questions. Verify format.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (listType === 'csv') {
      return `Format: CATEGORY,Question Text,Option1;Option2;Option3;Option4,CorrectOption\n\nExample:\nQUANTITATIVE,What is 15% of 200?,20;25;30;35,30\nLOGICAL,If A > B and B > C then A > C?,True;False,,True`;
    }
    return `[\n  {\n    "category": "QUANTITATIVE",\n    "question_text": "What is 15% of 200?",\n    "options": ["20", "25", "30", "35"],\n    "correct_answer": "30"\n  }\n]`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Manage Question Bank</h1>
        <p className="text-slate-500 dark:text-slate-400">Bulk import test questions and answers via structured copy-pasted CSV strings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Bulk Input card */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Bulk Question Import Panel">
            <form onSubmit={handleImport} className="space-y-6">
              
              {/* Type Switcher */}
              <div className="flex gap-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setListType('csv')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${listType === 'csv' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  CSV Format
                </button>
                <button
                  type="button"
                  onClick={() => setListType('json')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${listType === 'json' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                >
                  JSON Format
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Copy-Paste Question Data</label>
                <textarea
                  rows="10"
                  required
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-2xl text-xs font-mono leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full justify-center">
                <FileSpreadsheet className="w-4 h-4" /> Import into Database
              </Button>
            </form>
          </Card>
        </div>

        {/* Info card */}
        <div className="space-y-6">
          <Card title="Format Guidelines">
            <div className="space-y-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p>Columns: Category, Question text, Options (separated by semicolons), and the correct answer text.</p>
              </div>
              <div className="flex gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p>Subjective questions: Leave the options field empty in the CSV format row (e.g. `COMMUNICATION,Describe a leadership scenario,,leadership`).</p>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default ManageQuestions;
