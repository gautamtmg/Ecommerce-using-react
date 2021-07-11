import React from 'react'
import { Pagination } from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'


function Paginate({pages, page, keyword='', is_admin=false}) {

    if(keyword){
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }
    console.log("keyword ,", keyword)
    return ( pages > 1 && (
        <Pagination>
            { [...Array(pages).keys()].map((x)=>(
                <LinkContainer 
                key={x+1} 
                to={ !is_admin ? `/?keyword=${keyword}&page=${x+1}`
                    : `/admin/productlist/?keyword=${keyword}&page=${x+1}`
                }
                
            >
                    <Pagination.Item active={x+1 === page}>
                        {x+1}
                    </Pagination.Item>
                </LinkContainer>
            ))}
        </Pagination>
    )
        
    )
}

export default Paginate
