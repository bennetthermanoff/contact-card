/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';
import { DownloadButton } from './Components/DownloadButton';
import { QR } from './Components/QR';

export const App = () => {
  const [contact, setContact] = useState<VcardJson>({FN:'Contact not found'});
  const idFromParams = window.location.pathname.split("/")[2];

  useEffect(() => {
    getContact();
  },[]);

  const getContact = async () => {
    try {
    const response = await axios.get(`/api/person/${idFromParams}`);
    setContact(response.data);
    }
    catch (error) {
      console.log(error);
    }
  };
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{`Name: ${getEntry(contact, "FN")}`}</h2>
        <ContactImage contact={contact}/>
        <DownloadButton contactId={idFromParams} />
        <QR size={256}/>
      </header>
    </div>
  );
}


