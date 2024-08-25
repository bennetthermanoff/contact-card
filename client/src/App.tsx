import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { getContactById } from './api/contactApi';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';
import { DownloadButton } from './Components/DownloadButton';
import { MajorTags } from './Components/MajorTags';
import { useParams } from 'react-router-dom';
import { useFavicon } from 'react-usefavicon';

export const App = () => {
    const [contact, setContact] = useState<VcardJson>({
        FN: 'Contact Loading',
        'X-PHONETIC-FIRST-NAME':'(load/ing)',
        'ORG':'loading',
        NOTE: 'loading',
    });
    const [eventData, setEventData] = useState<{name:string, primaryColor:string, secondaryColor:string, icon:string}>({
        name: 'Event Loading',
        primaryColor: '#570d0d',
        secondaryColor: '#290505',
        icon: '',
    });
    const [isQrDisplayed, setIsQrDisplayed] = useState(false);
    //path: '/event/:eventId/contact/:contactId',
    const { eventId, contactId } = useParams<{eventId: string, contactId: string}>();
    useEffect(() => {
        getContact();
        getEvent();
    }, [contactId, eventId]);
    useEffect(() => {
        document.title = `${getEntry(contact, 'FN')}`;
    }, [contact]);
    const [
        faviconHref,
        {
            restoreFavicon,
            drawOnFavicon,
            setEmojiFavicon,
            setFaviconHref,
            jsxToFavicon,
        },
    ] = useFavicon();


    const getContact = async () => {
        try {
            const response = await getContactById(contactId as string);
            setContact(response.data);
        } catch (error) {
            console.log(error);
            setContact({ FN: 'Contact Not Found',
                'X-PHONETIC-FIRST-NAME':'(err/or)',
                'ORG':'not found',
                NOTE: 'contact not found 😔',
            });
        }
    };
    const getEvent = async () => {
        try {
            const response = await axios.get(`/api/event/${eventId}`);
            setEventData(response.data);
            setFaviconHref(response.data.icon);
        } catch (error) {
            console.log(error);
            setEventData({ name: 'Event Not Found',
                primaryColor: '#570d0d',
                secondaryColor: '#290505',
                icon: '',
            });
        }
    };

    return (
        <div className="App" style={{ backgroundColor: eventData.secondaryColor }}>
            <div className="cardContainer" style={{ backgroundColor: eventData.primaryColor }}>
                <div className="rowGroup">
                    <div className="contactImage">
                        {!isQrDisplayed ? <div className='gradeTag'>{`${getEntry(contact, 'ROLE')}`}</div> : null}
                        <ContactImage
                            contact={contact}
                            size={300}
                            isQrDisplayed={isQrDisplayed}
                            eventIcon={eventData.icon}
                        />
                    </div>
                    <div className="contactInfo">
                        <div className='rowGroup'>
                            <h1 className="contactName">{`${getEntry(contact, 'FN')}`}</h1> 
                        </div>
                        <h3 className="contactPronouns">{`${getEntry(contact,'TITLE')}`}</h3>
                        <MajorTags contact={contact}/>                    
                    </div>
                </div>
                <div className="contactDescription">
                    <p className="contactDescription">{//detect new lines and replace with <br>
                        getEntry(contact, 'NOTE')?.toString().split('\\n').map((item, key) => {                            
                            return <span key={key}>{item.replace(/\\/g,'')}<br/></span>;
                        })
                    }</p>
                </div>
                <div className="contactButtons">
                    {/* <DownloadButton contactId={idFromParams} /> */}
                    <button
                        className='contactButton'
                        onClick={() => setIsQrDisplayed(!isQrDisplayed)}
                    >Show QR</button>
                </div>
            </div>
        </div>
    );
};
