import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown, Row} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userAction'
import SearchBox from './SearchBox'

function Header() {
    const userLogin = useSelector(state=>state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
        
    }
    return (
        <header>
            <Navbar className="bg-dark" style={{height:"4rem", boxShadow:"0 2px 4px rgba(0,0,0,0.3)"}} variant="dark" expand="lg" collapseOnSelect>
                <Container  className="bg-dark">
                    <LinkContainer to="/">
                    <Navbar.Brand>Ecommerce Shop</Navbar.Brand>
                    
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" style={{justifyContent:"flex-end"}}>
                        <SearchBox />
                        <Nav className="mr-auto">
                    <LinkContainer to="/cart">

                            <Nav.Link><i className="fas fa-shopping-cart"></i>Cart</Nav.Link>
                    </LinkContainer>

                    { userInfo ? (
                        <NavDropdown title = {userInfo.name} id = 'username'>
                            <LinkContainer to ='/profile'>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>


                        </NavDropdown>
                    ) : (
                        <LinkContainer to="/login">
                                
                                <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>
                        </LinkContainer>

                        

                    )}

                    { userInfo && userInfo.is_admin && (
                            <NavDropdown title='Admin' id = 'adminmenu'>

                            {userInfo.is_superuser && (
<div>
                                <LinkContainer to ='/admin/userlist'>
                                    <NavDropdown.Item>Users </NavDropdown.Item>
                                </LinkContainer>


                                <LinkContainer to ='/admin/orderlist'>
                                    <NavDropdown.Item>Orders </NavDropdown.Item>
                                </LinkContainer></div>
                            )}


                                <LinkContainer to ='/admin/productlist'>
                                    <NavDropdown.Item>Products </NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                        </Nav>

                    </Navbar.Collapse>
                </Container>
                   
            </Navbar>
        </header>
    )
}

export default Header
