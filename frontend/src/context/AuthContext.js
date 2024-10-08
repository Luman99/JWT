import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext


export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(false)
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const history = useNavigate()

    let registrationUser = async (e )=> {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/users/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'email':e.target.email.value, 'username': '', 'surname': '', 'password':e.target.password.value, 'is_active':false, 'is_teacher': true})
        })
        let data = await response.json()

        if(response.status === 201){
            setRegistrationSuccess(true); // Aktualizacja stanu
        }else{
            setErrorMessage("Błąd podczas rejestracji. Spróbuj ponownie.");
        }
    }

    let loginUser = async (e )=> {
        // if(!loading){
        //     setLoading(true)
        // }
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
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
            setErrorMessage("Błąd podczas logowania. Sprawdź swoje dane i spróbuj ponownie.");
        }
    }
    

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens',)
        localStorage.clear();
        history('/login')
    }

    let logoutUserVerify = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens',)
        localStorage.clear();
    }

    let updateToken = async ()=> {
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
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
        registrationSuccess: registrationSuccess, // nowa wartość
        setRegistrationSuccess: setRegistrationSuccess,
        errorMessage: errorMessage,
        setErrorMessage: setErrorMessage
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

