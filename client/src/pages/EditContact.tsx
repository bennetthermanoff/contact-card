import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import  '../css/editContact.css';

type contactJSON = {
    name:string,
    pronouns?:string,
    role?:string,
    tags?:string,
    note?:string,
    eventId:string,
};
export const EditContact = () => {
    const { eventId, registrationSecret, contactId } = useParams<{eventId:string, registrationSecret:string, contactId:string}>();
    const [contact, setContact] = useState<contactJSON>();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContact, setUpdatedContact] = useState<Pick<contactJSON, 'name'|'pronouns'|'role'|'tags'|'note'>>({ name: '' });
    const getContact = async () => {
        try {
            const response = await axios.get(`/api/event/${eventId}/${registrationSecret}/contact/${contactId}`);
        //TODO
        } catch (error) {
        }};

    




    return <div className="EditContact">
        <h1>Edit Contact</h1>
    </div>;
};