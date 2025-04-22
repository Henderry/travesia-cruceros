import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { RouterProvider } from "react-router";
import { PageNotFound } from "./components/Home/PageNotFound";
import { ListHabitacion } from "./components/Movie/ListHabitacion";
import { DetailHabitacion } from "./components/Movie/DetailHabitacion";
import { ListBarco } from "./components/Movie/ListBarco";
import { DetailBarco } from "./components/Movie/DetailBarco";
import { ListCrucero } from "./components/Movie/ListCrucero";
import { DetailCrucero } from "./components/Movie/DetailCrucero";
import { ListReserva } from "./components/Movie/ListReserva";
import { DetailReserva } from "./components/Movie/DetailReserva";
import { CreateHabitacion } from "./components/Movie/CreateHabitacion";
import { UpdateHabitacion } from "./components/Movie/UpdateHabitacion";
import TableHabitacion from "./components/Movie/TableHabitacion";
import TableBarco from "./components/Movie/TableBarco";
import { CreateBarco } from "./components/Movie/CreateBarco";
import { UpdateBarco } from "./components/Movie/UpdateBarco";
import TableCrucero from "./components/Movie/TableCrucero";
import { CreateCrucero } from "./components/Movie/CreateCrucero";
import { UpdateCrucero } from "./components/Movie/UpdateCrucero";
import ReservaForm from "./components/Movie/GestionReserva";


const rutas=createBrowserRouter(
  [
    {
      element: <App />,
      children:[
        {
          path:'/',
          element: <Home />
        },
        {
          path: '*',
          element: <PageNotFound />
        },
        {
          path:'/habitacion/',
          element: <ListHabitacion />
        },
        {
          path:'/habitacion/:id',
          element:  <DetailHabitacion/>
        },
        {
          path:'/barco/',
          element:  <ListBarco/>
        },
        {
          path:'/barco/:id',
          element:  <DetailBarco/>
        },
        {
          path:'/crucero/',
          element:  <ListCrucero/>
        },
        {
          path:'/crucero/:id',
          element:  <DetailCrucero/>
        },
        {
          path:'/reserva/',
          element:  <ListReserva/>
        },
        {
          path:'/reserva/:id',
          element:  <DetailReserva/>
        },
        {
          path: '/habitacion/crear',
          element: <CreateHabitacion/>
      },
      {
        path: '/habitacion/update/:id',
        element: <UpdateHabitacion/>
    },
    {
      path: '/habitacion-table',
      element: <TableHabitacion/>
  }, {
    path: '/barco-table',
    element: <TableBarco/>
},    {
  path: '/barco/crear',
  element: <CreateBarco/>
},
{
path: '/barco/update/:id',
element: <UpdateBarco/>
},
{
  path: '/crucero-table',
  element: <TableCrucero/>
},
{
  path: '/crucero/crear',
  element: <CreateCrucero/>
},
{
  path: '/gestion',
  element: <ReservaForm/>
},
{
  path: '/crucero/update/:id',
  element: <UpdateCrucero/>
  },
    
      ]
    }
  ]
)

createRoot(document.getElementById("root")).render(
  <StrictMode> 
  <RouterProvider router={rutas} /> 
</StrictMode>, 
);
