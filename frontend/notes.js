const API = "http://localhost:5000"; // Backend base URL

// DOM elements
const notesContainer = document.getElementById("notes-container");
const addBtn = document.getElementById("addbtn");
const overlay = document.getElementById("noteOverlay");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const msg = document.getElementById("msg");
const countSpan = document.getElementById("count");

const noteView = document.getElementById("noteView");
const viewTitle = document.getElementById("viewTitle");
const viewtxt = document.getElementById("viewText");

const Edit = document.getElementById("EditBtn");
const savebtn = document.getElementById("savebtn");

let editId = null;
let currentNote = null;

// Get email of logged-in user
const email = localStorage.getItem("userEmail"); 
if (!email) window.location.href = "/index.html";

// Show welcome popup
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("closePopup");
    popup.style.display = "block";
    closeBtn.addEventListener("click", () => popup.style.display = "none");
});

// Show username
document.getElementById("usrname").textContent = `Welcome ${localStorage.getItem("usrname") || ""}`;

// Logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/index.html";
});

// Load notes for this email
async function loadNotes() {
    try {
        const res = await fetch(`/api/notes/${email}`);
        if (!res.ok) throw new Error("Failed to fetch notes");
        const notes = await res.json();

        countSpan.innerText = notes.length === 0 ? "No note found." : `${notes.length} note(s) found.`;

        // Clear old notes
        const noteDivs = notesContainer.querySelectorAll(".NoteDiv:not(.template)");
        noteDivs.forEach(div => div.remove());

        const template = document.querySelector(".NoteDiv.template");

        notes.forEach(note => {
            const noteDiv = template.cloneNode(true);
            noteDiv.classList.remove("template");
            noteDiv.style.display = "block";
            noteDiv.dataset.id = note._id;
            noteDiv.dataset.title = note.title;
            noteDiv.dataset.text = note.content;
            noteDiv.querySelector(".note-title").innerText = note.title;
            noteDiv.querySelector(".note-text").innerText = "Text is hidden.";
            notesContainer.appendChild(noteDiv);

            noteDiv.addEventListener("mouseover", () => noteDiv.style.backgroundColor = "#fb8c92");
            noteDiv.addEventListener("mouseout", () => noteDiv.style.backgroundColor = "#f8bfbfff");

            const menu = noteDiv.querySelector(".menu");
            const options = menu.querySelector(".options");
            const deleteBtn = options.querySelector(".delete");

            menu.querySelector(".dot").addEventListener("click", e => {
                e.stopPropagation();
                options.style.display = options.style.display === "block" ? "none" : "block";
            });

            deleteBtn.addEventListener("click", async e => {
                e.stopPropagation();
                if (confirm("Delete this note?")) {
                    const delRes = await fetch(`/api/notes/${note._id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email })
                    });
                    if (!delRes.ok) console.error(await delRes.json());
                    loadNotes();
                }
            });

            noteDiv.addEventListener("click", () => {
                options.style.display = "none";
                overlay.style.display = "none";
                currentNote = noteDiv;
                editId = noteDiv.dataset.id;
                noteView.style.display = "flex";
                viewTitle.value = note.title;
                viewtxt.value = note.content;
                viewTitle.disabled = true;
                viewtxt.disabled = true;
                savebtn.style.display = "none";
                Edit.style.display = "";
            });
        });
    } catch (err) {
        countSpan.innerText = "Could not fetch notes.";
        console.error(err);
    }
}

// Show overlay to create note
addBtn.addEventListener("click", () => {
    noteView.style.display = "none";
    overlay.style.display = "flex";
    editId = null;
    document.getElementById("noteTitle").value = "";
    document.getElementById("text").value = "";
});

// Cancel creating/editing
cancelBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    msg.innerText = "";
});

// Save note (create or update)
saveBtn.addEventListener("click", async () => {
    const title = document.getElementById("noteTitle").value.trim();
    const text = document.getElementById("text").value.trim();
    if (!title || !text) {
        msg.innerText = "Write something before save";
        return;
    }

    try {
        if (editId) {
            const res = await fetch(`/api/notes/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content: text, email })
            });
            if (!res.ok) throw new Error("Update failed");
        } else {
            const res = await fetch(`/api/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content: text, email })
            });
            if (!res.ok) throw new Error("Create failed");
        }
        overlay.style.display = "none";
        document.getElementById("noteTitle").value = "";
        document.getElementById("text").value = "";
        loadNotes();
    } catch (err) {
        console.error(err);
        msg.innerText = err.message;
    }
});

// Back from viewing note
document.getElementById("BackBtn").addEventListener("click", () => noteView.style.display = "none");

// Edit existing note
Edit.addEventListener("click", () => {
    viewTitle.disabled = false;
    viewtxt.disabled = false;
    Edit.style.display = "none";
    savebtn.style.display = "";
});

// Save edited note
savebtn.addEventListener("click", async () => {
    if (currentNote) {
        const id = currentNote.dataset.id;
        const title = viewTitle.value.trim();
        const text = viewtxt.value.trim();
        if (!title || !text) return;

        const res = await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content: text, email })
        });
        if (!res.ok) console.error(await res.json());
        viewTitle.disabled = true;
        viewtxt.disabled = true;
        savebtn.style.display = "none";
        Edit.style.display = "";
        loadNotes();
    }
});

// Initial load
loadNotes();
