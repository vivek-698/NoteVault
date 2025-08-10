import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Save, Bold, Italic, Link, List, Hash, Calendar, Bell } from 'lucide-react';

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [reminder, setReminder] = useState(note?.reminder || '');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleSave = () => {
    const noteData = {
      id: note?.id || Date.now(),
      title: title || 'Untitled Note',
      content,
      tags,
      reminder,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(noteData);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const insertMarkdown = (syntax) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText;
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'link':
        newText = `[${selectedText}](url)`;
        break;
      case 'list':
        newText = `- ${selectedText}`;
        break;
      case 'heading':
        newText = `# ${selectedText}`;
        break;
      default:
        newText = selectedText;
    }
    
    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          handleSave();
          break;
        case 'b':
          e.preventDefault();
          insertMarkdown('bold');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('italic');
          break;
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Card className="flex-1 border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="text-2xl font-bold border-0 shadow-none bg-transparent p-0 focus-visible:ring-0"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              {onCancel && (
                <Button onClick={onCancel} variant="outline" size="sm">
                  Cancel
                </Button>
              )}
            </div>
          </div>
          
          {/* Formatting Toolbar */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('heading')}
              title="Heading"
            >
              <Hash className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('list')}
              title="List"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('link')}
              title="Link"
            >
              <Link className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Content Editor */}
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start writing your note... Use [[Note Title]] to link to other notes."
            className="flex-1 min-h-[400px] resize-none border-0 shadow-none bg-transparent focus-visible:ring-0 text-base leading-relaxed"
          />
          
          {/* Tags Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-accent text-accent-foreground rounded-md text-sm cursor-pointer hover:bg-accent/80"
                  onClick={() => removeTag(tag)}
                >
                  #{tag}
                  <span className="text-xs opacity-60">×</span>
                </span>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="w-24 h-8 text-sm"
                />
                <Button onClick={addTag} size="sm" variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          {/* Reminder Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Reminder</span>
            </div>
            <Input
              type="datetime-local"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-fit"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteEditor;

