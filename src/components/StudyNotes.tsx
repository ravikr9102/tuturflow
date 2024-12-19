import React, { useState } from 'react';
import { Subject } from '../types';
import { SubjectTag } from './SubjectTag';
import { Search, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { saveNote, updateNote, deleteNote } from '../services/notes.service';
import { StudyNote } from '../types/notes';
import { useNotes } from '../hooks/useNotes';


const SUBJECTS: Subject[] = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Literature',
  'Computer Science'
];

export const StudyNotes: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const { user } = useAuthContext();
  const { notes, loading } = useNotes(user?.uid || null);

  const handleSaveNote = async () => {
    if (!newNote.trim() || !user) return;
    
    try {
      if (editingNote) {
        const updatedNote = {
          ...editingNote,
          content: newNote,
          subject: selectedSubject || editingNote.subject,
          timestamp: new Date().toISOString()
        };
        await updateNote(user.uid, updatedNote);
      } else {
        const note = {
          content: newNote,
          subject: selectedSubject || 'General',
          timestamp: new Date().toISOString()
        };
        await saveNote(user.uid, note);
      }
      
      setNewNote('');
      setEditingNote(null);
      setSelectedSubject(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEditNote = (note: StudyNote) => {
    if (!user) return;
    setEditingNote(note);
    setNewNote(note.content);
    setSelectedSubject(note.subject as Subject);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;

    try {
      await deleteNote(user.uid, noteId);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleAddCustomTag = () => {
    if (!user) return;
    if (customTagInput.trim()) {
      setCustomTags([...customTags, customTagInput.trim()]);
      setCustomTagInput('');
      setShowCustomTagInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomTag();
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSubject = !selectedSubject || note.subject === selectedSubject;
    const matchesSearch = !searchQuery || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg overflow-hidden bg-white shadow-lg p-6 relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Study Notes</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {SUBJECTS.map((subject) => (
          <SubjectTag
            key={subject}
            subject={subject}
            active={selectedSubject === subject}
            onClick={() => user && setSelectedSubject(subject === selectedSubject ? null : subject)}
            disabled={!user}
          />
        ))}
        {customTags.map((tag) => (
          <SubjectTag
            key={tag}
            subject={tag}
            active={selectedSubject === tag}
            onClick={() => user && setSelectedSubject(tag === selectedSubject ? null : tag)}
            disabled={!user}
          />
        ))}
        {showCustomTagInput ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter tag name"
              className="px-3 py-1 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!user}
              autoFocus
            />
            <button
              onClick={handleAddCustomTag}
              disabled={!user}
              className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowCustomTagInput(false);
                setCustomTagInput('');
              }}
              disabled={!user}
              className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => user && setShowCustomTagInput(true)}
            disabled={!user}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Custom Tag
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder={user ? "Search notes..." : "Log in to search notes"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={!user}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={user ? "Type your study note here..." : "Log in to create notes"}
          disabled={!user}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <div className="mt-2 flex justify-between items-center">
          {editingNote && (
            <button
              onClick={() => {
                setEditingNote(null);
                setNewNote('');
                setSelectedSubject(null);
              }}
              disabled={!user}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Editing
            </button>
          )}
          <button
            onClick={handleSaveNote}
            disabled={!user}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!user ? 'Log in to Save Notes' : editingNote ? 'Update Note' : 'Save Note'}
          </button>
        </div>
      </div>

      <div className="clear-both mt-8">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : !user ? (
          <div className="text-center pb-4">
            <p className="text-gray-500">Log in to view and manage your notes</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No notes yet. Start taking notes during your tutoring session!
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="bg-gray-50 p-4 rounded-lg mb-3">
              <p className="text-gray-800 mb-2">{note.content}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <SubjectTag subject={note.subject} disabled={!user} />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      disabled={!user}
                      className="p-1 text-gray-500 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={!user}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};