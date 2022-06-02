import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from 'react-router-dom';
import { Container } from '@mui/material';
import Offers from '../routes/offers';
import Wanted from '../routes/wanted';
import MyItems from '../routes/my-items';
import MyMessages from '../routes/my-messages';
import './App.css'

export default function App() {
  const navLinks = [
    { name: "Offers", link: "" },
    { name: "Wanted", link: "wanted" },
    { name: "My Items", link: "my-items" },
    { name: "My Messages", link: "my-messages" }
  ];
 
  return (
    <>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        {navLinks.map((label) => (
          <NavLink 
            style={({ isActive }) => {
              return {
                margin: "1rem 0",
                marginLeft: "1rem",
                color: isActive ? "red" : "",
              }
            }}
            to={`/${label.link}`}
            key={label.number}
          >
            {label.name}
          </NavLink>
        ))}
      </nav>
      <Container maxWidth="lg" sx={{ py: 4}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Offers items={items} />} />
            <Route path="wanted" element={<Wanted />} />
            <Route path="my-items" element={<MyItems />} />
            <Route path="my-messages" element={<MyMessages />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </Container>
    </> 
  ); 
}
