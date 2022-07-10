import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

const Projects = React.lazy(() => import("./pages/projects"));
const Products = React.lazy(() => import("./pages/products"));
const Product = React.lazy(() => import("./pages/product-detail"));
const Project = React.lazy(() => import("./pages/project-detail"));
const NewProject = React.lazy(() =>
  import("./pages/project-detail/new-project")
);
const Invite = React.lazy(() => import("./pages/invite"));
const Settings = React.lazy(() => import("./pages/settings"));
const Actions = React.lazy(() => import("./pages/settings/actions"));

const Routes = (props) => {
  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => <Redirect to={{ pathname: "/products" }} />}
        />
        <Route
          path="/projects"
          exact
          render={(props) => (
            <React.Suspense fallback={<div></div>}>
              <Projects {...props} />
            </React.Suspense>
          )}
        />
        <Route
          path="/project/new"
          exact
          render={(props) => (
            <React.Suspense fallback={<div></div>}>
              <NewProject {...props} />
            </React.Suspense>
          )}
        />
        <Route
          path="/project/:id"
          exact
          render={(props) => (
            <React.Suspense fallback={<div></div>}>
              <Project {...props} />
            </React.Suspense>
          )}
        />
        <Route
          path="/products"
          exact
          render={(props) => (
            <React.Suspense fallback={<div></div>}>
              <Products {...props} />
            </React.Suspense>
          )}
        />
        <Route
          path="/products/:id"
          exact
          render={(props) => (
            <React.Suspense fallback={<div></div>}>
              <Product {...props} />
            </React.Suspense>
          )}
        />
        <Route
          path="/invite/:id"
          exact
          render={(props) => (
            <React.Suspense fallback={<div></div>}>
              <Invite {...props} />
            </React.Suspense>
          )}
        />
        <Route
          path="/settings/actions"
          exact
          render={(props) => (
            <React.Suspense fallback={<div></div>}>
              <Actions {...props} />
            </React.Suspense>
          )}
        />
        <Route
          path="/settings"
          exact
          render={(props) => (
            <React.Suspense fallback={<div></div>}>
              <Settings {...props} />
            </React.Suspense>
          )}
        />
      </Switch>
    </Router>
  );
};

export default Routes;
