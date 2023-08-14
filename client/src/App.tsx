import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
type VcardJson = {
  REV?: VcardEntry;
  FN?: VcardEntry;
  N?: VcardEntry;
  PHOTO?: VcardEntry;
  TEL?: VcardEntry;
  EMAIL?: VcardEntry;
  URL?: VcardEntry;
  ADR?: VcardEntry;
  ORG?: VcardEntry;
  TITLE?: VcardEntry;
  NOTE?: VcardEntry;
  BDAY?: VcardEntry;
  IMPP?: VcardEntry;
  //More of these entries can be added, idk what every vcard entry is
};
type VcardEntry = {
  value: string;
  type: string;
};

function App() {
  const [contact, setContact] = React.useState<VcardJson>({
    
  });
  const getContact = async () => {
    const response = await axios.get('/api/person/bennett');
    setContact(response.data);
  };
  const ContactImage = () => {
    if (contact.PHOTO) {
      return (
        <img
          src={`data:image/png;base64,${contact.PHOTO.value}`}
          alt="profile"
          width="100"
          height="100"
        />
      );
    }
    else {
      return null;
    }
  };
  React.useEffect(() => {
    getContact();
  },[]);
    
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ContactImage />
      </header>
    </div>
  );
}

export default App;
