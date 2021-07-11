import React, {useState, useEffect} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col, Container} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct, createProduct, listProductsVendor } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen({history, match}) {
    const dispatch = useDispatch()
    const userList = useSelector(state=> state.usersList)
    const { loading, error, users } = userList

    const productList = useSelector(state=> state.productListVendor)
    const { products, page, pages } = productList
    console.log("productlist scree >>", products)

    const productDelete = useSelector(state=> state.productDelete)
    const { loading:loadingDelete, error:errorDelete, success:successDelete } = productDelete


    const productCreate = useSelector(state=> state.productCreate)
    const { loading:loadingCreate, error:errorCreate, success:successCreate, product:createdProduct } = productCreate

    const userLogin = useSelector(state=> state.userLogin)
    const { userInfo } = userLogin

    let keyword = history.location.search
    useEffect(() =>{
        dispatch(listProductsVendor())

        dispatch({type:PRODUCT_CREATE_RESET })
        if(!userInfo.is_admin){
            history.push('/login')

        }
        
        if(successCreate){
            history.push(`/admin/product/${createdProduct._id}/edit`)
        }else{
            dispatch(listProducts(keyword))

        }


    },[dispatch, history, userInfo, successDelete, successCreate, createdProduct, keyword ])


    const deleteHandler = (id) =>{
        if(window.confirm('Are you sure want to delete this product? ')){
            //Delete product
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () =>{
        // create product
        dispatch(createProduct())
    }


    return (
        <Container style={{marginTop:"3rem"}}>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-right">
                    <Button className="my-3" onClick={createProductHandler}>
                        <i className="fas fa-plus"></i>
                        Create Product
                    </Button>
                </Col>

            </Row>
            { loadingDelete && <Loader />}
            { errorDelete && <Message variant="danger">{errorDelete}</Message>}

            { loadingCreate && <Loader />}
            { errorCreate && <Message variant="danger">{errorCreate}</Message>}

            { loading
            ? <Loader />
            : error 
                ? <Message variant="danger">{error}</Message>
                : (
                    <div>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th> Brand</th>
                                <th> </th>
                                
                            </tr>
                        </thead>

                        <tbody>
                            { products.map(product => (
                                <tr key={product._id}>
                                    <td> { product._id } </td>
                                    <td> { product.name } </td>
                                    <td>Rs. { product.price } </td>
                                    <td> { product.category } </td>
                                    <td> { product.brand } </td>
                                    
                                    <td> 
                                        <LinkContainer to ={`/admin/product/${product._id}/edit`}>
                                            <Button variant="light" className="btn-sm">
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </LinkContainer>


                                        <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Paginate page={page} pages={pages} is_admin={true} />

                    </div>
            )
            }
            
        </Container>
    )
}

export default ProductListScreen
