import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext


export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(false)

    const history = useNavigate()

    let registrationUser = async (e )=> {
        e.preventDefault()
        let response = await fetch('http://ec2-18-159-196-177.eu-central-1.compute.amazonaws.com:8000/api/users/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'email':e.target.email.value, 'username':e.target.username.value, 'surname': '', 'password':e.target.password.value, 'is_active':false, 'is_teacher': true})
        })
        let data = await response.json()

        if(response.status === 201){
            history('/login')
        }else{
            alert('Something went wrong!')
        }
    }

    let loginUser = async (e )=> {
        if(!loading){
            setLoading(true)
        }
        e.preventDefault()
        let response = await fetch('http://ec2-18-159-196-177.eu-central-1.compute.amazonaws.com:8000/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'email':e.target.email.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            history('/')
        }else{
            alert('Something went wrong!')
        }
    }
    

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens',)
        localStorage.clear();
        history('/login')
    }

    let updateToken = async ()=> {
        let response = await fetch('http://ec2-18-159-196-177.eu-central-1.compute.amazonaws.com:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })
        let data = await response.json()

        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        registrationUser:registrationUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(()=> {

        if(loading && authTokens){
            updateToken()
        }

        let fourMinutes = 1000 * 60 * 4
        let interval = setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)      
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

