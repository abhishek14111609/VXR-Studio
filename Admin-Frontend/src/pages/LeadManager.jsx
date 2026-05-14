import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink, Mail, Phone, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://backend.vxrmedia.in';

const LeadManager = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [sendingReplyId, setSendingReplyId] = useState('');

  const fetchLeads = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminUser'))?.token}` }
      });
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminUser'))?.token}` }
        });
        fetchLeads();
      } catch (err) {
        alert('Failed to delete lead');
      }
    }
  };

  const toggleReplyBox = (lead) => {
    setReplyDrafts((prev) => {
      if (prev[lead._id]) {
        const next = { ...prev };
        delete next[lead._id];
        return next;
      }

      return {
        ...prev,
        [lead._id]: {
          subject: `Regarding your inquiry with VXR Media House`,
          message: `Hi ${lead.name || ''},\n\nThank you for contacting VXR Media House.\n\n`,
        },
      };
    });
  };

  const updateReplyDraft = (leadId, field, value) => {
    setReplyDrafts((prev) => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [field]: value,
      },
    }));
  };

  const sendReply = async (lead) => {
    const draft = replyDrafts[lead._id];

    if (!draft?.subject?.trim() || !draft?.message?.trim()) {
      alert('Please enter both subject and message.');
      return;
    }

    try {
      setSendingReplyId(lead._id);
      await axios.post(
        `${API_BASE_URL}/api/leads/${lead._id}/reply`,
        {
          subject: draft.subject.trim(),
          message: draft.message.trim(),
        },
        {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('adminUser'))?.token}` },
        }
      );

      alert('Reply sent successfully.');
      setReplyDrafts((prev) => {
        const next = { ...prev };
        delete next[lead._id];
        return next;
      });
      fetchLeads();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingReplyId('');
    }
  };

  return (
    <div className="p-10">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2">Lead Management</h1>
          <p className="text-gray-400">Manage your business inquiries and client requests.</p>
        </div>
        <div className="text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          Total Leads: {leads.length}
        </div>
      </div>

      <div className="space-y-4">
        {leads.length === 0 && !loading && (
          <div className="p-20 text-center glass rounded-3xl text-gray-500">
            No leads found yet. Keep sharing your work!
          </div>
        )}

        {leads.map((lead, i) => (
          <motion.div
            key={lead._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-8 bg-white/5 border border-white/5 rounded-3xl flex flex-col gap-6 group"
          >
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xl font-bold">{lead.name}</h3>
                  <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase tracking-widest">{lead.projectType}</span>
                  <span className="px-3 py-1 bg-white/10 text-gray-400 text-xs font-bold rounded-full">{lead.budget}</span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${lead.status === 'contacted' ? 'bg-green-500/15 text-green-300' : 'bg-yellow-500/15 text-yellow-300'}`}>
                    {lead.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center gap-2"><Mail size={16} /> {lead.email}</div>
                  <div className="flex items-center gap-2"><Phone size={16} /> {lead.phone}</div>
                  <div className="flex items-center gap-2"><Calendar size={16} /> {new Date(lead.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="p-6 bg-black/30 rounded-2xl text-gray-300 italic">
                  "{lead.message}"
                </div>
                {lead.lastRepliedAt && (
                  <p className="text-xs text-gray-500 mt-3">
                    Last replied: {new Date(lead.lastRepliedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex md:flex-col justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleReplyBox(lead)}
                  className="p-4 bg-blue-400/10 text-blue-300 rounded-2xl hover:bg-blue-400 hover:text-white transition-all"
                  title="Reply via SMTP"
                >
                  <Mail size={20} />
                </button>
                <a href={`mailto:${lead.email}`} className="p-4 bg-accent/10 text-accent rounded-2xl hover:bg-accent hover:text-white transition-all" title="Open local mail app">
                  <ExternalLink size={20} />
                </a>
                <button
                  onClick={() => deleteLead(lead._id)}
                  className="p-4 bg-red-400/10 text-red-400 rounded-2xl hover:bg-red-400 hover:text-white transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {replyDrafts[lead._id] && (
              <div className="border border-white/10 rounded-2xl p-5 bg-black/25">
                <p className="text-sm text-gray-300 mb-4">Send reply to {lead.email}</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={replyDrafts[lead._id].subject}
                    onChange={(e) => updateReplyDraft(lead._id, 'subject', e.target.value)}
                    placeholder="Subject"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none"
                  />
                  <textarea
                    rows={6}
                    value={replyDrafts[lead._id].message}
                    onChange={(e) => updateReplyDraft(lead._id, 'message', e.target.value)}
                    placeholder="Write your reply"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none"
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => toggleReplyBox(lead)}
                      className="px-4 py-2 rounded-lg border border-white/15 text-gray-300 hover:bg-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => sendReply(lead)}
                      disabled={sendingReplyId === lead._id}
                      className="px-5 py-2 rounded-lg bg-accent text-white font-semibold disabled:opacity-60"
                    >
                      {sendingReplyId === lead._id ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeadManager;
