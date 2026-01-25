import { DataProvider } from "./components/DataContext";
import { UnitProvider } from "./components/UnitContext";
import { SelectionsProvider } from "./components/SelectionsContext";

import "./app.scss";

function App(props) {
  return (
    <DataProvider>
      <UnitProvider>
        <SelectionsProvider>
          {props.children}
        </SelectionsProvider>
      </UnitProvider>
    </DataProvider>
  );
}

export default App;
