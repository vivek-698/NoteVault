import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Hash, 
  Calendar, 
  Bell, 
  Archive, 
  Trash2, 
  Settings,
  Moon,
  Sun,
  Menu,
  Plus
} from 'lucide-react';

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  currentView, 
  onViewChange, 
  notes, 
  isDarkMode, 
  onToggleDarkMode,
  onCreateNote 
}) => {
  const notesCount = notes.length;
  const remindersCount = notes.filter(note => note.reminder).length;
  const tagsCount = [...new Set(notes.flatMap(note => note.tags || []))].length;

  const menuItems = [
    { 
      id: 'all-notes', 
      label: 'All Notes', 
      icon: FileText, 
      count: notesCount 
    },
    { 
      id: 'search', 
      label: 'Search', 
      icon: Search 
    },
    { 
      id: 'tags', 
      label: 'Tags', 
      icon: Hash, 
      count: tagsCount 
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: Calendar 
    },
    { 
      id: 'reminders', 
      label: 'Reminders', 
      icon: Bell, 
      count: remindersCount 
    },
    { 
      id: 'archived', 
      label: 'Archived', 
      icon: Archive 
    },
    { 
      id: 'trash', 
      label: 'Trash', 
      icon: Trash2 
    },
  ];

  if (!isOpen) {
    return (
      <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-10 h-10 p-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateNote}
          className="w-10 h-10 p-0"
          title="New Note"
        >
          <Plus className="h-5 w-5" />
        </Button>
        
        {menuItems.slice(0, 5).map(item => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(item.id)}
            className="w-10 h-10 p-0 relative"
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
            {item.count > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {item.count > 99 ? '99+' : item.count}
              </Badge>
            )}
          </Button>
        ))}
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleDarkMode}
          className="w-10 h-10 p-0"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange('settings')}
          className="w-10 h-10 p-0"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-sidebar-foreground">NoteVault</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-8 h-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          onClick={onCreateNote}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-10"
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {item.count > 99 ? '99+' : item.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10"
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10"
          onClick={() => onViewChange('settings')}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

