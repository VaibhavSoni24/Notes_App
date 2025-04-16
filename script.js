// DOM Elements
const noteForm = document.querySelector('.notes-form');
const noteIdInput = document.getElementById('note-id');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const saveButton = document.getElementById('save-btn');
const cancelButton = document.getElementById('cancel-btn');
const notesContainer = document.getElementById('notes-container');
const searchInput = document.getElementById('search-input');

// Notes array to store all notes
let notes = [];

// Load notes from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadNotesFromLocalStorage();
    renderNotes();
    
    // Add event listeners
    saveButton.addEventListener('click', saveNote);
    cancelButton.addEventListener('click', cancelEdit);
    searchInput.addEventListener('input', filterNotes);
});

// Function to generate unique ID for notes
function generateId() {
    return Date.now().toString();
}

// Save or update a note
function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    if (!title || !content) {
        alert('Please enter both title and content!');
        return;
    }
    
    const id = noteIdInput.value || generateId();
    
    if (noteIdInput.value) {
        // Update existing note
        const noteIndex = notes.findIndex(note => note.id === id);
        notes[noteIndex] = { id, title, content };
    } else {
        // Add new note
        notes.push({ id, title, content });
    }
    
    // Reset form and update UI
    resetForm();
    saveNotesToLocalStorage();
    renderNotes();
}

// Function to edit a note
function editNote(id) {
    const note = notes.find(note => note.id === id);
    
    if (note) {
        noteIdInput.value = note.id;
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        saveButton.textContent = 'Update Note';
        cancelButton.classList.remove('hidden');
        
        // Scroll to the form
        noteForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to delete a note
function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== id);
        saveNotesToLocalStorage();
        renderNotes();
        
        // Reset form if the deleted note was being edited
        if (noteIdInput.value === id) {
            resetForm();
        }
    }
}

// Function to cancel edit mode
function cancelEdit() {
    resetForm();
}

// Function to reset the form
function resetForm() {
    noteIdInput.value = '';
    noteTitleInput.value = '';
    noteContentInput.value = '';
    saveButton.textContent = 'Save Note';
    cancelButton.classList.add('hidden');
}

// Function to render all notes
function renderNotes(filteredNotes = null) {
    const notesToRender = filteredNotes || notes;
    notesContainer.innerHTML = '';
    
    if (notesToRender.length === 0) {
        notesContainer.innerHTML = '<div class="empty-message">No notes found. Add your first note!</div>';
        return;
    }
    
    notesToRender.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.classList.add('note-card');
        
        const noteTitle = document.createElement('h3');
        noteTitle.classList.add('note-title');
        noteTitle.textContent = note.title;
        
        const noteContent = document.createElement('p');
        noteContent.classList.add('note-content');
        noteContent.textContent = note.content;
        
        const noteActions = document.createElement('div');
        noteActions.classList.add('note-actions');
        
        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editNote(note.id));
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteNote(note.id));
        
        noteActions.appendChild(editButton);
        noteActions.appendChild(deleteButton);
        
        noteCard.appendChild(noteTitle);
        noteCard.appendChild(noteContent);
        noteCard.appendChild(noteActions);
        
        notesContainer.appendChild(noteCard);
    });
}

// Function to filter notes based on search input
function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderNotes();
        return;
    }
    
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm)
    );
    
    renderNotes(filteredNotes);
}

// Local Storage Functions
function saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotesFromLocalStorage() {
    const storedNotes = localStorage.getItem('notes');
    notes = storedNotes ? JSON.parse(storedNotes) : [];
}