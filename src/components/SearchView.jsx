import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, Hash, FileText, Clock } from 'lucide-react';

const SearchView = ({ notes, onSelectNote }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get all unique tags
  const allTags = useMemo(() => {
    return [...new Set(notes.flatMap(note => note.tags || []))];
  }, [notes]);

  // Advanced search parsing
  const parseSearchQuery = (query) => {
    const operators = {
      text: [],
      tags: [],
      dates: [],
      exclude: []
    };

    // Split query into parts
    const parts = query.split(/\s+/);
    
    parts.forEach(part => {
      if (part.startsWith('tag:')) {
        operators.tags.push(part.substring(4));
      } else if (part.startsWith('date:')) {
        operators.dates.push(part.substring(5));
      } else if (part.startsWith('-')) {
        operators.exclude.push(part.substring(1));
      } else if (part.trim()) {
        operators.text.push(part);
      }
    });

    return operators;
  };

  // Filter notes based on search criteria
  const filteredNotes = useMemo(() => {
    if (!searchQuery && selectedTags.length === 0 && !dateFilter) {
      return notes;
    }

    const operators = parseSearchQuery(searchQuery);
    
    return notes.filter(note => {
      // Text search
      if (operators.text.length > 0) {
        const searchText = `${note.title} ${note.content}`.toLowerCase();
        const hasAllText = operators.text.every(term => 
          searchText.includes(term.toLowerCase())
        );
        if (!hasAllText) return false;
      }

      // Tag search
      if (operators.tags.length > 0 || selectedTags.length > 0) {
        const noteTags = (note.tags || []).map(tag => tag.toLowerCase());
        const searchTags = [...operators.tags, ...selectedTags].map(tag => tag.toLowerCase());
        const hasAllTags = searchTags.every(tag => noteTags.includes(tag));
        if (!hasAllTags) return false;
      }

      // Exclude terms
      if (operators.exclude.length > 0) {
        const searchText = `${note.title} ${note.content}`.toLowerCase();
        const hasExcluded = operators.exclude.some(term => 
          searchText.includes(term.toLowerCase())
        );
        if (hasExcluded) return false;
      }

      // Date filter
      if (dateFilter) {
        const noteDate = new Date(note.updatedAt).toDateString();
        const filterDate = new Date(dateFilter).toDateString();
        if (noteDate !== filterDate) return false;
      }

      return true;
    });
  }, [notes, searchQuery, selectedTags, dateFilter]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setDateFilter('');
  };

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

  const highlightText = (text, query) => {
    if (!query) return text;
    
    const operators = parseSearchQuery(query);
    if (operators.text.length === 0) return text;
    
    let highlightedText = text;
    operators.text.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    });
    
    return highlightedText;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Search Header */}
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Advanced Search</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {showAdvanced ? 'Simple' : 'Advanced'}
          </Button>
        </div>
        
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={showAdvanced ? "Search with operators: tag:work date:2024-01-01 -exclude" : "Search notes..."}
            className="pl-10"
          />
        </div>
        
        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-3">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-fit"
              />
              {dateFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDateFilter('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Tag Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Active Filters */}
        {(searchQuery || selectedTags.length > 0 || dateFilter) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                #{tag}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
            {dateFilter && (
              <Badge variant="secondary" className="gap-1">
                {new Date(dateFilter).toLocaleDateString()}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setDateFilter('')}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
        
        {/* Search Help */}
        {showAdvanced && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
            <strong>Search operators:</strong>
            <ul className="mt-1 space-y-1">
              <li><code>tag:work</code> - Find notes with specific tag</li>
              <li><code>date:2024-01-01</code> - Find notes from specific date</li>
              <li><code>-exclude</code> - Exclude notes containing this term</li>
              <li><code>"exact phrase"</code> - Search for exact phrase</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4 text-sm text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
        </div>
        
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No notes found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map(note => (
              <Card
                key={note.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onSelectNote(note)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <h3 
                      className="font-medium truncate flex-1 mr-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(note.title, searchQuery)
                      }}
                    />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDate(note.updatedAt)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {note.content && (
                    <p 
                      className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          note.content.substring(0, 200) + (note.content.length > 200 ? '...' : ''),
                          searchQuery
                        )
                      }}
                    />
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {(note.tags || []).slice(0, 3).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant={selectedTags.includes(tag) ? "default" : "secondary"} 
                          className="text-xs"
                        >
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;

