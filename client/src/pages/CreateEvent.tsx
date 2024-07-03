import { useState } from 'react';
import axios from 'axios';
import '../css/createEvent.css';
import { useNavigate } from 'react-router-dom';
export const CreateEvent = () => {
    const [formData, setFormData] = useState<{name:string,
        password:string,
        primaryColor:string,
        secondaryColor:string
    }>({
        name: '',
        password: '',
        primaryColor: '#d94f4f',
        secondaryColor: '#f1d929' });
    const [icon, setIcon] = useState<File|null>(null);
    const navigate = useNavigate();

    const handleFormChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleIconChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setIcon(e.target.files[0]);
        }
    };
    
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData();
        //all in body except icon
        form.append('icon', icon as Blob);
        form.append('name', formData.name);
        form.append('password', formData.password);
        form.append('primaryColor', formData.primaryColor);
        form.append('secondaryColor', formData.secondaryColor);
        try {
            axios.post('/api/event/create', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then((response) => {
                const data = response.data as {id:string, adminSecret:string, registerSecret:string};
                navigate(`/event/${data.id}/manage/${data.adminSecret}`);
            });
        } catch (error) {
            console.log(error);
        }
    };
        


    return (<div className="CreateEvent">
        <form onSubmit={handleSubmit} className="CreateEventForm">
            <h1>Create Event</h1>


            <label>Event Name</label>
            <br/>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Big Cool Conference" required/>
            <br className="bigBreak"/>

            <label>Password</label>
            <br/>
            <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder="Password" required/>
            <br className="bigBreak"/>

            <label>Primary Color</label>
            <br/>
            <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleFormChange} />
            <br className="bigBreak"/>

            <label>Secondary Color</label>
            <br/>
            <input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleFormChange} />
            <br className="bigBreak"/>

            <label>Event Icon</label>
            <br/>
            <input type="file" name="icon" onChange={handleIconChange} accept="image/*" multiple={false}/>
            <br className="bigBreak"/>

            <button type="submit" className="bigButton"
            >Create Event</button>
        </form>
    </div>);
};