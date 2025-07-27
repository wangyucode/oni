import { SelectionsProvider } from "./components/SelectionsContext";

import "./app.scss";

function App(props) {

  return <SelectionsProvider>{props.children}</SelectionsProvider>;
}

export default App;
