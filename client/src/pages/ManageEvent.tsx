import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import  '../css/manageEvent.css';
import { read, utils } from 'xlsx';
import { VcardJson, getEntry } from '../types/Vcard';
import { ContactImage } from '../Components/ContactImage';
import FileResizer from 'react-image-file-resizer';

type Event = {
    id:string,
    name:string,
    adminSecret:string,
    registerSecret:string,
    icon:string,
    primaryColor:string,
    secondaryColor:string
};
type cell = {id:number,name:string}


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
    const [photos, setPhotos] = useState<Array<File>|null>(null);
    const [uploadedColumns, setUploadedColumns] = useState<Array<cell>>([]);
    
    const [columnLookup, setColumnLookup] = useState<{
        photoName:cell,
        name:cell,
        pronouns:cell,
        year:cell,
        description:cell,
        majors:cell,
    }>({
        photoName: { id:-1,name:'NULL' },
        name: { id:-1,name:'NULL' },
        pronouns: { id:-1,name:'NULL' },
        year: { id:-1,name:'NULL' },
        description: { id:-1,name:'NULL' },
        majors: { id:-1,name:'NULL' },
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
            const columns:Array<cell> = [{ id:-1,name:'NULL' }];
            const sheet1 = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]],{ header:1 }) as any[][];
            if (sheet1.length > 0){
                const firstRow:Array<string> = sheet1[0];
                for (let i = 0; i < firstRow.length; i++){
                    columns.push({ id:i, name:firstRow[i] });
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
    
    const handlePhotosChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = e.target.files;
            const resizedPhotos:Array<File> = [];
            await Promise.all(Array.from(files).map(async (file) => {
                const resizedPhoto = await resizeFile(file);
                if (resizedPhoto){
                    resizedPhotos.push(resizedPhoto);
                }
            }));
            
            console.log(resizedPhotos);
            setPhotos(resizedPhotos as Array<File>);
            
        }
    };
    const resizeFile: (file: File) => Promise<File | null> = (file) =>
        new Promise((resolve) => {
            let isResolved = false;
            const timeout = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    resolve(null);
                }
            }, 20000);

            FileResizer.imageFileResizer(
                file,
                1000,
                1000,
                'JPEG',
                75,
                0,
                (uri) => {
                    if (!isResolved) {
                        isResolved = true;
                        clearTimeout(timeout);
                        resolve(uri as File);
                    }
                    if (!(uri instanceof File)) {
                        console.error('Not a file');
                    }
                },
                'file',
            );
        });

    const handleUploadSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!xlsx || !photos){
            return;
        }
        const body = { columnLookup, eventId, adminSecret };
        const form = new FormData();
        form.append('xlsx', xlsx as Blob);
        for (let i = 0; i < photos.length; i++){
            form.append('photos', photos[i]);
        }
        form.append('body', JSON.stringify(body));
        try {
            const response = await axios.post('/api/contacts', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        getContacts();
    };

    const [contacts, setContacts] = useState <Array<VcardJson&{selected?:boolean}>>([]);
    const getContacts = async () => {
        try {
            const response = await axios.get(`/api/contacts/all/${eventId}/${adminSecret}`);
            const contacts = response.data as Array<VcardJson>;      
            //sort by name
            contacts.sort((a, b) => {
                const aName = getEntry(a, 'FN') as string;
                const bName = getEntry(b, 'FN') as string;
                return aName.localeCompare(bName);
            });      
            setContacts(contacts);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getContacts();
    }, []);
    const selectOrDeselectAll = () => {
        const allSelected = contacts.every((contact) => contact.selected);
        contacts.forEach((contact) => {
            contact.selected = !allSelected;
        });
        setContacts([...contacts]);
    };
    const deleteSelected = async () => {
        if (window.confirm('Are you sure you want to delete the selected contacts?')){
            const selectedContacts = contacts.filter((contact) => contact.selected);
            const contactIds = selectedContacts.map((contact) => contact.id);
            try {
                await axios.post('/api/contacts/delete/',{ ids:contactIds, adminSecret });
                getContacts();
            } catch (error) {
                console.log(error);
            }
        }
    };
    const openPDF = () => {            
        let contactIds = contacts.filter((contact) => contact.selected).map((contact) => contact.id).join(',');
        if (contacts.every((contact) => contact.selected) || contacts.every((contact) => !contact.selected)){
            contactIds = 'all';
        }
        window.open(`${window.location.origin }/event/${eventId}/pdf/${adminSecret}/${contactIds}`);
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
                    <input type='text' value={`${window.location.origin }/event/${eventId}/${event?.registerSecret}/create/new`} readOnly />
                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/event/${eventId}/${event?.registerSecret}/create/new`)}>Copy</button>
                </div>
            </div>
            <div className='eventContacts' style={{ backgroundColor:event?.secondaryColor }}>
                <h2>Upload Contacts</h2>
                <form onSubmit={handleUploadSubmit} className="uploadContactsForm">
                    <label>xlsx Upload</label>
                    <br/>
                    <input type="file" style={{  position:'initial', marginBottom:5 }} name="xlsx" onChange={handleXlsxChange} accept="file/xlsx" multiple={false}/>
                    <br/>
                    <label>Photos Upload</label>
                    <br/>
                    <input type="file" style={{  position:'initial', marginBottom:5 }} name="photos" onChange={handlePhotosChange} accept="image/*" multiple={true}/>
                    <br/>
                    {uploadedColumns.length > 0 ? 
                        <>
                            <p style={{ marginBottom:-10 }}>Please select the corrisponding column in your xlsx file for each data type</p>
                            <table>
                                {Object.keys(columnLookup).map((column) => {
                                    return <tr key={column}>
                                        <td>{column}</td>
                                        <td>
                                            <select value={columnLookup[column as keyof typeof columnLookup].id} onChange={(e) => setColumnLookup({ ...columnLookup, [column]: uploadedColumns.find((uploadedColumn) => uploadedColumn.id === parseInt(e.target.value)) as cell })}>
                                                {uploadedColumns.map((uploadedColumn) => {
                                                    return <option key={uploadedColumn.id} value={uploadedColumn.id}>{uploadedColumn.name}</option>;
                                                })}
                                            </select>
                                        </td>
                                    </tr>;
                                })}
                            </table>
                        </> : null}
                    {uploadedColumns.length > 0 && photos ? <button type="submit">Upload</button> : null}
                </form>
            </div>
            <div className='eventContacts' style={{ backgroundColor:event?.secondaryColor }}>
                <h2>Event Contacts</h2>
                <button className='confirmButton' onClick={()=>{
                    //navigate to create contact page
                    window.location.href = `${window.location.origin }/event/${eventId}/${event?.registerSecret}/create/new`;
                }}> Add Contact</button>
                <button className='editButton' onClick={selectOrDeselectAll}>Select/Deselect All</button>
                <button className='editButton' onClick={openPDF}>Generate PDF </button>
                <button className='deleteButton' onClick={deleteSelected}>Delete Selected</button>
                
                <div className='contactList'>
                    {/* flex grid of contacts */}
                    <div style={{ display:'flex', flexWrap:'wrap' }}>
                        {contacts.map((contact) => 
                            <div style={{ border:'solid 2px grey', }}>
                                <input type='checkbox' checked={contact.selected} onChange={() => { contact.selected = !contact.selected; setContacts([...contacts]); }}  style={{ margin:5, width:20, height:20 }}/>
                                <div style={{ padding:0, margin:0, cursor:'pointer' }} 
                                    role='button' 
                                    onClick={() => {window.location.href = `${window.location.origin }/event/${eventId}/contact/${contact.id}`;}}>
                                    <ContactCard key={contact.id} contact={contact} selected={contact.selected} />
                                </div>
                                <button className='editButton' onClick={() => {window.location.href = `${window.location.origin }/event/${eventId}/${event?.adminSecret}/edit/${contact.id}`;}}>Edit Contact</button>
                            </div>)}
                    </div>
                </div>
            </div>
            
        </>
    );
    
};

export const ContactCard = ({ contact,  }: { contact: VcardJson, selected?: boolean }) => {
    return (
        <div className='contactCard' style={{  width:150 }}>
            <ContactImage contact={contact} size={100} isQrDisplayed={false} />
            <h4 style={{ padding:'0 0 0 0', margin:'0 0 0 0 ' }}>{getEntry(contact, 'FN') as string}</h4>
            
        </div>
    );
};