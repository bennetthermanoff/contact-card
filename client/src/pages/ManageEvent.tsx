import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import  '../css/manageEvent.css';

type Event = {
    id:string,
    name:string,
    adminSecret:string,
    registerSecret:string,
    icon:string,
    primaryColor:string,
    secondaryColor:string
};

export const ManageEvent = () => {

    const { eventId, adminSecret } = useParams<{eventId:string, adminSecret:string}>();
    const [event, setEvent] = useState<Event|null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [icon, setIcon] = useState<File|null>(null);
    const [updatedEvent, setUpdatedEvent] = useState<Pick<Event, 'name'|'primaryColor'|'secondaryColor'>>({ name: '', primaryColor: '', secondaryColor: '' });


    const handleIconChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setIcon(e.target.files[0]);
        }
    };

    const getEvent = async () => {
        try {
            const response = await axios.get(`/api/event/${eventId}/${adminSecret}`);
            const event = response.data as Event;
            setEvent(event);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getEvent();
    }, []);

    const deleteEvent = async () => {
        if (window.confirm('Are you sure you want to delete this event?')){
            try {
                await axios.delete(`/api/event/${eventId}/${adminSecret}` );
                window.location.href = '/'; 
            } catch (error) {
                console.log(error);
            }
        }
    };

    const sendUpdate = async () => {
        const form = new FormData();
        if (icon) {
            form.append('icon', icon as Blob);
        }
        form.append('name', updatedEvent.name);
        form.append('primaryColor', updatedEvent.primaryColor);
        form.append('secondaryColor', updatedEvent.secondaryColor);
        try {
            await axios.put(`/api/event/${eventId}/${adminSecret}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            getEvent();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <div className="ManageEvent" style={{ backgroundColor:event?.secondaryColor }}>
                <h1>Manage Event</h1>
                <div className='nameImg' style={{ backgroundColor:event?.primaryColor }}> 
                    {!isEditing ? <h2>{event?.name}</h2> :
                        <>
                            <input type='text' value={updatedEvent?.name} readOnly={!isEditing} onChange={(e) => setUpdatedEvent({ ...updatedEvent, name: e.target.value })} />
                            <br/>
                        </>}
                    <img src={event?.icon} alt="event icon"  />
                    <br/>
                    {isEditing ? <input type='file' name='icon' className='movedUpload' onChange={handleIconChange} accept='image/*' multiple={false} /> : null}
                    {isEditing ? <>
                        <br className='zerobreak'/>
                        <label>Primary Color</label>
                        <input type='color' value={updatedEvent?.primaryColor} onChange={(e) => setUpdatedEvent({ ...updatedEvent, primaryColor: e.target.value })} />
                        <label>Secondary Color</label>
                        <input type='color' value={updatedEvent?.secondaryColor} onChange={(e) => setUpdatedEvent({ ...updatedEvent, secondaryColor: e.target.value })} />
                        <br/>
                    </> : null}
                    <button onClick={deleteEvent} className='deleteButton'>Delete Event</button>
                    <button className='editButton' onClick={() => {
                        setUpdatedEvent(event as Pick<Event, 'name'|'primaryColor'|'secondaryColor'>);
                        setIsEditing(!isEditing);
                    }}>{isEditing ? 'Cancel' : 'Edit'}</button>
                    {isEditing ? <button onClick={sendUpdate} className='confirmButton'>Submit</button> : null}
                </div>
                <div className='copyableLink'>
                    <h3>Admin Link</h3>
                    <input type='text' value={`${window.location.origin}/event/${eventId}/manage/${adminSecret}`} readOnly />
                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/event/${eventId}/manage/${adminSecret}`)}>Copy</button>
                </div>
                <div className='copyableLink'>
                    <h3>Registration Link</h3>
                    <input type='text' value={`${window.location.origin}/event/${eventId}/${event?.registerSecret}/create/new`} readOnly />
                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/event/${eventId}/${event?.registerSecret}/create/new`)}>Copy</button>
                </div>
            </div>
            <div className='eventContacts' style={{ backgroundColor:event?.secondaryColor }}>
                <h2>Event Contacts</h2>
                <div className='contactList'>
                    {/* <ContactCard contact={contact} /> */}
                </div>
            </div>
        </>
    );
    
};