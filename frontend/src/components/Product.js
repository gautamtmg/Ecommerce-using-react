import React from 'react'
import { Card, Container } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

function Product({product}) {
    return (
        

        <Card className="my-2" style={{borderRadius:"1rem", overflow:"hidden", boxShadow:"0 1px 5px rgba(0, 0, 0,0.1)"}}>
            
            <div>


            <Link to={`/product/${product._id}`}>
                <Card.Img className="img-fluid" style={{height:"300px", objectFit:"cover"}} src={product.image}/>

            </Link>
            <Card.Body style={{padding:"1rem 1.2rem", backgroundColor:"rgba(0,0,0,0.06)"}}>
            <Link to={`/product/${product._id}`} style={{textDecoration:"none"}}>
                <Card.Title as="div" style={{textDecoration:"none", fontSize:"1rem", fontWeight:"500"}}>
                   <strong> {product.name}</strong>
                </Card.Title>

            </Link>
            

            <Card.Text as="p" style={{fontSize:".9rem", fontWeight:'500'}}>
                Rs.{product.price}
                <Rating value={product.rating} color={'#f8e825'} />
            </Card.Text>

            </Card.Body>
            </div>
            
        </Card>
        
    )
}

export default Product
