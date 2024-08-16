import React from 'react';

const NameForm = ({ name, setName }) => {
  const handleChange = (event) => {
    setName(event.target.value); // Actualiza el estado del nombre en tiempo real
  };

  return (
    <form>
      <label>
        Nombre:
        <input type="text" value={name} onChange={handleChange} />
      </label>
    </form>
  );
};

export default NameForm;
