import { DataProvider } from "./components/DataContext";
import { UnitProvider } from "./components/UnitContext";
import GlobalSvgFilters from "./components/GlobalSvgFilters";

import "./app.scss";

function App(props) {
  return (
    <DataProvider>
      {/* <SelectionsProvider> */}
        <UnitProvider>
          {props.children}
        </UnitProvider>
        <GlobalSvgFilters />
      {/* </SelectionsProvider> */}
    </DataProvider>
  );
}

export default App;
