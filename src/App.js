import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const ENCODING_TABLES = {
  '2': {
    'a': 'cc', 'b': 'ko', 'c': 'ef', 'd': 'ee', 'e': 'xc', 'f': 'ki', 'g': 'tr', 'h': 'fe',
    'i': 'mn', 'j': 'op', 'k': 'gh', 'l': 're', 'm': 'nm', 'n': 'pi', 'o': 'al', 'p': 'de',
    'q': 'uq', 'r': 'pe', 's': 'ws', 't': 'hj', 'u': 'qe', 'v': 'pa', 'w': 'lo', 'x': 'xe',
    'y': 'qa', 'z': 'po', ' ': 'ep'
  },
  '4': {
    'a': 'ccko', 'b': 'kocc', 'c': 'cghm', 'd': 'plim', 'e': 'xcki', 'f': 'srft', 'g': 'hmkl', 'h': 'iatr',
    'i': 'mnop', 'j': 'jqls', 'k': 'hntm', 'l': 'tecn', 'm': 'uqpe', 'n': 'nooo', 'o': 'opls', 'p': 'piro',
    'q': 'qepa', 'r': 'rsss', 's': 'amoa', 't': 'lina', 'u': 'qapo', 'v': 'pque', 'w': 'redp', 'x': 'esot',
    'y': 'popa', 'z': 'poqa', ' ': 'espc'
  },
  '8': {
    'a': 'A1B2C3D4', 'b': 'E5F6G7H8', 'c': 'I9J0K1L2', 'd': 'M3N4O5P6', 'e': 'Q7R8S9T0', 'f': 'U1V2W3X4',
    'g': 'Y5Z6A7B8', 'h': 'C9D0E1F2', 'i': 'G3H4I5J6', 'j': 'K7L8M9N0', 'k': 'O1P2Q3R4', 'l': 'S5T6U7V8',
    'm': 'W9X0Y1Z2', 'n': 'A3B4C5D6', 'o': 'E7F8G9H0', 'p': 'I1J2K3L4', 'q': 'M5N6O7P8', 'r': 'Q9R0S1T2',
    's': 'U3V4W5X6', 't': 'Y7Z8A9B0', 'u': 'C1D2E3F4', 'v': 'G5H6I7J8', 'w': 'K9L0M1N2', 'x': 'O3P4Q5R6',
    'y': 'S7T8U9V0', 'z': 'W1X2Y3Z4', ' ': '3SP4C3FG'
  },
  '16': {
    'a': 'A1B2C3D4E5F6G7H8', 'b': 'I9J0K1L2M3N4O5P6', 'c': 'Q7R8S9T0U1V2W3X4', 'd': 'Y5Z6A7B8C9D0E1F2',
    'e': 'G3H4I5J6K7L8M9N0', 'f': 'P1Q2R3S4T5U6V7W8', 'g': 'X9Y0Z1A2B3C4D5E6', 'h': 'F7G8H9I0J1K2L3M4',
    'i': 'N5O6P7Q8R9S0T1U2', 'j': 'V3W4X5Y6Z7A8B9C0', 'k': 'D1E2F3G4H5I6J7K8', 'l': 'L9M0N1O2P3Q4R5S6',
    'm': 'T7U8V9W0X1Y2Z3A4', 'n': 'B5C6D7E8F9G0H1I2', 'o': 'J3K4L5M6N7O8P9Q0', 'p': 'R1S2T3U4V5W6X7Y8',
    'q': 'Z9A0B1C2D3E4F5G6', 'r': 'H7I8J9K0L1M2N3O4', 's': 'P5Q6R7S8T9U0V1W2', 't': 'X3Y4Z5A6B7C8D9E0',
    'u': 'F1G2H3I4J5K6L7M8', 'v': 'N9O0P1Q2R3S4T5U6', 'w': 'V7W8X9Y0Z1A2B3C4', 'x': 'D5E6F7G8H9I0J1K2',
    'y': 'L3M4N5O6P7Q8R9S0', 'z': 'T1U2V3W4X5Y6Z7A8', ' ': 'B9C0D1E2F3G4H5I6'
  },
  '32': {
    'a': '00000001000000100000001100000100', 'b': '00000010000000110000001100001000', 'c': '00000100000001000000010000001100',
    'd': '00000110000001110000010100000100', 'e': '00001000000010000000011000001000', 'f': '00001010000010110000011100001100',
    'g': '00001100000011000000010000001100', 'h': '00001110000011110000010100000100', 'i': '00010000000100000000011000001000',
    'j': '00010010000100110000011100001100', 'k': '00010100000101000000010000001100', 'l': '00010110000101110000010100000100',
    'm': '00011000000110000000011000001000', 'n': '00011010000110110000011100001100', 'o': '00011100000111000000010000001100',
    'p': '00011110000111110000010100000100', 'q': '00100000001000000000011000001000', 'r': '00100010001000110000011100001100',
    's': '00100100001001000000010000001100', 't': '00100110001001110000010100000100', 'u': '00101000001010000000011000001000',
    'v': '00101010001010110000011100001100', 'w': '00101100001011000000010000001100', 'x': '00101110001011110000010100000100',
    'y': '00110000001100000000011000001000', 'z': '00110010001100110000011100001100', ' ': '00110100001101000000010000001100'
  }
};

const ASCII_TABLE = Object.fromEntries([...Array(128)].map((_, i) => [String.fromCharCode(i), i.toString().padStart(3, '0')]));
const REVERSE_ASCII_TABLE = Object.fromEntries(Object.entries(ASCII_TABLE).map(([k, v]) => [v, k]));

const reverseTable = (table) => Object.fromEntries(Object.entries(table).map(([k, v]) => [v, k]));

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [bits, setBits] = useState('2');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');
  const [customTable, setCustomTable] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const handleConversion = useCallback(() => {
    setError('');
    let result = '';

    if (bits === 'ASCII') {
      if (mode === 'encode') {
        result = Array.from(inputText).map(char => ASCII_TABLE[char] || char).join(' ');
      } else {
        result = inputText.split(' ').map(code => REVERSE_ASCII_TABLE[code] || code).join('');
      }
    } else {
      const table = customTable || (mode === 'encode' ? ENCODING_TABLES[bits] : reverseTable(ENCODING_TABLES[bits]));
      
      if (!table) {
        setError(`Invalid encoding: ${bits} bits`);
        return;
      }

      if (mode === 'encode') {
        result = Array.from(inputText.toLowerCase()).map(char => table[char] || char).join('');
      } else {
        let buffer = '';
        for (let char of inputText) {
          buffer += char;
          if (table[buffer]) {
            result += table[buffer];
            buffer = '';
          }
        }
        if (buffer) {
          setError('Invalid encoded text');
          return;
        }
      }
    }

    setOutputText(result);
  }, [inputText, bits, mode, customTable]);

  const handleDownload = () => {
    const table = bits === 'ASCII' ? ASCII_TABLE : (customTable || ENCODING_TABLES[bits]);
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(table, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `encoding_table_${bits}_bits.json`;
    document.body.appendChild(element);
    element.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const uploadedTable = JSON.parse(e.target.result);
          setCustomTable(uploadedTable);
          setSelectedFile(file.name);
        } catch (error) {
          setError('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileClear = () => {
    setCustomTable(null);
    setSelectedFile(null);
    document.getElementById('fileInput').value = null;
  };

  useEffect(() => {
    handleConversion();
  }, [handleConversion]);

  return (
    <div id='container' style={{ maxWidth: '505px', margin: '20px auto', padding: '30px', border: '5px solid #04b0db', borderRadius: '5px', fontFamily: 'Arial, sans-serif', alignContent: 'center' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }} className="heading">
        <span className="heading-highlight" style={{ color: '#1A8FE3' }}>Real-time</span>{' '}
        <span className="heading-normal">Text Encoder/Decoder</span>
      </h1>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Mode:</label>
        <div>
          <label style={{ marginRight: '10px' }}>
            <input
              type="radio"
              value="encode"
              checked={mode === 'encode'}
              onChange={() => setMode('encode')}
            /> Encode
          </label>
          <label>
            <input
              type="radio"
              value="decode"
              checked={mode === 'decode'}
              onChange={() => setMode('decode')}
            /> Decode
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="bits" style={{ display: 'block', marginBottom: '5px' }}>Encoding:</label>
        <select
          id="bits"
          style={{ width: '100%', padding: '5px' }}
          value={bits}
          onChange={(e) => setBits(e.target.value)}
        >
          <option value="2">2 bits</option>
          <option value="4">4 bits</option>
          <option value="8">8 bits</option>
          <option value="16">16 bits</option>
          <option value="32">32 bits</option>
          <option value="ASCII">ASCII</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="input" style={{ display: 'block', marginBottom: '5px' }}>Input:</label>
        <textarea
          id="input"
          style={{ width: '100%', padding: '5px', height: '100px' }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={mode === 'encode' ? "Enter text to encode" : "Enter text to decode"}
        />
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}

      <div style={{ marginBottom: '10px'}}>

        <label htmlFor="output" style={{ display: 'block', marginBottom: '5px' }}>Output:</label>
          <textarea
          id="output"
          style={{ width: '100%', padding: '5px', height: '100px' }}
          value={outputText}
          readOnly
          placeholder="Output will be shown here"
          />
      </div>
    <button
      style={{
        width: '100%', backgroundColor: '#1A8FE3', color: '#fff', padding: '10px', border: 'none',
        borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px'
      }}
      onClick={handleDownload}
    >
      Download Encoding Key
    </button>

    <div style={{ marginBottom: '10px' }}>
        <input
          type="file"
          id="fileInput"
          style={{ marginBottom: '10px'}}
          accept=".json"
          onChange={handleFileUpload}
        />
        {selectedFile && (
          <button
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleFileClear}
          >
            Clear File
          </button>
        )}
    </div>
</div>
);
}

export default App;