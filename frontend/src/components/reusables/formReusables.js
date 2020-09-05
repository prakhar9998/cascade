import styled from "styled-components";

const Container = styled.div`
  width: 400px;
  background: #222629;
  border: 1px solid #222629;
  border-radius: 10px;
  font: 300 1em "Fira Sans", sans-serif;
`;

const InputContainer = styled.div`
  position: relative;
  margin: 50px auto;
  width: 70%;
`;

const ErrorContainer = styled.span`
  color: #c96567;
  font-size: 12px;
`;

const Form = styled.form``;

const Label = styled.label`
  color: #f2f2f2;
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 300ms ease all;
`;

const Input = styled.input`
  background: none;
  font-size: 18px;
  display: block;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #f2f2f2;
  width: 100%;
  padding: 5px;
  color: #ccc;

  ~ label {
    top: ${(props) => (props.value ? "-14px" : "10px")};
    font-size: ${(props) => (props.value ? "12px" : "16px")};
  }

  &:focus {
    outline: none;
  }
  &:focus ~ label {
    top: -14px;
    font-size: 12px;
  }
`;

const EmailInput = styled(Input).attrs((props) => ({
  type: "email",
}))``;

const PasswordInput = styled(Input).attrs((props) => ({
  type: "password",
}))``;

const SubmitButton = styled.input.attrs((props) => ({
  type: "submit",
}))`
  background: none;
  border: 2px solid;
  font: inherit;
  line-height: 1;
  margin: auto;
  align-self: center;
  width: 100%;
  padding: 1em 2em;
  color: #57ba98;
  transition: 0.25s;

  &:hover,
  &:focus {
    border-color: #65ccb8;
    color: #fff;
    box-shadow: inset 0 0 0 2em #65ccb8;
  }
`;

export {
  Container,
  InputContainer,
  ErrorContainer,
  Form,
  Label,
  Input,
  EmailInput,
  PasswordInput,
  SubmitButton,
};
