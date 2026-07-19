/*
------------------------------------------------
File: Contact.jsx
Purpose: Public contact details form.
Responsibilities: Collects feedback messages and support requests.
Dependencies: react, Button, Card
------------------------------------------------
*/

import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Card title="Get in touch with support">
        {submitted ? (
          <div className="text-center py-8">
            <h3 className="font-bold text-xl text-emerald-600 mb-2">Message sent successfully!</h3>
            <p className="text-slate-500">Our administration team will review your ticket and reply within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input type="text" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input type="email" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea rows="4" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent"></textarea>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Send Message
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Contact;
