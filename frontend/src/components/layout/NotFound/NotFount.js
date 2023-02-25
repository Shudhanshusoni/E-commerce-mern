import React from 'react';
import {Link} from 'react-router-dom'
import './NotFound.css'

const NotFound=()=>{
    return(
        <>
        <div id='notfound'>
            <div className='notfound'>
                <div className='notfound-404'>
                    <h1>404</h1>
                </div>
                <h2>We Are Sorry, Page Not Found!</h2>
                <p className='mb-5'>
                    The page you are looking for might have been removed or had its name changed or is temoporarily unavailable.
                </p>
                <Link to='/'>Back To HomePage</Link>
            </div>
        </div>
        </>
    )
}
export default NotFound;