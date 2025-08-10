import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from './ThemeToggle';
import { 
  FileText, 
  Search, 
  Hash, 
  Calendar, 
  Bell, 
  Archive, 
  Trash2, 
  Settings,
  Menu,
  Plus,
  X
} from 'lucide-react';

const AnimatedSidebar = ({ 
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

  // Overlay for mobile
  const Overlay = () => (
    <div 
      className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onToggle}
    />
  );

  // Collapsed sidebar
  if (!isOpen) {
    return (
      <>
        <div className="w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 space-y-4 transition-all duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-10 h-10 p-0 hover:bg-sidebar-accent"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateNote}
            className="w-10 h-10 p-0 hover:bg-sidebar-accent"
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
              className="w-10 h-10 p-0 relative hover:bg-sidebar-accent"
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
              {item.count > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse"
                >
                  {item.count > 99 ? '99+' : item.count}
                </Badge>
              )}
            </Button>
          ))}
          
          <div className="flex-1" />
          
          <ThemeToggle 
            isDarkMode={isDarkMode}
            onToggle={onToggleDarkMode}
            className="w-10 h-10 p-0"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewChange('settings')}
            className="w-10 h-10 p-0 hover:bg-sidebar-accent"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Overlay />
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-sidebar-foreground">NoteVault</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-8 h-8 p-0 lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="w-8 h-8 p-0 hidden lg:flex"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={onCreateNote}
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className={`
                w-full justify-start gap-3 h-10 transition-all duration-200
                hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                ${currentView === item.id ? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''}
              `}
              onClick={() => onViewChange(item.id)}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: isOpen ? 'slideInLeft 0.3s ease-out forwards' : 'none'
              }}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-auto animate-pulse"
                >
                  {item.count > 99 ? '99+' : item.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sidebar-foreground">Theme</span>
            <ThemeToggle 
              isDarkMode={isDarkMode}
              onToggle={onToggleDarkMode}
            />
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 hover:bg-sidebar-accent"
            onClick={() => onViewChange('settings')}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedSidebar;

