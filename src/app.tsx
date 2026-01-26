import { DataProvider } from "@/contexts/DataContext";
import { UnitProvider } from "@/contexts/UnitContext";
import { SelectionsProvider } from "@/contexts/SelectionsContext";
import { WikiProvider } from "@/contexts/WikiContext";

import "./app.scss";

function App(props) {
  return (
    <DataProvider>
      <UnitProvider>
        <WikiProvider>
          <SelectionsProvider>
            {props.children}
          </SelectionsProvider>
        </WikiProvider>
      </UnitProvider>
    </DataProvider>
  );
}

export default App;
