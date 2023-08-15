import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';
import { DownloadButton } from './Components/DownloadButton';

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
                <div className="contactImage">
                    <ContactImage
                        contact={contact}
                        size={100}
                        isQrDisplayed={isQrDisplayed}
                    />
                </div>
                <div className="contactInfo">
                    <h1 className="contactName">{`Name: ${getEntry(contact, 'FN')}`}</h1>
                    <h3 className="contactPronouns">{`${getEntry(
                        contact,
                        'X-PHONETIC-FIRST-NAME',
                    )}`}</h3>
                    {/* <h2 className='contactMajor'>{`${getEntry(contact, "X-MAJOR")}`}</h2> */}
                </div>
                <div className="contactDescription">
                    <p className="contactDescription">{`${getEntry(contact, 'NOTE')}`}</p>
                </div>
                <div className="contactButtons">
                    <DownloadButton contactId={idFromParams} />
                    <button
                        className='qrButton'
                        onClick={() => setIsQrDisplayed(!isQrDisplayed)}
                    >
            Show QR
                    </button>
                </div>
            </div>
        </div>
    );
};
