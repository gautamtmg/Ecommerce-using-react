import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../actions/userAction'

function RegisterScreen({location, history}) {
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')
    const [confirmPassword, setConfirmPassword ] = useState('')
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()


    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userRegister = useSelector(state => state.userRegister)

    const {error, loading, userInfo } = userRegister

    useEffect(()=> {
        if(userInfo){
            history.push(redirect)
        }
    },[history, userInfo, redirect])

    const submitHandler = (e) =>{
        e.preventDefault()

        if(password != confirmPassword){
            setMessage('Password do not patch')
        }else{

            dispatch(register(name, email, password))
        }

    }

    return (
        <FormContainer>
            <Container style={{backgroundColor:"white", boxShadow:"0 3px 10px rgba(0,0,0,.2)", marginTop:"5rem"}}>

            <h1 style={{paddingTop:"4rem", paddingBottom:"1.5rem", textAlign:"center", letterSpacing:"1px", fontSize:"2.5rem", fontWeight:"900" }}>Register</h1>
            { message && <Message variant="danger">{message}</Message>}
            { error && <Message variant="danger">{error}</Message>}
            { loading && <Loader></Loader>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    style={{height:"2.5rem"}}

                        required
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
                        required
                    style={{height:"2.5rem"}}

                        type="email"
                        placeholder="Enter email"
                        value= {email}
                        onChange={(e)=>setEmail(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                    style={{height:"2.5rem"}}
                        
                        type="password"
                        placeholder="Enter password"
                        value= {password}
                        onChange={(e)=>setPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="passwordConfirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        required
                        style={{height:"2.5rem"}}

                        type="password"
                        placeholder="Confirm password"
                        value= {confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant="success" className="my-3 btn-block" style={{width:"100%"}}>
                    Register
                </Button>
            </Form>

            <Row className="py-3">
                <Col style={{marginBottom:"2rem"}}>
                    Have an Account? <Link to={redirect?`/login?redirect=${redirect}`:'/login'} style={{color:"rgba(0,50,255,1)", fontWeight:"700"}}> Sign in</Link> 
                </Col>

            </Row>
            </Container>
        </FormContainer>
    )
}

export default RegisterScreen
