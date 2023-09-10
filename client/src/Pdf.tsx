import React, { useState, useEffect } from 'react';
import './Pdf.css';
import { getContactById, getAllContacts } from './api/contactApi';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';
import { MajorTags } from './Components/MajorTags';


export const PdfApp = () => {
    const [contact, setContact] = useState<VcardJson>({
        FN: 'Contact Loading',
        'X-PHONETIC-FIRST-NAME':'(load/ing)',
        'ORG':'loading',
        NOTE: 'loading',
    });
    const idFromParams = window.location.pathname.split('/')[2];

    useEffect(() => {
        const load = async () => {
            await getContact();
            var makepdf = document.getElementById('generatePDF');
            var mywindow = window.open('', 'PRINT', 'height=600,width=600');
            if (mywindow && makepdf) {
                mywindow.document.write(makepdf.innerHTML);
                mywindow.document.close();
                mywindow.focus();
                mywindow.print();
            }
            
        };
        load();
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
        <div className="PdfApp">
            <div id="generatePDF">
                <div className="rowGroup">
                    <div className="contactImage">
                        <ContactImage
                            contact={contact}
                            size={200}
                            isQrDisplayed={true}
                            pdf={true}
                        />
                    </div>
                    <div className="pdf-contactInfo">
                        <div className='rowGroup'>
                            <h1 className="contactName">{`${getEntry(contact, 'FN')}`}</h1> 
                        </div>
                        <h3 className="contactPronouns">{`${getEntry(contact,'TITLE')}`}</h3>
                        <MajorTags contact={contact} pdf={true}/>                 
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
};

export const PdfAppAll = () => {
    const [contacts, setContacts] = useState<VcardJson[]>([]);
    const [chunks, setChunk] = useState<Array<VcardJson[]>>([]);
    useEffect(() => {
        const load = async () => {
            const response = await getAllContacts();
            const contacts: VcardJson[] = response.data;

            setContacts(contacts);
        };
        load();
    },[]);
    useEffect(() => {
        const chunkSize = 10;
        const currentChunks = [];
        for (let i = 0; i < contacts.length; i += chunkSize) {
            currentChunks.push(contacts.slice(i, i + chunkSize));
        }  
        setChunk(currentChunks);
    },[contacts]);

    return (
        <div className="Pdf-Container">
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
