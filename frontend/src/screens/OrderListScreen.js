
import React, {useState, useEffect} from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Container} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { listOrders } from '../actions/orderAction'


function OrderListScreen({history}) {
    const dispatch = useDispatch()
    const orderList = useSelector(state=> state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state=> state.userLogin)
    const { userInfo } = userLogin



    useEffect(() =>{
        if(userInfo && userInfo.is_admin){
            dispatch(listOrders())

        }else{
            history.push('/login')
        }


    },[dispatch, history, userInfo])


   


    return (
        <Container style={{marginTop:"3rem"}}>
            <h1>Orders </h1>
            { loading
            ? <Loader />
            : error 
                ? <Message variant="danger">{error}</Message>
                : (
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Date</th>
                                <th>Total Price</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th> </th>
                                
                            </tr>
                        </thead>

                        <tbody>
                            { orders.map(order => (
                                <tr key={order._id}>
                                    <td> { order._id } </td>
                                    <td> { order.user && order.user.name } </td>
                                    <td> { order.createdAt.substring(0,10) } </td>
                                    <td> Rs.{ order.totalPrice } </td>

                                    <td> { order.isPaid ? (
                                         order.paidAt
                                    ) : (
                                        <i className="fas fa-times" style={{color:'red'}}></i>
                                    )
                                    
                                    } </td>

                                    <td> { order.isDelivered ? (
                                         order.deliveredAt
                                    ) : (
                                        <i className="fas fa-times" style={{color:'red'}}></i>
                                    )
                                    
                                    } </td>
                                    <td> 
                                        <LinkContainer to ={`/order/${order._id}`}>
                                            <Button variant="light" className="btn-sm">
                                                Detail
                                            </Button>
                                        </LinkContainer>


                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
            )
            }
            
        </Container>
    )
}

export default OrderListScreen
