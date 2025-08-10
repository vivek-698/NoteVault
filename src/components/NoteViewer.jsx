import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Calendar, Bell, ArrowLeft, Link } from 'lucide-react';
import LinkParser from './LinkParser';

const NoteViewer = ({ note, notes, onEdit, onBack, onLinkClick }) => {
  if (!note) return null;

  // Find backlinks - notes that link to this note
  const backlinks = notes.filter(n => 
    n.id !== note.id && 
    n.content.includes(`[[${note.title}]]`)
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <Card className="flex-1 border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={() => onEdit(note)}
              size="sm"
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Created: {formatDate(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && (
              <span>Updated: {formatDate(note.updatedAt)}</span>
            )}
          </div>
          
          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {note.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Reminder */}
          {note.reminder && (
            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
              <Bell className="h-4 w-4" />
              <span>Reminder: {formatDate(note.reminder)}</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex-1">
          {/* Note Content with Link Parsing */}
          <div className="mb-8">
            <LinkParser
              content={note.content}
              notes={notes}
              onLinkClick={onLinkClick}
            />
          </div>
          
          {/* Backlinks Section */}
          {backlinks.length > 0 && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Link className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Linked References</h3>
                <Badge variant="outline">{backlinks.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {backlinks.map(backlink => (
                  <Card
                    key={backlink.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => onLinkClick(backlink.id)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">{backlink.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {backlink.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {backlink.tags && backlink.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDate(backlink.updatedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteViewer;

