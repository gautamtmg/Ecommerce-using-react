import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card, Container } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartAction'


function CartScreen({match, location, history}) {
    const productId = match.params.id
    const qty = location.search ? Number(location.search.split('=')[1]):1

    const dispatch = useDispatch()
    const cart = useSelector(state=>state.cart)
    const { cartItems } = cart 

    useEffect(()=>{
        if(productId){
            dispatch(addToCart(productId, qty))

        }
    },[dispatch, productId, qty])

    const removeFromCartHandler = (id) => {

       dispatch(removeFromCart(id))
    }

    const checkoutHandler = () =>{
        history.push('/login?redirect=shipping')
    }
    return (
        <Container>

        <Row style={{marginTop:"3rem"}}>
            <Col md={8}>
                <h2 style={{textAlign:"center"}}>Shopping Cart</h2>

                
                { cartItems.length === 0 ? (
                    <Message variant='info'>
                        Your cart is empty <Link to="/"> Go Back </Link>
                    </Message>

                    
                ) : (
                    <ListGroup variant='flush'>
                        { cartItems.map(item=>(
                            <ListGroup.Item key={item.product} style={{borderBottom:"1px solid rgba(0,0,0,.1)"}}>
                                <Row style={{display:"flex", alignItems:"center"}}>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid />
                                    </Col>
                                    <Col md={3} style={{fontWeight:"700"}}>
                                        <Link to={`/products/${item.product }`} style={{textDecoration:"none"}}>{item.name}</Link>
                                    </Col>

                                    <Col md={2}>
                                        Rs.{item.price  }
                                    </Col>
                                    <Col md={3}>
                                    <Form.Control
                                        style={{border:"0", padding:"6px 9px", fontWeight:"9    00", fontSize:'1rem'}}
                                        
                                        as="select"
                                        value={item.qty}
                                        onChange={(e)=> dispatch(addToCart(item.product,Number(e.target.value)))}
                                    >
                                        {
                                            [...Array(item.countInStock).keys()].map((x)=>(
                                                <option key={x+1} value={x+1}>
                                                    {x+1}
                                                </option>
                                            ))
                                        }

                                    </Form.Control>

                                    </Col>

                                    <Col md={1}>
                                        <Button
                                            type='button'
                                            variant='light'
                                            onClick={()=>removeFromCartHandler(item.product)}
                                            style={{color:"rgba(220,10,0,.8)"}}
                                        >
                                            <i className='fas fa-trash'></i>

                                        </Button>
                                    </Col>

                                </Row>
                            </ListGroup.Item>
                        ))}

                    </ListGroup>
                    )}
            </Col>

            <Col md={4} className="mt-4">
                <Card style={{border:"0", boxShadow:"0 2px 4px rgba(0,0,0,.15)"}}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item style={{fontSize:"1.3rem", fontWeight:"500"}}>
                            <h2 style={{fontSize:"1.5rem", letterSpacing:"1.5px"}}>Subtotal({cartItems.reduce((acc, item) => acc+item.qty, 0)}) items</h2>
                            Rs. {cartItems.reduce((acc, item) => acc+item.qty*item.price, 0).toFixed(2)}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled = {cartItems.length===0}
                                    onClick={checkoutHandler}
                                    style={{backgroundColor:"rgba(50,200,150,.95)"}}
                                >
                                    Proceed To Checkout
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

export default CartScreen
