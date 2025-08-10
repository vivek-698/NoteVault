import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Calendar, Hash, FileText, Clock } from 'lucide-react';

const NoteList = ({ notes, onSelectNote, onCreateNote, searchQuery, onSearchChange }) => {
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filterTag, setFilterTag] = useState('');

  // Get all unique tags from notes
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = !searchQuery || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = !filterTag || (note.tags || []).includes(filterTag);
      
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updatedAt':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Notes</h2>
          <Button onClick={onCreateNote} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="pl-10"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-background border border-border rounded-md text-sm"
          >
            <option value="updatedAt">Last Modified</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
          </select>
          
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-1 bg-background border border-border rounded-md text-sm"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No notes found</p>
            <p className="text-sm">
              {searchQuery || filterTag 
                ? 'Try adjusting your search or filters' 
                : 'Create your first note to get started'
              }
            </p>
          </div>
        ) : (
          filteredNotes.map(note => (
            <Card
              key={note.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelectNote(note)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium truncate flex-1 mr-2">
                    {note.title || 'Untitled Note'}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {note.content && (
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {truncateContent(note.content)}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {(note.tags || []).slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {(note.tags || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(note.tags || []).length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {note.reminder && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(note.reminder).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteList;

