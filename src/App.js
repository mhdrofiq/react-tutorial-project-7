import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    //use an arrow function (function that returns something) 
      //inside useState to do 'lazy state initialization' 
    const [notes, setNotes] = React.useState(() => 
      //initialize the app state with data from the browser local storage
        //or initialize it with an empty array if local storage is empty
        //the key of that data in the browser is 'localStoreNotes'
      JSON.parse(localStorage.getItem('localStoreNotes')) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    //use a side effect to interact with local storage
        //stops react from running setItem EVERYTIME the component is rendered
    React.useEffect(() => {
      localStorage.setItem('localStoreNotes', JSON.stringify(notes));
    }, 
    //everytime the notes array changes, call the side effect
    [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    //this does not rearrange the notes array (original version)
    //     setNotes(oldNotes => oldNotes.map(oldNote => {
    //         return oldNote.id === currentNoteId
    //             ? { ...oldNote, body: text }
    //             : oldNote
    //     }))
    // }

    function updateNote(text) {
        setNotes(oldNotes => {
            //make new array for rearranged notes
            const newArray = []
            //loop through the old array of notes
            for(let i=0; i<oldNotes.length; i++){
                const oldNote = oldNotes[i]
                //if the note id of the old array matches the id of the note
                    //currently opened (being worked on) in the editor  
                if(oldNote.id === currentNoteId){
                    //put this note in the first index of the new array
                        //also keep the properties of the old note and body
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    //push the old note into the end of the array because
                    //it hasnt been edited at all
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }

    function deleteNote(event, noteId){
        event.stopPropagation()
        setNotes(oldNotes =>
            //filter the array of notes (see filter array method)
                //'note' inside filter indicates what the name of the elements are
                //ex. 
                //array name = salad 
                //element name = vegetables
                //filter returns an array
            oldNotes.filter(note =>
                //check if the id of the current note iterated is not equal to the 
                    //id of the note given to this function (note that wants to be
                    //deleted)
                note.id !== noteId
            )
        )
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
