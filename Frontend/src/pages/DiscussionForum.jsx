/*
------------------------------------------------
File: DiscussionForum.jsx
Purpose: Renders student and faculty discussion boards.
Responsibilities: Lists discussion threads, submits thread answers, and manages bookmarks.
Dependencies: react, axiosClient, Card, Button, Toast
------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import { MessageSquare, ThumbsUp, PlusCircle, Bookmark, Share2 } from 'lucide-react';

const DiscussionForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const loadPosts = async () => {
    try {
      const res = await axiosClient.get('/forum/posts');
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await axiosClient.post('/forum/posts', {
        title: newTitle,
        content: newContent
      });
      if (res.data.success) {
        setNewTitle('');
        setNewContent('');
        loadPosts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPost = async (post) => {
    setSelectedPost(post);
    setComments([]);
    try {
      const res = await axiosClient.get(`/forum/posts/${post.post_id || post.id}/comments`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPost) return;

    try {
      const postId = selectedPost.post_id || selectedPost.id;
      const res = await axiosClient.post(`/forum/posts/${postId}/comments`, {
        content: commentText
      });
      if (res.data.success) {
        setCommentText('');
        handleSelectPost(selectedPost);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Discussion Forum</h1>
        <p className="text-slate-500 dark:text-slate-400">Share programming hacks, ask soft skills guidance questions, and exchange feedback with faculty coaches.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Thread listings */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Community Board Feed">
            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading discussions...</p>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => {
                  const pid = post.post_id || post.id;
                  return (
                    <div 
                      key={pid} 
                      onClick={() => handleSelectPost(post)}
                      className={`p-5 border rounded-2xl cursor-pointer transition-all ${
                        selectedPost?.post_id === post.post_id || selectedPost?.id === post.id
                          ? 'border-blue-600 bg-blue-50/10 dark:bg-slate-900/50'
                          : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600">
                        Author: {post.authorName || 'Anonymous'}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-200 mt-2 hover:text-blue-600">{post.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">{post.content}</p>
                      
                      <div className="flex gap-6 mt-4 text-[10px] font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1 hover:text-blue-600"><ThumbsUp className="w-3.5 h-3.5" /> {post.likes || 0} Likes</span>
                        <span className="flex items-center gap-1 hover:text-blue-600"><MessageSquare className="w-3.5 h-3.5" /> Comments</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No discussion posts recorded. Create the first one!</p>
            )}
          </Card>

          {/* Comment thread viewer */}
          {selectedPost && (
            <Card title={`Comments: ${selectedPost.title}`}>
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
                {comments.length > 0 ? (
                  comments.map((comm) => (
                    <div key={comm.comment_id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 font-sans text-xs">
                      <p className="font-bold text-[10px] text-blue-600">{comm.authorName || 'Anonymous'}</p>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{comm.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 text-center py-4">No comments registered yet. Share your thoughts!</p>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-3">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a constructive response..."
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button type="submit" variant="primary" className="text-xs px-4">
                  Reply
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Create post form */}
        <div className="space-y-6">
          <Card title="Start Discussion">
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase">Discussion Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Preparing for coding tests"
                  className="mt-1.5 block w-full px-4 py-2 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase">Post Content Details</label>
                <textarea
                  rows="5"
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Describe your inquiry questions or programming updates..."
                  className="mt-1.5 block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" loading={submitting} className="w-full justify-center text-xs">
                <PlusCircle className="w-4 h-4" /> Create Thread Post
              </Button>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default DiscussionForum;
