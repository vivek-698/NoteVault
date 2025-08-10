import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import NoteViewer from './components/NoteViewer';
import SearchView from './components/SearchView';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [currentView, setCurrentView] = useState('all-notes');
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', true);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCreateNote = (title = '') => {
    setSelectedNote({ title });
    setIsEditing(true);
    setCurrentView('editor');
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setCurrentView('viewer');
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setIsEditing(true);
    setCurrentView('editor');
  };

  const handleSaveNote = (noteData) => {
    setNotes(prevNotes => {
      const existingIndex = prevNotes.findIndex(note => note.id === noteData.id);
      if (existingIndex >= 0) {
        // Update existing note
        const updatedNotes = [...prevNotes];
        updatedNotes[existingIndex] = noteData;
        return updatedNotes;
      } else {
        // Add new note
        return [noteData, ...prevNotes];
      }
    });
    
    setSelectedNote(noteData);
    setIsEditing(false);
    setCurrentView('viewer');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedNote && selectedNote.id) {
      setCurrentView('viewer');
    } else {
      setCurrentView('all-notes');
      setSelectedNote(null);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setIsEditing(false);
    if (view !== 'viewer' && view !== 'editor') {
      setSelectedNote(null);
    }
  };

  const handleLinkClick = (noteId, linkTitle) => {
    if (noteId) {
      // Navigate to existing note
      const note = notes.find(n => n.id === noteId);
      if (note) {
        handleSelectNote(note);
      }
    } else if (linkTitle) {
      // Create new note with the link title
      handleCreateNote(linkTitle);
    }
  };

  const handleBackToList = () => {
    setCurrentView('all-notes');
    setSelectedNote(null);
    setIsEditing(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'editor':
        return (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
          />
        );
      case 'viewer':
        return (
          <NoteViewer
            note={selectedNote}
            notes={notes}
            onEdit={handleEditNote}
            onBack={handleBackToList}
            onLinkClick={handleLinkClick}
          />
        );
      case 'search':
        return (
          <SearchView
            notes={notes}
            onSelectNote={handleSelectNote}
          />
        );
      case 'all-notes':
      default:
        return (
          <NoteList
            notes={notes}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
    }
  };

  return (
    <div className="h-screen flex bg-background text-foreground">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        currentView={currentView}
        onViewChange={handleViewChange}
        notes={notes}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onCreateNote={handleCreateNote}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;
