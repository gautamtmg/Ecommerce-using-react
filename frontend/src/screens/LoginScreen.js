import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Container } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userAction'

function LoginScreen({location, history}) {
    const [email, setEmail ] = useState('')
    const [password, setPassword ] = useState('')

    const dispatch = useDispatch()


    const redirect = location.search ? location.search.split('=')[1] : '/'

    const userLogin = useSelector(state => state.userLogin)

    const {error, loading, userInfo } = userLogin

    useEffect(()=> {
        if(userInfo){
            history.push(redirect)
        }
    },[history, userInfo, redirect])

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <Container style={{backgroundColor:"white", boxShadow:"0 3px 10px rgba(0,0,0,.2)", marginTop:"5rem"}}>

            <h1 style={{paddingTop:"4rem", paddingBottom:"1.5rem", textAlign:"center", letterSpacing:"1px", fontSize:"2.5rem", fontWeight:"900" }}>Sign In</h1>
            { error && <Message variant="danger">{[error]}</Message>}
            { loading && <Loader></Loader>}
            <Form onSubmit={submitHandler}>
                <Form.Group     controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
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
                    style={{height:"2.5rem"}}
                        type="password"
                        placeholder="Enter password"
                        value= {password}
                        onChange={(e)=>setPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant="success" className="my-3 btn-block" style={{width:"100%"}}>
                    Sign In
                </Button>
            </Form>

            <Row className="py-3">
                <Col style={{marginBottom:"2rem"}}>
                    New Customer? <Link to={redirect?`/register?redirect=${redirect}`:'/register'} style={{color:"rgba(0,50,255,1)", fontWeight:"700"}}> Register</Link> 
                </Col>

            </Row>
            </Container>

        </FormContainer>
    )
}

export default LoginScreen
