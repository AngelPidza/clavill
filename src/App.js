import React, { useState, useEffect, useCallback } from 'react';
import './App.css'

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

  const handleConversion = useCallback(() => {
    setError('');
    let result = '';

    if (bits === 'ASCII') {
      if (mode === 'encode') {
        result = Array.from(inputText).map(char => ASCII_TABLE[char] || char).join(' ');
      } else {
        const codes = inputText.split(' ');
        result = codes.map(code => REVERSE_ASCII_TABLE[code] || code).join('');
      }
    } else {
      const table = mode === 'encode' ? ENCODING_TABLES[bits] : reverseTable(ENCODING_TABLES[bits]);
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
  }, [inputText, bits, mode]);

  useEffect(() => {
    handleConversion();
  }, [handleConversion]);

  return (
    <div id='container' style={{maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', fontFamily: 'Arial, sans-serif', alignContent: 'center'}}>
      <h1 style={{textAlign: 'center', color: '#333'}} className="heading">
        <span className="heading-highlight" style={{color: '#1A8FE3'}}>Real-time</span>{' '}
        <span className="heading-normal" >Text Encoder/Decoder</span>
      </h1>
      <div style={{marginBottom: '10px'}}>
        <label style={{display: 'block', marginBottom: '5px'}}>Mode:</label>
        <div>
          <label style={{marginRight: '10px'}}>
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

      <div style={{marginBottom: '10px'}}>
        <label htmlFor="bits" style={{display: 'block', marginBottom: '5px'}}>Encoding:</label>
        <select
          id="bits"
          style={{width: '100%', padding: '5px'}}
          value={bits}
          onChange={(e) => setBits(e.target.value)}
        >
          <option value="2">2 bits</option>
          <option value="4">4 bits</option>
          <option value="8">8 bits</option>
          <option value="ASCII">ASCII</option>
        </select>
      </div>

      <div style={{marginBottom: '10px'}}>
        <label htmlFor="input" style={{display: 'block', marginBottom: '5px'}}>Input:</label>
        <textarea
          id="input"
          style={{width: '100%', padding: '5px', height: '100px'}}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={mode === 'encode' ? "Enter text to encode" : "Enter text to decode"}
        />
      </div>

      {error && (
        <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>
      )}

      <div>
        <h2>Output:</h2>
        <p style={{wordBreak: 'break-all', backgroundColor: '#f0f0f0', padding: '10px', minHeight: '100px'}}>{outputText}</p>
      </div>
    </div>
  );
}

export default App;