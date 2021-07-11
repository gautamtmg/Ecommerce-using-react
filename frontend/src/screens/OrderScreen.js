import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col, ListGroup, Image, Card, Container} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails , payOrder, deliverOrder} from '../actions/orderAction'

import { PayPalButton } from 'react-paypal-button-v2'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'




function OrderScreen({match, history}) {
    const orderId = match.params.id
    const dispatch = useDispatch()

    const [sdkReady, setSdkReady ] = useState(false)
    
    const orderDetails = useSelector(state=>state.orderDetails)
    const { order, error, loading } = orderDetails

    const orderPay = useSelector(state=>state.orderPay)
    const { success:successPay, loading:loadingPay } = orderPay

    const orderDeliver = useSelector(state=>state.orderDeliver)
    const { success:successDeliver, loading:loadingDeliver  } = orderDeliver

    const userLogin = useSelector(state=>state.userLogin)
    const { userInfo } = userLogin
    
    if(!loading && !error){
        order.itemPrice = order.orderItems.reduce((acc, item)=>acc + item.price*item.qty, 0).toFixed(2)

    }
    // AaC7B4OdHZ5q0OgktpCbP61XE4pEjTImTOe8e6oHOBn1QFbgIU_TkTfPPi9OL-_ovw34faIAMKG2jh8L

    const addPaypalScript = () =>{
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AaC7B4OdHZ5q0OgktpCbP61XE4pEjTImTOe8e6oHOBn1QFbgIU_TkTfPPi9OL-_ovw34faIAMKG2jh8L'
        script.async = true
        script.onload = () =>{
            setSdkReady(true)

        }
        document.body.appendChild(script)
    }
        
    useEffect(() => {

        if(!userInfo){
            history.push('/login')
        }

        if(!order || successPay || order._id !== Number(orderId) || successDeliver){
            dispatch({type:ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVER_RESET})

            dispatch(getOrderDetails(orderId))

        }else if(!order.isPaid){
            if(!window.paypal){
                addPaypalScript()
            }else{
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) =>{
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () =>{
        dispatch(deliverOrder(order))
    }

    
    return loading ? (
            <Loader />
        ) : error ? (
            <Message variant="danger">{error}</Message>
        ): (
        <Container style={{ boxShadow:"0 3px 10px rgba(0,0,0,.2)", marginTop:"3.5rem", backgroundColor:"white", paddingBottom:"2rem"}}>
            <h1 style={{fontWeight:"900", textAlign:'center', paddingTop:"3rem"}}>Order : #{order._id}</h1>

            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name:</strong>{order.user.name}
                            </p>
                            <p>
                                <strong>Email:</strong><a href={`mailto:${order.user.email}`}> {order.user.email}</a>
                            </p>
                            <p>
                                <strong>Shipping:</strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                                
                            </p>
                            { order.isDelivered ? (
                                <Message variant="success">Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant="warning"> Not Delivered!</Message>
                            )
                        }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method:</strong>
                                {order.paymentMethod}
                                
                            </p>
                            { order.isPaid ? (
                                <Message variant="success">Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant="warning"> Not Paid.!</Message>
                            )
                        }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            { order.orderItems.length === 0 ? <Message variant='info'>Your order is empty</Message>
                                :(
                                    <ListGroup variant='flush'>
                                        { order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid />
                                                    </Col>
                                                    <Col style={{fontWeight:"700"}}>
                                                        <Link to={`/product/${item.product}`} style={{textDecoration:"none"}} >{item.name}</Link>
                                                    </Col>

                                                    <Col md={5}>
                                                        {item.qty} X Rs{item.price} = <strong>Rs {(item.qty * item.price).toFixed(2)}</strong> 
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
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2> 
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>Rs{order.itemPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>Rs{order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>Rs{order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>Rs{order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            { !order.isPaid && (
                                <ListGroup.Item>
                                    { loadingPay && <Loader />}

                                    { !sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={ successPaymentHandler }
                                        >

                                        </PayPalButton>
                                    )}
                                </ListGroup.Item>
                            )}

                                {loadingDeliver && <Loader />}
                                { userInfo && userInfo.is_admin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                    <Row>

                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>

                                    </Row>  
                                    </ListGroup.Item>
                                )}

                            
                        </ListGroup>

                        

                    </Card>
                </Col>
            </Row>
            
        </Container>

        
    
        
    )
}

export default OrderScreen
