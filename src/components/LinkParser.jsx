import React from 'react';

const LinkParser = ({ content, notes, onLinkClick }) => {
  // Parse content for [[Note Title]] links
  const parseLinks = (text) => {
    const linkRegex = /\[\[([^\]]+)\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
          key: `text-${lastIndex}`
        });
      }

      // Add the link
      const linkTitle = match[1];
      const linkedNote = notes.find(note => 
        note.title.toLowerCase() === linkTitle.toLowerCase()
      );

      parts.push({
        type: 'link',
        content: linkTitle,
        exists: !!linkedNote,
        noteId: linkedNote?.id,
        key: `link-${match.index}`
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
        key: `text-${lastIndex}`
      });
    }

    return parts;
  };

  // Parse markdown formatting
  const parseMarkdown = (text) => {
    // Bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic text
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Headers
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    // Line breaks
    text = text.replace(/\n/g, '<br />');
    
    return text;
  };

  const handleLinkClick = (noteId, linkTitle) => {
    if (noteId && onLinkClick) {
      onLinkClick(noteId);
    } else {
      // Create new note with this title
      if (onLinkClick) {
        onLinkClick(null, linkTitle);
      }
    }
  };

  const renderContent = () => {
    const lines = content.split('\n');
    
    return lines.map((line, lineIndex) => {
      const parts = parseLinks(line);
      
      return (
        <div key={`line-${lineIndex}`} className="mb-2">
          {parts.map((part) => {
            if (part.type === 'link') {
              return (
                <button
                  key={part.key}
                  onClick={() => handleLinkClick(part.noteId, part.content)}
                  className={`inline-block px-1 py-0.5 rounded text-sm font-medium transition-colors ${
                    part.exists
                      ? 'text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20'
                      : 'text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-dashed border-muted-foreground/30'
                  }`}
                  title={part.exists ? 'Open linked note' : 'Create new note'}
                >
                  {part.content}
                </button>
              );
            } else {
              // Apply markdown formatting to text
              const formattedText = parseMarkdown(part.content);
              return (
                <span
                  key={part.key}
                  dangerouslySetInnerHTML={{ __html: formattedText }}
                />
              );
            }
          })}
        </div>
      );
    });
  };

  return <div className="prose prose-sm max-w-none dark:prose-invert">{renderContent()}</div>;
};

export default LinkParser;

