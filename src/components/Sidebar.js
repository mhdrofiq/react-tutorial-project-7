import React from "react"

export default function Sidebar(props) {
    const noteElements = props.notes.map((note, index) => (
        <div key={note.id}>
            <div
                
                className={`title ${
                    note.id === props.currentNote.id ? "selected-note" : ""
                }`}
                onClick={() => props.setCurrentNoteId(note.id)}
            >
                {/* the body of the note is a string
                    split the string based on '\n', this returns an array
                    of strings. we only want the first line of the original 
                    body so select the string at index 0  */}
                <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
                <button 
                    className="delete-btn" 
                    //this is what i tried to do: pass the event and note id 
                    //to the delete note function through the prop
                        //onClick={props.deleteNote(event, note.id)}
                    
                    //this is the correct way of doing it for cases that 
                        //want to pass multiple params to a functions via prop
                    //this is called using a callback function inside the
                        //onclick event
                    onClick={(event) => props.deleteNote(event, note.id)}
                >
                    <i className="gg-trash trash-icon"></i>
                </button>
            </div>
        </div>
    ))

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    )
}
