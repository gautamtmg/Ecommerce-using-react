import React, {useState, useEffect} from 'react'
import { Form, Button, Container} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingAddress } from '../actions/cartAction'


function ShippingScreen({history}) {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()

    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [country, setCountry] = useState(shippingAddress.country)

    const submitHandler = (e)=>{
        e.preventDefault()
        dispatch(saveShippingAddress({address, city, country}))
        history.push('/payment')
    }
    
    return (
        <FormContainer>
            <Container style={{backgroundColor:"white", boxShadow:"0 3px 10px rgba(0,0,0,.2)", marginTop:"5rem"}}>

            <CheckoutSteps step1 step2 />

            <h1 style={{ paddingBottom:"1.5rem", textAlign:"center", letterSpacing:"1px", fontSize:"2.5rem", fontWeight:"900" }}>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                    style={{height:"2.5rem"}}

                        required
                        type="text"
                        placeholder="Enter address"
                        value= {address ? address : ''}
                        onChange={(e)=>setAddress(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>


                <Form.Group controlId="city">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                    style={{height:"2.5rem"}}

                        required
                        type="text"
                        placeholder="Enter city"
                        value= {city ? city : ''}
                        onChange={(e)=>setCity(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                    style={{height:"2.5rem"}}

                        required
                        type="text"
                        placeholder="Enter country"
                        value= {country ? country : ''}
                        onChange={(e)=>setCountry(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className="mt-4" style={{marginBottom:"2rem", width:"100%"}}>
                    Continue
                </Button>

            </Form>
            </Container>
        </FormContainer>
    )
}

export default ShippingScreen
