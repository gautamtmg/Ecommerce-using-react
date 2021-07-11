import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function SearchBox() {

    const [keyword, setKeyword] = useState('')

    let history = useHistory()

    const submitHandler = (e) =>{
        e.preventDefault()
        if(keyword){
            history.push(`/?keyword=${keyword}`)
        }else{
            history.push(history.push(history.location.pathname))
        }
    }

    return (
        <Form onSubmit={submitHandler} style={{display:"flex", borderRadius:"5px", overflow:"hidden", height:"2.5rem"}}>
            <Form.Control
                type='text'
                name='q'
                onChange={ e => setKeyword(e.target.value)}
            >

            </Form.Control>
            <Button type='submit' style={{backgroundColor:"orange", fontWeight:"500"}} className="p-2">
                Search
            </Button>
        </Form>
    )
}

export default SearchBox
