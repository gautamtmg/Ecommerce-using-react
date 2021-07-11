import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form, Container} from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import Loader from '../components/Loader'
import Message from '../components/Message'


function ProductScreen({match, history }) {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch() 

    const productDetail = useSelector(state=>state.productDetails)
    const { product, loading, error } = productDetail

    const userLogin = useSelector(state=>state.userLogin)
    const { userInfo } = userLogin

    console.log(userInfo)

    const productCreateReview = useSelector(state=>state.productCreateReview)
    const { loading:loadingProductReview, error:errorProductReview, success:successProductReview } = productCreateReview

    useEffect(()=>{
        if(successProductReview){
            setRating(0)
            setComment('')
            dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
        }
        dispatch(listProductDetails(match.params.id))
    },[dispatch, match, successProductReview])

    const addToCartHandler = ()=>{

        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(createProductReview(
            match.params.id,{
                rating,
                comment
            }
        ))
    }


    return (
        <Container style={{marginTop:"3rem"}}>
            <Link to="/" className="btn btn-light my-3">Go back </Link>
            { loading ? <Loader />
                : error ? <Message variant='danger'> {error}</Message>
                    :
                    <div>
                    <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid/>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <Col md={12}>
                                <ListGroup variant="flush" style={{boxShadow:"0 3px 10px rgba(0,0,0,.2)"}}>
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                            </ListGroup.Item>
    
                            <ListGroup.Item>
                                Price: Rs.{product.price}
                            </ListGroup.Item>
    
                            <ListGroup.Item>
                                Descripton: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                            </Col>

                            <Col md={12}>
                                <Card className="mt-5">
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:
                                                </Col>
                                                <Col>
                                                    <strong>Rs: {product.price}</strong>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
            
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:
                                                </Col>
                                                <Col>
                                                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Qty</Col>
                                                    <Col xs='auto' className='my-1'>
                                                        <Form.Control
                                                            as="select"
                                                            value={qty}
                                                            onChange={(e)=> setQty(e.target.value)}
                                                        >
                                                            {
                                                                [...Array(product.countInStock).keys()].map((x)=>(
                                                                    <option key={x+1} value={x+1}>
                                                                        {x+1}
                                                                    </option>
                                                                ))
                                                            }

                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}
            
                                        <ListGroup.Item>
                                            <Row>
            
                                            <Button onClick = {addToCartHandler} className="btn-block" disabled={product.countInStock==0} type="button">Add to Cart</Button>
                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>

                            
                        </Row>
                        
                    </Col>
                    
                </Row>

                <Row>
                    <Col md={12} className="mt-5">
                        <h4>Reviews</h4>
                        { product.reviews.length===0 && <Message variant="info"> No Reviews</Message>}
                        <ListGroup varian='flush'>
                            { product.reviews.map((review) => (
                                <ListGroup.Item key={review._id}  style={{border:"0 "}}>
                                    <strong>{ review.name }</strong>
                                    <Rating value={review.rating } color='#f8e825' />
                                    <p style={{fontSize:".9rem", marginBottom:".4rem"}}>{ review.createdAt.substring(0,10)} </p>
                                    
                                    <p style={{fontSize:"1.2rem", fontWeight:"500"}}>{ review.comment} </p>
                                </ListGroup.Item>
                            ))}

                            <ListGroup.Item className="mt-5 py-5" style={{border:"0"}}>
                                <h4>Write a review</h4>
                                { loadingProductReview && <Loader />}
                                { successProductReview && <Message variant='success'>Review Submitted</Message>}
                                { errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                                { userInfo ? (
                                    <Form onSubmit={submitHandler}>
                                        <Form.Group controlId='rating'>
                                            <Form.Label>Rating</Form.Label>
                                            <Form.Control
                                                as='select'
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                            >
                                                <option value=''>Select...</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excellent</option>
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group controlId='comment'>
                                            <Form.Label>Review</Form.Label>
                                            <Form.Control
                                                as='textarea'
                                                row='5'
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            ></Form.Control>
                                        </Form.Group>

                                        <Button
                                            disabled={loadingProductReview}
                                            type='submit'
                                            variant='primary'
                                            className="mt-4"
                                        >
                                            Submit
                                        </Button>

                                        
                                    </Form>
                                ) : (
                                    <Message variant="info"> Please <Link to='/login'>login</Link> to write a review</Message>
                                )}
                            </ListGroup.Item>
                        </ListGroup>

                    </Col>
                </Row>

                </div>

                }
            
        </Container>  
    )
}

export default ProductScreen
