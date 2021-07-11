import React from 'react'
import { Nav, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function CheckoutSteps({step1, step2, step3, step4}) {

    return (
        <Nav className="justify-content-center" style={{paddingTop:"2rem"}}>
         
            <Nav.Item>
                {step1 ? (
                    <LinkContainer to="/login" style={{fontWeight:"700", color:"rgba(0,200,100,1)", backgroundColor:"rgba(100,100,200,.1)", borderRadius:"2rem"}}>
                        <Nav.Link>Login</Nav.Link>
                    </LinkContainer>

                ) : (
                    <Nav.Link disabled>Login</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step2 ? (
                    <LinkContainer to="/shipping" style={{fontWeight:"700", color:"rgba(0,200,100,1)", backgroundColor:"rgba(100,100,200,.1)", borderRadius:"2rem"}}>
                        <Nav.Link>Shipping</Nav.Link>
                    </LinkContainer>

                ) : (
                    <Nav.Link disabled>Shipping</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step3 ? (
                    <LinkContainer to="/payment" style={{fontWeight:"700", color:"rgba(0,200,100,1)", backgroundColor:"rgba(100,100,200,.1)", borderRadius:"2rem"}}>
                        <Nav.Link>Payment</Nav.Link>
                    </LinkContainer>

                ) : (
                    <Nav.Link disabled>Payment</Nav.Link>
                )}
            </Nav.Item>

            <Nav.Item>
                {step4 ? (
                    <LinkContainer to="/placeorder" style={{fontWeight:"700", color:"rgba(0,200,100,1)", backgroundColor:"rgba(100,100,200,.1)", borderRadius:"2rem"}}>
                        <Nav.Link>Place Order</Nav.Link>
                    </LinkContainer>

                ) : (
                    <Nav.Link disabled>Place Order</Nav.Link>
                )}
            </Nav.Item>
        </Nav>
    )
}

export default CheckoutSteps
