

import axios from "axios"
const URL = 'http://localhost:8000' 
export const PostResgister = async()=>{
    try {
        const res = await axios.post(`${URL}/auth/email/resgister`)
        console.log(res)
        localStorage.setItem('accessToken', res.data.accessToken)
        alert('Log in successfully')
        
    } catch (error) {
        console.error(error)
    }
} 
