import { DataProvider } from "./components/DataContext";
import { UnitProvider } from "./components/UnitContext";
import { SelectionsProvider } from "./components/SelectionsContext";

import "./app.scss";

function App(props) {
  return (
    <DataProvider>
      <SelectionsProvider>
        <UnitProvider>
          {props.children}
        </UnitProvider>
      </SelectionsProvider>
    </DataProvider>
  );
}

export default App;
