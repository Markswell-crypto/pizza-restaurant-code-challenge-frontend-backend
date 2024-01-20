import { Route, Switch } from "react-router";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Restaurant from "./components/Restaurant";

function App() {

  return (
    <>
    <Navbar />
    <Switch>
      <Route exact path="/restaurants/:id">
        <Restaurant />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
    </Switch>
  </> 
  )
}

export default App
