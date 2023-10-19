import { styled } from "styled-components";
import Dashboard from "./Screens/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";

const Container = styled.div`
  height: 100vh;
`;

function App() {
  return (
    <Container>
      <Dashboard />
    </Container>
  );
}

export default App;
