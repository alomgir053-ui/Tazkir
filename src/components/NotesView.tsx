import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, FileText, CloudUpload } from 'lucide-react';
import { UserNote } from '../types/index.ts';

interface NotesViewProps {
  notes: UserNote[];
  onSaveNote: (note: UserNote) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
}) => {
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('কুরআনিক ভাবনা');

  const handleStartNew = () => {
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      title: '',
      content: '',
      tag: 'কুরআনিক ভাবনা',
      updatedAt: 'আজ',
    };
    setEditingNote(newNote);
    setTitle('');
    setContent('');
    setTag('কুরআনিক ভাবনা');
  };

  const handleEdit = (n: UserNote) => {
    setEditingNote(n);
    setTitle(n.title);
    setContent(n.content);
    setTag(n.tag);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    const noteToSave: UserNote = {
      id: editingNote ? editingNote.id : `note-${Date.now()}`,
      title: title.trim() || 'শিরোনামহীন নোট',
      content: content.trim(),
      tag,
      updatedAt: 'আজ',
    };
    onSaveNote(noteToSave);
    setEditingNote(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#3B1E54] font-bengali">আমার নোট ও আত্মিক উপলব্ধি</h2>
          <p className="text-xs text-[#8A799E]">তিলাওয়াত, হাদিস ও প্রাত্যহিক আমলের ব্যক্তিগত নোট</p>
        </div>
        <button
          onClick={handleStartNew}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#3B1E54] text-[#D4AF37] hover:bg-[#2B1340] text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোট লিখুন</span>
        </button>
      </div>

      {editingNote && (
        <div className="bg-white p-5 rounded-3xl border-2 border-[#D4AF37] shadow-lg space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="নোটের শিরোনাম..."
            className="w-full text-base font-bold text-[#3B1E54] border-b border-[#E8DEF8] pb-2 outline-hidden"
          />
          <div className="flex gap-2 text-xs">
            {['কুরআনিক ভাবনা', 'দোয়ার উপলব্ধি', 'হাদিসের শিক্ষা', 'দৈনিক সংকল্প'].map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-2.5 py-1 rounded-lg border ${
                  tag === t ? 'bg-[#3B1E54] text-white border-[#3B1E54]' : 'bg-[#FAF7F2] text-[#6F5D84] border-[#E8DEF8]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="আপনার ভাবনা বা তাফসিরের সারাংশ লিখুন..."
            className="w-full p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DEF8] text-sm text-[#231F20] outline-hidden resize-none"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingNote(null)}
              className="px-3 py-1.5 text-xs text-[#8A799E] hover:bg-[#FAF7F2] rounded-xl"
            >
              বাতিল
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#3B1E54] text-[#D4AF37] font-bold text-xs rounded-xl shadow-xs"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-5 bg-white rounded-3xl border border-[#EFE7F6] hover:border-[#D4AF37] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#A88620] bg-[#FAF5EB] px-2 py-0.5 rounded-md">
                  {note.tag}
                </span>
                <span className="text-[10px] text-[#8A799E]">{note.updatedAt}</span>
              </div>
              <h3 className="font-bold text-sm text-[#3B1E54] font-bengali">
                {note.title}
              </h3>
              <p className="text-xs text-[#5A3578] mt-2 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#FAF7F2] mt-4">
              <button
                onClick={() => handleEdit(note)}
                className="p-1.5 text-[#6F5D84] hover:bg-[#F3EEF9] rounded-lg"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteNote(note.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
