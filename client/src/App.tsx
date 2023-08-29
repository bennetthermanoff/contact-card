import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { getContactById } from './api/contactApi';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';
import { DownloadButton } from './Components/DownloadButton';
import { MajorTags } from './Components/MajorTags';

export const App = () => {
    const [contact, setContact] = useState<VcardJson>({
        FN: 'Contact Loading',
        'X-PHONETIC-FIRST-NAME':'(load/ing)',
        'ORG':'loading',
        NOTE: 'loading',
    });
    const [isQrDisplayed, setIsQrDisplayed] = useState(false);
    const idFromParams = window.location.pathname.split('/')[2];

    useEffect(() => {
        getContact();
    }, []);
    useEffect(() => {
        document.title = `${getEntry(contact, 'FN')}`;
    }, [contact]);

    const getContact = async () => {
        try {
            const response = await getContactById(idFromParams);
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

    return (
        <div className="App">
            <div className="cardContainer">
                <div className="rowGroup">
                    <div className="contactImage">
                        {!isQrDisplayed ? <div className='gradeTag'>{`${getEntry(contact, 'ROLE')}`}</div> : null}
                        <ContactImage
                            contact={contact}
                            size={300}
                            isQrDisplayed={isQrDisplayed}
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
                    <DownloadButton contactId={idFromParams} />
                    <button
                        className='contactButton'
                        onClick={() => setIsQrDisplayed(!isQrDisplayed)}
                    >Show QR</button>
                </div>
            </div>
        </div>
    );
};
