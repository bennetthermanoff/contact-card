import React, { useState, useEffect } from 'react';
import './Pdf.css';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';
import { MajorTags } from './Components/MajorTags';
import { useParams } from 'react-router-dom';
import axios from 'axios';


export const PdfApp = () => {
    const [contacts, setContacts] = useState<VcardJson[]>([]);
    const [chunks, setChunk] = useState<Array<VcardJson[]>>([]);
    const { eventId, adminSecret, contactIdsFromParams } = useParams<{eventId: string, adminSecret: string, contactIdsFromParams: string}>();
    

    useEffect(() => {
        const load = async () => {
            try {
                const response = await axios.get(`/api/contacts/all/${eventId}/${adminSecret}`);
                const contacts = response.data as Array<VcardJson>;
                contacts.sort((a, b) => {
                    const aName = getEntry(a, 'FN') as string;
                    const bName = getEntry(b, 'FN') as string;
                    return aName.localeCompare(bName);
                });
                //filter contacts by contactIdsFromParams
                const contactIds = contactIdsFromParams?.split(',');
                if (contactIds && contactIdsFromParams !== 'all') {
                    const filteredContacts = contacts.filter((contact) => {
                        if (!contact.id) {
                            return false;
                        }
                        return contactIds.includes(contact.id);
                    });
                    setContacts(filteredContacts);
                } else {
                    setContacts(contacts);
                }
            } catch (error) {
                console.log(error);
            }
        };
        load();
    },[eventId, adminSecret, contactIdsFromParams]);
    useEffect(() => {
        const chunkSize = 10;
        const currentChunks = [];
        for (let i = 0; i < contacts.length; i += chunkSize) {
            currentChunks.push(contacts.slice(i, i + chunkSize));
        }  
        setChunk(currentChunks);
    },[contacts]);        

    return (
        <div style={{ backgroundColor:'white', color:'black' }} className="Pdf-Container">
            {chunks.map((chunk, index) => {
                return (
                    <div className="Pdf-Page-Container">
                        {chunk.map((contact, index) => {
                            return (
                                <div className="PdfApp-Total">
                                    <div id="generatePDF">
                                        <div className="rowGroup">
                                            <div className="contactImage">
                                                <ContactImage
                                                    contact={contact}
                                                    size={180}
                                                    isQrDisplayed={true}
                                                    pdf={true}
                                                    id={eventId}
                                                />
                                            </div>
                                            <div className="pdf-contactInfo" >
                                                <div className='rowGroup'>
                                                    <h1 id="pdf-name" className="contactName">{`${getEntry(contact, 'FN')}`}</h1> 
                                                </div>
                                                <h3 id="pdf-pronouns" className="contactPronouns">{`${getEntry(contact,'TITLE')}`}</h3>
                                                <MajorTags contact={contact} pdf={true}/>        
                                                <div className="gradeTag-Pdf">{`${getEntry(contact, 'ROLE')}`}</div>                 
                                            </div>
                    
                                        </div>
                
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );

};
