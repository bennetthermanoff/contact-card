import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { VcardJson, getEntry } from './types/Vcard';
import { ContactImage } from './Components/ContactImage';
import { DownloadButton } from './Components/DownloadButton';

function App() {
  const [contact, setContact] = React.useState<VcardJson>({FN:'Contact not found'});
  const [contactId, setContactId] = React.useState<string>('bennett');

  React.useEffect(() => {
    getContact();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[contactId]);

  const getContact = async () => {
    try {
    const response = await axios.get(`/api/person/${contactId}`);
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
        <ContactImage contact={contact} />
        <input type="text" value={contactId} onChange={(e) => setContactId(e.target.value)} />
        <DownloadButton contactId={contactId} />
      </header>
    </div>
  );
}

export default App;
