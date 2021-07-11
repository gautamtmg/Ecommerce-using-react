import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUser } from '../actions/userAction'
import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserEditScreen({match, history}) {

    const userId = match.params.id

    const [email, setEmail ] = useState('')
    const [is_admin, setIs_Admin ] = useState('')
    const [name, setName] = useState('')

    const [message, setMessage] = useState('')

    const dispatch = useDispatch()



    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user } = userDetails


    const userUpdate = useSelector(state => state.userUpdate)
    const {error:errorUpdate, loading:loadingUpdate, success:successUpdate } = userUpdate

    useEffect(()=> {
        if(successUpdate){
            dispatch({type:USER_UPDATE_RESET})
            history.push('/admin/userlist')
        }else{

            if(!user.name || Number(user._id) !== Number(userId)){
                dispatch(getUserDetails(userId))
            }else{
                setName(user.name)
                setEmail(user.email)
                setIs_Admin(user.is_admin)
            }
        }

    },[user, userId, successUpdate, history])

    const submitHandler = (e) =>{
        e.preventDefault()

        dispatch(updateUser({_id:user._id, name, email, is_admin}))

        
    }

    return (
        <Container style={{marginTop:"3rem"}}>

            <Link to='/admin/userlist'>
                Go Back
            </Link>
            { loadingUpdate && <Loader />}
            {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

            <FormContainer>
            <h1>Edit User</h1>
            { loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
                <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value= {name}
                        onChange={(e)=>setName(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control

                        type="email"
                        placeholder="Enter email"
                        value= {email}
                        onChange={(e)=>setEmail(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="is_admin">
                    <Form.Check

                        type="checkbox"
                        label="Is Admin"
                        checked={is_admin}
                        onChange={(e)=>setIs_Admin(e.target.checked)}
                    >

                    </Form.Check>
                </Form.Group>

                

                <Button type='submit' variant="primary" className="my-3 btn-block">
                    Update
                </Button>
            </Form>

            )}
            

            
        </FormContainer>
        </Container>
    )
}

export default UserEditScreen
