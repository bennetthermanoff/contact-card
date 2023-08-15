import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';
import { DownloadButton } from './Components/DownloadButton';
import { MajorTags } from './Components/MajorTags';

export const App = () => {
    const [contact, setContact] = useState<VcardJson>({
        FN: 'Contact not found',
    });
    const [isQrDisplayed, setIsQrDisplayed] = useState(false);
    const idFromParams = window.location.pathname.split('/')[2];

    useEffect(() => {
        getContact();
    }, []);

    const getContact = async () => {
        try {
            const response = await axios.get(`/api/person/${idFromParams}`);
            setContact(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="App">
            <div className="cardContainer">
                <div className="rowGroup">
                    <div className="contactImage">
                        <ContactImage
                            contact={contact}
                            size={300}
                            isQrDisplayed={isQrDisplayed}
                        />
                    </div>
                    <div className="contactInfo">
                        <h1 className="contactName">{`${getEntry(contact, 'FN')}`}</h1>
                        <h3 className="contactPronouns">{`${getEntry(contact,'X-PHONETIC-FIRST-NAME')} ${getEntry(contact,'X-PHONETIC-LAST-NAME')}`}</h3>
                        <MajorTags contact={contact}/>                    
                    </div>
                </div>
                <div className="contactDescription">
                    <p className="contactDescription">{`${getEntry(contact, 'NOTE')}`}</p>
                </div>
                <div className="contactButtons">
                    <DownloadButton contactId={idFromParams} />
                    <button
                        className='qrButton'
                        onClick={() => setIsQrDisplayed(!isQrDisplayed)}
                    >Show QR</button>
                </div>
            </div>
        </div>
    );
};
