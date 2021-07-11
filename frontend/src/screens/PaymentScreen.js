import React, {useState, useEffect} from 'react'
import { Form, Button, Col, Container} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartAction'

function PaymentScreen({history}) {

    const cart = useSelector(state=>state.cart)
    const {shippingAddress } = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod ] = useState('Paypal')

    if(!shippingAddress.address){
        history.push("/shipping")
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }
    return (
        <FormContainer>
            <Container style={{backgroundColor:"white", boxShadow:"0 3px 10px rgba(0,0,0,.2)", marginTop:"5rem"}}>

            <CheckoutSteps step1 step2 step3 />
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as="legend" style={{ paddingTop:"1.5rem", letterSpacing:"1px", fontSize:"1.8rem" }}>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='Paypal or Credit Card'
                            id='paypal'
                            name='paymentMethod'
                            checked
                            onChange={(e)=>setPaymentMethod(e.target.value)}
                            
                        >

                        </Form.Check>
                    </Col>
                </Form.Group>


                <Button type='submit' variant='primary' className="mt-4 mb-5">
                    Continue
                </Button>
            </Form>
            </Container>
        </FormContainer>
    )
}

export default PaymentScreen
