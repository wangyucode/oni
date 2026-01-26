import { DataProvider } from "./contexts/DataContext";
import { UnitProvider } from "./contexts/UnitContext";
import { SelectionsProvider } from "./contexts/SelectionsContext";

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
