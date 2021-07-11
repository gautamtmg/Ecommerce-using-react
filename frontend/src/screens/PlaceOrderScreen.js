import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col, ListGroup, Image, Card, Container} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../actions/orderAction'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'




function PlaceOrderScreen({history}) {
    const dispatch = useDispatch()
    const orderCreate = useSelector(state=>state.orderCreate)
    const { order, error, success } = orderCreate
    const cart = useSelector(state => state.cart)
    
    cart.itemPrice = cart.cartItems.reduce((acc, item)=>acc + item.price*item.qty, 0).toFixed(2)
    cart.shippingPrice = (cart.itemPrice>200 ? 0: 10).toFixed(2)
    cart.taxPrice = Number((0.13)*cart.itemPrice).toFixed(2)
    cart.totalPrice = (Number(cart.itemPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)
    
    if(!cart.paymentMethod){
        history.push('/payment')
    }

    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }
    }, [success, history])

    const placeOrder = () =>{
        dispatch(createOrder({
            orderItems:cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice:cart.shippingPrice,
            taxPrice:cart.taxPrice,
            totalPrice:cart.totalPrice,

        }))

    }

    return (
        <Container style={{backgroundColor:"white", boxShadow:"0 3px 10px rgba(0,0,0,.2)", marginTop:"5rem", paddingBottom:"2.5rem"}}>
            <CheckoutSteps step1 step2 step3 step4 />

            <Row className="mt-5">
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2 style={{ letterSpacing:"1px", fontSize:"1.5rem", fontWeight:"700" }}>Shipping</h2>
                            <p style={{fontWeight:"300"}}>
                                Shipping:
                                <strong>{cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.country}</strong>
                                
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2 style={{ letterSpacing:"1px", fontSize:"1.5rem", fontWeight:"700" }}>Payment Method</h2>
                            <p style={{fontWeight:"300"}}>
                                    Method:
                                <strong>
                                {cart.paymentMethod}
                                </strong>
                                
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2 style={{ letterSpacing:"1px", fontSize:"1.5rem", fontWeight:"700" }}>Order Items</h2>
                            { cart.cartItems.length === 0 ? <Message variant='info'>Your cart is empty</Message>
                                :(
                                    <ListGroup variant='flush'>
                                        { cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`} >{item.name}</Link>
                                                    </Col>

                                                    <Col md={5}>
                                                        {item.qty} X Rs{item.price} = Rs {(item.qty * item.price).toFixed(2)}
                                                    </Col>

                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )    
                        }
                        </ListGroup.Item>



                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card style={{border:"0",  boxShadow:"0 1px 5px rgba(0, 0, 0,0.1)"}}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2 style={{ letterSpacing:"1px", fontSize:"1.5rem", fontWeight:"700", textAlign:"center" }}>Order Summary</h2> 
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                    <strong>

                                    Items:
                                    </strong>
                                    </Col>
                                    <Col>Rs{cart.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Shipping:</strong></Col>
                                    <Col>Rs{cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Tax:</strong></Col>
                                    <Col>Rs{cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong>Total:</strong></Col>
                                    <Col>Rs{cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>

                                <Button
                                    type='button'
                                    className="btn-block"
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrder}
                                    className="my-2"
                                >
                                    Place Order
                                </Button>
                                </Row>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            
        </Container>
    )
}

export default PlaceOrderScreen
