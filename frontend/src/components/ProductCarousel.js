import React, { useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Message from './Message'
import Loader from './Loader'
import { listTopProduct } from '../actions/productActions'


function ProductCarousel() {
    const dispatch = useDispatch()

    const productTopRated = useSelector(state => state.productTopRated)
    const { error, loading, products} = productTopRated

    console.log("slider",products)
    
    console.log()

    useEffect(()=>{
        dispatch(listTopProduct())
    }, [dispatch])


    return ( loading ? <Loader />
    :error 
    ? <Message variant="danger">{error}</Message>
    : (
        <Carousel style={{zIndex:"-1"}} pause='hover' className="bg-dark">
            { products.map(product =>(
                <Carousel.Item key={product._id}>
                    <Link to={`/product/${product._id}`}>
                        <Image style={{ width:"100%"}} src={product.image} alt={product.name} fluid />
                        <Carousel.Caption className='carousel.caption'>
                            <h4>{product.name} (${product.price})</h4>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    )
    )
}

export default ProductCarousel
