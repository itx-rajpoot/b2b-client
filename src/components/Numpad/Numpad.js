import React, { useState, useEffect } from 'react';
import './Numpad.less';

export default function Numpad({ onChange }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
    return () => {};
  }, [value, onChange]);

  const handlePress = (a) => {
    setValue(value + a);
  };
  const handleDel = () => {
    setValue(value.slice(0, -1));
  };

  return (
    <div className="numpad-container">
      <div className="number">
        <span onClick={() => handlePress('1')}>
          <i>1</i>
        </span>
        <span onClick={() => handlePress('2')}>
          <i>2</i>
        </span>
        <span onClick={() => handlePress('3')}>
          <i>3</i>
        </span>
        <span onClick={() => handlePress('4')}>
          <i>4</i>
        </span>
        <span onClick={() => handlePress('5')}>
          <i>5</i>
        </span>
        <span onClick={() => handlePress('6')}>
          <i>6</i>
        </span>
        <span onClick={() => handlePress('7')}>
          <i>7</i>
        </span>
        <span onClick={() => handlePress('8')}>
          <i>8</i>
        </span>
        <span onClick={() => handlePress('9')}>
          <i>9</i>
        </span>
      </div>
      <div className="number">
        <span />
        <span onClick={() => handlePress('0')}>
          <i>0</i>
        </span>
        <span>
          <i className="delete" onClick={handleDel}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="28px"
              height="28px"
              viewBox="0 0 612 612"
              style={{ fill: "rgb(184 186 186)" }}
            >
              <path
                d="M561,76.5H178.5c-17.85,0-30.6,7.65-40.8,22.95L0,306l137.7,206.55c10.2,12.75,22.95,22.95,40.8,22.95H561
  c28.05,0,51-22.95,51-51v-357C612,99.45,589.05,76.5,561,76.5z M484.5,397.8l-35.7,35.7L357,341.7l-91.8,91.8l-35.7-35.7
  l91.8-91.8l-91.8-91.8l35.7-35.7l91.8,91.8l91.8-91.8l35.7,35.7L392.7,306L484.5,397.8z"
              />
            </svg>
          </i>
        </span>
      </div>
    </div>
  );
}
