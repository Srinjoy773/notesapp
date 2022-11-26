import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Note } from '../note';
import { NoteService } from '../note.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  noteForm!: FormGroup;
  editForm!: FormGroup;
  noteDetails: any;
  tempNote: any;
  notesData: any = []

  noteObj: Note ={
    id: '',
    note_title: '',
    note_dec: ''
  }
  constructor(private fb: FormBuilder, private noteService:NoteService, private spinner: NgxSpinnerService) { 
    this.noteForm = this.fb.group({
      title:['', Validators.required],
      description:['', Validators.required]
    });
    this.editForm = this.fb.group({
      edit_title:['', Validators.required],
      edit_description:['', Validators.required],
    })

  }
  ngOnInit() {
    this.getAllNotes()
  }
  addNote(){
    const { value } = this.noteForm
    console.log(value);
    this.noteObj.id = '',
    this.noteObj.note_title = value.title
    this.noteObj.note_dec = value.description

    this.noteService.addNote(this.noteObj).then((note)=>{
      if(note){
        alert("Note Added Successfully")
        this.noteForm.reset();
      }
    })
  }
  //Get All
  getAllNotes(){
    this.spinner.show();
    this.noteService.getNotes().subscribe((res:Note[])=>{
      console.log(res)
      this.notesData = res;
      this.spinner.hide();
    })
  }

  deleteNote(note:Note){
    let decision = confirm("Are you sure you want to delete this Note?");
    if(decision == true){
      this.noteService.deleteNote(note);
    }
  }
  getAllDetails(note:Note){
    this.noteDetails = note
    console.log(this.noteDetails)
  }
  reset(note:Note){
    this.noteDetails=this.tempNote;
    this.editForm.reset();
  }
  //update notes
  updateNote(note: Note) {
    const { value } = this.editForm;
    this.noteObj.id = this.noteDetails.id;
    if(value.edit_title=='' || value.edit_title==null){
      this.noteObj.note_title = this.noteDetails.note_title;
      value.edit_title=this.noteDetails.note_title;
    }else{
      this.noteObj.note_title = value.edit_title;
    }
if(value.edit_description=='' || value.edit_description==null){
      this.noteObj.note_dec = this.noteDetails.note_dec;
      value.edit_description=this.noteDetails.note_dec;
    }else{
      this.noteObj.note_dec = value.edit_description;
    }
    this.noteService.updateNote(this.noteDetails, this.noteObj).then(() => {
      alert("Note Update Successfully")
    });

  }
}
