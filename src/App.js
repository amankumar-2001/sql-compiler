import { styled } from "styled-components";
import Dashboard from "./Screens/Dashboard";

const Container = styled.div`
  font-family: "Roboto", sans-serif;
`;

function App() {
  return (
    <Container>
      <Dashboard />
    </Container>
  );
}

export default App;
