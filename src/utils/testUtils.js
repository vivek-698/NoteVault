// Test utilities for NoteVault application

export const generateTestNotes = (count = 10) => {
  const sampleTitles = [
    "Project Planning Meeting Notes",
    "Book Review: The Art of War",
    "Recipe: Homemade Pizza",
    "Travel Itinerary: Japan 2024",
    "Learning JavaScript Fundamentals",
    "Workout Routine and Progress",
    "Investment Research Notes",
    "Home Improvement Ideas",
    "Birthday Party Planning",
    "Career Development Goals"
  ];

  const sampleContent = [
    "This is a comprehensive note about project planning. We discussed various aspects including timeline, budget, and resource allocation. The team agreed on the following key points:\n\n**Timeline**: 6 months\n**Budget**: $50,000\n**Team Size**: 5 people\n\nNext steps include creating detailed project specifications and assigning tasks to team members.",
    
    "Just finished reading 'The Art of War' by Sun Tzu. Key takeaways:\n\n- Know yourself and know your enemy\n- All warfare is based on deception\n- Supreme excellence is breaking the enemy's resistance without fighting\n\nThis book has applications beyond military strategy, particularly in business and personal development.",
    
    "Amazing homemade pizza recipe that I tried today:\n\n**Ingredients**:\n- 2 cups flour\n- 1 cup warm water\n- 1 tsp yeast\n- 1 tsp salt\n- Olive oil\n- Tomato sauce\n- Mozzarella cheese\n\n**Instructions**:\n1. Mix flour, water, yeast, and salt\n2. Knead for 10 minutes\n3. Let rise for 1 hour\n4. Roll out, add toppings, bake at 450°F for 12-15 minutes",
    
    "Planning my trip to Japan for next year. Must-visit places:\n\n- Tokyo: Shibuya, Harajuku, Akihabara\n- Kyoto: Fushimi Inari, Kinkaku-ji\n- Osaka: Dotonbori, Osaka Castle\n- Mount Fuji area\n\nBudget estimate: $3000 for 2 weeks including flights, accommodation, and activities.",
    
    "Learning JavaScript fundamentals. Today's topics:\n\n**Variables and Data Types**:\n- let, const, var\n- strings, numbers, booleans, objects, arrays\n\n**Functions**:\n- Function declarations vs expressions\n- Arrow functions\n- Scope and closures\n\n**DOM Manipulation**:\n- querySelector, getElementById\n- addEventListener\n- Creating and modifying elements",
    
    "Current workout routine (3x per week):\n\n**Monday - Upper Body**:\n- Push-ups: 3 sets of 15\n- Pull-ups: 3 sets of 8\n- Dumbbell rows: 3 sets of 12\n- Shoulder press: 3 sets of 10\n\n**Wednesday - Lower Body**:\n- Squats: 3 sets of 20\n- Lunges: 3 sets of 12 each leg\n- Deadlifts: 3 sets of 10\n- Calf raises: 3 sets of 15\n\n**Friday - Full Body**:\n- Burpees: 3 sets of 10\n- Mountain climbers: 3 sets of 20\n- Plank: 3 sets of 60 seconds",
    
    "Investment research for portfolio diversification:\n\n**Tech Stocks**:\n- Apple (AAPL): Strong fundamentals, consistent growth\n- Microsoft (MSFT): Cloud computing leader\n- Google (GOOGL): Dominant in search and advertising\n\n**Index Funds**:\n- S&P 500 ETF (SPY): Broad market exposure\n- Total Stock Market (VTI): Complete US market\n\n**International**:\n- Emerging Markets ETF (VWO)\n- European stocks (VEA)",
    
    "Home improvement project ideas for this year:\n\n**Kitchen**:\n- Update cabinet hardware\n- Install under-cabinet lighting\n- Replace faucet\n\n**Living Room**:\n- Paint accent wall\n- Add floating shelves\n- Upgrade lighting fixtures\n\n**Bathroom**:\n- Re-tile shower\n- Install new vanity\n- Add storage solutions\n\nEstimated budget: $5,000-$8,000 total",
    
    "Planning Sarah's birthday party for next month:\n\n**Date**: March 15th, 2024\n**Venue**: Our backyard (weather permitting)\n**Guest count**: 25 people\n**Theme**: Garden party\n\n**To-do list**:\n- Send invitations (2 weeks before)\n- Order cake from local bakery\n- Plan menu and shopping list\n- Set up decorations\n- Prepare playlist\n- Arrange seating and tables",
    
    "Career development goals for this year:\n\n**Short-term (3 months)**:\n- Complete React certification course\n- Attend 2 networking events\n- Update LinkedIn profile and resume\n\n**Medium-term (6 months)**:\n- Lead a project at work\n- Start mentoring junior developers\n- Speak at a local tech meetup\n\n**Long-term (12 months)**:\n- Get promoted to senior developer\n- Increase salary by 20%\n- Build a strong professional network"
  ];

  const sampleTags = [
    ['work', 'planning', 'meetings'],
    ['books', 'philosophy', 'strategy'],
    ['cooking', 'recipes', 'italian'],
    ['travel', 'japan', 'planning'],
    ['programming', 'javascript', 'learning'],
    ['fitness', 'health', 'routine'],
    ['finance', 'investing', 'research'],
    ['home', 'diy', 'improvement'],
    ['personal', 'events', 'planning'],
    ['career', 'goals', 'development']
  ];

  const notes = [];
  const now = Date.now();

  for (let i = 0; i < Math.min(count, sampleTitles.length); i++) {
    const createdAt = new Date(now - (i * 24 * 60 * 60 * 1000)).toISOString();
    const updatedAt = new Date(now - (i * 12 * 60 * 60 * 1000)).toISOString();
    
    notes.push({
      id: `test-note-${i + 1}`,
      title: sampleTitles[i],
      content: sampleContent[i],
      tags: sampleTags[i],
      createdAt,
      updatedAt,
      reminder: i % 3 === 0 ? new Date(now + (i * 24 * 60 * 60 * 1000)).toISOString() : null
    });
  }

  return notes;
};

export const performanceTest = (notes, searchQuery) => {
  const startTime = performance.now();
  
  // Simulate search operation
  const results = notes.filter(note => {
    const searchText = `${note.title} ${note.content}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  });
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  return {
    duration,
    resultCount: results.length,
    totalNotes: notes.length,
    performance: duration < 100 ? 'Excellent' : duration < 500 ? 'Good' : 'Needs Optimization'
  };
};

export const validateNoteStructure = (note) => {
  const requiredFields = ['id', 'title', 'content', 'createdAt', 'updatedAt'];
  const optionalFields = ['tags', 'reminder'];
  
  const errors = [];
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!note.hasOwnProperty(field)) {
      errors.push(`Missing required field: ${field}`);
    } else if (note[field] === null || note[field] === undefined) {
      errors.push(`Required field ${field} cannot be null or undefined`);
    }
  });
  
  // Validate field types
  if (note.id && typeof note.id !== 'string') {
    errors.push('ID must be a string');
  }
  
  if (note.title && typeof note.title !== 'string') {
    errors.push('Title must be a string');
  }
  
  if (note.content && typeof note.content !== 'string') {
    errors.push('Content must be a string');
  }
  
  if (note.tags && !Array.isArray(note.tags)) {
    errors.push('Tags must be an array');
  }
  
  if (note.createdAt && isNaN(Date.parse(note.createdAt))) {
    errors.push('CreatedAt must be a valid date string');
  }
  
  if (note.updatedAt && isNaN(Date.parse(note.updatedAt))) {
    errors.push('UpdatedAt must be a valid date string');
  }
  
  if (note.reminder && isNaN(Date.parse(note.reminder))) {
    errors.push('Reminder must be a valid date string');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const testLocalStorage = () => {
  const testKey = 'notevault-test';
  const testData = { test: 'data', timestamp: Date.now() };
  
  try {
    // Test write
    localStorage.setItem(testKey, JSON.stringify(testData));
    
    // Test read
    const retrieved = JSON.parse(localStorage.getItem(testKey));
    
    // Test delete
    localStorage.removeItem(testKey);
    
    // Verify deletion
    const afterDelete = localStorage.getItem(testKey);
    
    return {
      success: true,
      canWrite: true,
      canRead: retrieved && retrieved.test === testData.test,
      canDelete: afterDelete === null,
      storageAvailable: true
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      storageAvailable: false
    };
  }
};

export const generateLinkTestNote = () => {
  return {
    id: 'link-test-note',
    title: 'Link Testing Note',
    content: `This note contains various types of links for testing:

**Bi-directional Links:**
- Link to [[Project Planning Meeting Notes]]
- Link to [[Book Review: The Art of War]]
- Link to [[Non-existent Note]] (should create new note)

**Markdown Formatting:**
- **Bold text** for emphasis
- *Italic text* for style
- \`Code snippets\` for technical content

**Headers:**
# Main Header
## Sub Header
### Small Header

This content tests the link parsing and markdown rendering functionality.`,
    tags: ['testing', 'links', 'markdown'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminder: null
  };
};

export const runAllTests = (notes) => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };
  
  // Test note structure validation
  results.tests.noteValidation = {
    name: 'Note Structure Validation',
    passed: 0,
    failed: 0,
    errors: []
  };
  
  notes.forEach((note, index) => {
    const validation = validateNoteStructure(note);
    if (validation.isValid) {
      results.tests.noteValidation.passed++;
    } else {
      results.tests.noteValidation.failed++;
      results.tests.noteValidation.errors.push({
        noteIndex: index,
        noteId: note.id,
        errors: validation.errors
      });
    }
  });
  
  // Test search performance
  const searchQueries = ['project', 'javascript', 'recipe', 'investment'];
  results.tests.searchPerformance = {
    name: 'Search Performance',
    results: []
  };
  
  searchQueries.forEach(query => {
    const perfResult = performanceTest(notes, query);
    results.tests.searchPerformance.results.push({
      query,
      ...perfResult
    });
  });
  
  // Test local storage
  results.tests.localStorage = {
    name: 'Local Storage Functionality',
    ...testLocalStorage()
  };
  
  // Calculate overall results
  const totalTests = Object.keys(results.tests).length;
  const passedTests = Object.values(results.tests).filter(test => {
    if (test.name === 'Note Structure Validation') {
      return test.failed === 0;
    } else if (test.name === 'Search Performance') {
      return test.results.every(r => r.performance !== 'Needs Optimization');
    } else if (test.name === 'Local Storage Functionality') {
      return test.success;
    }
    return false;
  }).length;
  
  results.summary = {
    totalTests,
    passedTests,
    failedTests: totalTests - passedTests,
    successRate: `${Math.round((passedTests / totalTests) * 100)}%`
  };
  
  return results;
};

