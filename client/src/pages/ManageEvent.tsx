import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import  '../css/manageEvent.css';
import { read, utils } from 'xlsx';

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

    //upload
    const [xlsx, setXlsx] = useState<File|null>(null);
    const [photos, setPhotos] = useState<FileList|null>(null);
    const [uploadedColumns, setUploadedColumns] = useState<Array<string>>([]);
    const [columnLookup, setColumnLookup] = useState<{
        photoName:string,
        id:string,
        name:string,
        pronouns:string,
        year:string,
        description:string,
        majors:string
    }>({
        photoName: 'NULL',
        id: 'NULL',
        name: 'NULL',
        pronouns: 'NULL',
        year: 'NULL',
        description: 'NULL',
        majors: 'NULL'
    });
    
    const handleXlsxChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setXlsx(e.target.files[0]);
        }
    };
    const updateUploadedColumns = async (xlsxFile:File) => {
        const reader = new FileReader();
        reader.onload = (e:ProgressEvent<FileReader>) => {
            const data = e.target?.result;
            const workbook = read(data, { type: 'array' });
            const columns:Array<string> = ['NULL'];
            const sheet1 = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]],{ header:1 }) as any[][];
            if (sheet1.length > 0){
                const firstRow = sheet1[0];
                for (let i = 0; i < firstRow.length; i++){
                    columns.push(firstRow[i]);
                }
            }
            setUploadedColumns(columns);
        };
        reader.readAsArrayBuffer(xlsxFile);

    };
    useEffect(() => {
        if (xlsx){
            updateUploadedColumns(xlsx);
        }
    }, [xlsx]);
    
    const handlePhotosChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos(e.target.files);
        }
    };
    const handleUploadSubmit = async (e:React.FormEvent<HTMLFormElement>) => {};


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
                <h2>Upload Contacts</h2>
                <form onSubmit={handleUploadSubmit} className="uploadContactsForm">
                    <label>xlsx Upload</label>
                    <input type="file" name="xlsx" onChange={handleXlsxChange} accept="file/xlsx" multiple={false}/>
                    <br/>
                    <label>Photos Upload</label>
                    <input type="file" name="photos" onChange={handlePhotosChange} accept="image/*" multiple={true}/>
                    <br/>
                    {/* table with each row containing one column from columnLookup and next to it a dropdown of uploadedColumns */}
                    {uploadedColumns.length > 0 ? <table>
                        {Object.keys(columnLookup).map((column) => {
                            return <tr key={column}>
                                <td>{column}</td>
                                <td>
                                    <select value={columnLookup[column as keyof typeof columnLookup]} onChange={(e) => setColumnLookup({ ...columnLookup, [column]: e.target.value })}>
                                        {uploadedColumns.map((uploadedColumn) => {
                                            return <option key={uploadedColumn} value={uploadedColumn}>{uploadedColumn}</option>;
                                        })}
                                    </select>
                                </td>
                            </tr>;
                        })}
                    </table> : null}
                        

                </form>
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