import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import  '../css/editContact.css';
import { VcardJson, getEntry } from '../types/Vcard';

type contactJSON = {
    name:string,
    pronouns?:string,
    role?:string,
    tags?:string,
    note?:string,
    photo?:string
};
export const EditContact = ({ isNew }:{isNew:boolean}) => {
    const { eventId, secret, contactId } = useParams<{eventId:string, secret:string, contactId:string}>();
    const [contact, setContact] = useState<contactJSON>({ name: '', pronouns: '', role: '', tags: '', note: '' });
    const [photo, setPhoto] = useState<File>();
    const [isEditing, setIsEditing] = useState(isNew);
    const [updatedContact, setUpdatedContact] = useState<Pick<contactJSON, 'name'|'pronouns'|'role'|'tags'|'note'>>({ name: '' });
    const getContact = async () => {
        try {
            const response = await axios.get(`/api/contacts/single/${contactId}`);
            const contact:VcardJson = response.data;
            console.log(response.data);
            
            setContact({
                name: getEntry(contact, 'FN') as string,
                pronouns: getEntry(contact, 'TITLE') as string,
                role: getEntry(contact, 'ROLE') as string,
                tags: (getEntry(contact, 'ORG') as string).replace(/\\/g,''),
                note: getEntry(contact, 'NOTE') as string,
                photo: getEntry(contact, 'PHOTO') as string,
            });

        } catch (error) {

        }};
    useEffect(()=>{getContact();},[]);
    const handleEdit = () => {
        setIsEditing(true);
        setUpdatedContact(contact as Pick<contactJSON, 'name'|'pronouns'|'role'|'tags'|'note'>);
    };
    const handleSave = async () => {
        if (isNew && secret && eventId &&
            window.confirm('Are you sure you want to submit this contact?')
        ){
            const formData = new FormData();
            formData.append('name', updatedContact.name);
            formData.append('pronouns', updatedContact.pronouns as string);
            formData.append('role', updatedContact.role as string);
            formData.append('tags', updatedContact.tags as string);
            formData.append('note', updatedContact.note as string);
            formData.append('photo', photo as Blob);
            formData.append('eventId', eventId);
            formData.append('eventRegistrationSecret', secret);
            const response = await axios.post('/api/contacts/single', formData);
            const newContactId = response.data.id;
            //TODO: redirect to contact page
        } else if (!isNew && contactId && secret && eventId){
            const formData = new FormData();
            formData.append('name', updatedContact.name);
            formData.append('pronouns', updatedContact.pronouns as string);
            formData.append('role', updatedContact.role as string);
            formData.append('tags', updatedContact.tags as string);
            formData.append('note', updatedContact.note as string);
            formData.append('photo', photo as Blob);
            formData.append('eventId', eventId);
            formData.append('adminSecret', secret);
            const response = await axios.put(`/api/contacts/${contactId}`, formData);
            getContact();
        }
    };
    const handleDelete = async () => {
        if (contactId && secret && !isNew){
            await axios.post(`/api/contacts/delete/${contactId}`, { adminSecret:secret });
            //redirect to manage page
            window.location.href = `/event/${eventId}/manage/${secret}`;
        }
    };
    const handleCancel = () => {
        setIsEditing(false);
    };
    const handlePhotoChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files){
            setPhoto(e.target.files[0]);
        }
    };
    return <div className="EditContact">
        <h1>Edit Contact</h1>
        <div className='contactImage'>
            <img src={photo ? URL.createObjectURL(photo) : contact?.photo} alt='contact'/>
            {isEditing ? <input type='file' accept='image/*' onChange={handlePhotoChange}/> : null}
        </div>
        <div className='contactInfo'>
            {isEditing ? 
                <>
                    <label>Name</label>
                    <br/>
                    <input type='text' value={updatedContact.name} onChange={(e) => setUpdatedContact({ ...updatedContact, name: e.target.value })} />
                    <br className='bigBreak'/>
                    <label>Pronouns</label>
                    <br/>
                    <input type='text' value={updatedContact.pronouns} onChange={(e) => setUpdatedContact({ ...updatedContact, pronouns: e.target.value })} />
                    <br className='bigBreak'/>
                    <label>Year, Role, etc</label>
                    <br/>
                    <input type='text' value={updatedContact.role} onChange={(e) => setUpdatedContact({ ...updatedContact, role: e.target.value })} />
                    <br className='bigBreak'/>
                    <label>Tags (comma separated)</label>
                    <br/>
                    <input type='text' value={updatedContact.tags} onChange={(e) => setUpdatedContact({ ...updatedContact, tags: e.target.value })} />
                    <br className='bigBreak'/>
                    <label>Note</label>
                    <br/>
                    <textarea value={updatedContact.note} onChange={(e) => setUpdatedContact({ ...updatedContact, note: e.target.value })} />
                    <br className='bigBreak'/>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </>
                : 
                <>
                    <h2>{contact?.name as string}</h2>
                    <br/>
                    <h3>{contact?.pronouns as string}</h3>
                    <br/>
                    <p>{contact?.role as string}</p>
                    <br/>
                    <div>
                        {contact?.tags?.split(',').map((tag:string) => <h4 className='tag'>{tag}</h4>)}
                    </div>
                    <br/>
                    <p>{contact?.note as string}</p>
                    <br/>
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                </>
            }
        </div>
    </div>;
};