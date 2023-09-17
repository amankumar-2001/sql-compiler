import React from "react";
import styled from "styled-components";

const AlertBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const AlertContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Button = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled.button`
  cursor: pointer;
  font-size: 18px;

  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 36px;
`;

const AlertTitle = styled.div`
  font-size: 40px;
  display: flex;
  justify-content: center;
  font-weight: 600;
  padding: 15px 0px;
`;

const AlertText = styled.div`
  font-size: 25px;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const Alert = ({ message, onClose }) => {
  return (
    <AlertBackdrop>
      <AlertContainer>
        <AlertTitle>Warning!!</AlertTitle>
        {message.map((text) => {
          return <AlertText>{text}</AlertText>;
        })}
        <Button>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </Button>
      </AlertContainer>
    </AlertBackdrop>
  );
};

export default Alert;
