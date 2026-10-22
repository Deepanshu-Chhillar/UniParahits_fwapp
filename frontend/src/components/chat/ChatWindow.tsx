'use client';

import React, { useState } from 'react';
import { useUniStore } from '@/lib/data/useUniStore';
import { Course } from '@/lib/types';
import RankBadge from '@/components/common/RankBadge';
import { Send, Lock, GraduationCap, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface ChatWindowProps {
  course: Course;
}

export default function ChatWindow({ course }: ChatWindowProps) {
  const { currentUser, isStudentEnrolled, getCourseMessages, postCourseMessage } = useUniStore();
  const [inputText, setInputText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isTeacher = course.teacherId === currentUser.id;
  const isEnrolled = isStudentEnrolled(course.id, currentUser.id);
  const canAccess = isTeacher || isEnrolled || currentUser.role === 'ADMIN';

  const messages = getCourseMessages(course.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setErrorMsg('');

    try {
      postCourseMessage(course.id, inputText.trim());
      setInputText('');
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to send message');
    }
  };

  if (!canAccess) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-red-500/30 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Private Course Classroom Chat</h3>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Access to this private communication channel is restricted strictly to enrolled students and the certified instructor ({course.teacherName}).
          </p>
        </div>
        <div className="p-3 rounded-xl bg-secondary text-xs text-muted-foreground border border-border">
          Enroll in <span className="text-foreground font-semibold">{course.title}</span> to unlock real-time doubt solving, live Google Meet sessions, and assignment feedback.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-border flex flex-col h-[520px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">{course.title}</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                PRIVATE BATCH CHAT
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Instructor: {course.teacherName} (Rank {course.teacherRank}) • {course.enrolledCount} Enrolled Students
            </span>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-16">
            No messages yet. Ask a question or introduce yourself!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover border border-border flex-shrink-0 mt-1"
                />

                <div className={`space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {/* Sender meta */}
                  <div className={`flex items-center gap-1.5 text-[10px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-bold text-foreground">{msg.senderName}</span>
                    <RankBadge rank={msg.senderRank} size="sm" />
                    {msg.isTeacher ? (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        INSTRUCTOR
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded bg-white/5 text-muted-foreground border border-border/40">
                        STUDENT
                      </span>
                    )}
                    <span className="text-muted-foreground font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Bubble */}
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : msg.isTeacher
                        ? 'bg-emerald-950/40 text-emerald-100 border border-emerald-500/30 rounded-tl-none'
                        : 'bg-secondary text-foreground rounded-tl-none border border-border/60'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-border/50 bg-secondary/30 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message the classroom as ${currentUser.name}...`}
          className="flex-1 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-semibold border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/20 transition-all"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
