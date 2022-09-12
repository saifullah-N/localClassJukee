// import React, { Component } from "react";
// import { useState } from "react";
// export default function SignUp ({registerID}){
// const [email,setEmail]= useState()
// const [password,setPassword]= useState()
// // registerID(email,password)
//         return (
//             <form>
//                 <h3>Register</h3>

//                 {/* <div className="form-group">
//                     <label>First name</label>
//                     <input type="text" className="form-control" placeholder="First name" />
//                 </div>

//                 <div className="form-group">
//                     <label>Last name</label>
//                     <input type="text" className="form-control" placeholder="Last name" />
//                 </div> */}

//                 <div className="form-group">
//                     <label>Email</label>
//                     <input    onChange={(e)=>{setEmail(e.target.value)}} type="email" className="form-control" placeholder="Enter email" required />
//                 </div>

//                 <div className="form-group">
//                     <label>Password</label>
//                     <input onChange={(e) => { setPassword(e.target.value) }} type="password" className="form-control" placeholder="Enter password" required/>
//                 </div>

//                 <button type="submit" className="btn btn-dark btn-lg btn-block" onClick={()=>{registerID(email,password)}}>Register</button>
//                 <p className="forgot-password text-right">
//                     Already registered <a href="#">log in?</a>
//                 </p>
//             </form>
//         );
//     }
import React, { useState } from 'react'
import axios from "axios";
import { useNavigate ,Link} from "react-router-dom";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const history = useNavigate();

    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/users', {
                name: name,
                email: email,
                password: password,
                confPassword: confPassword
            });
            history("/Dashboard",{state:"register"});
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <section className="hero has-background-grey-light is-fullheight is-fullwidth">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4-desktop">
                            <form onSubmit={Register} className="box">
                                <p className="has-text-centered">{msg}</p>
                                <div className="field mt-5">
                                    <label className="label">Name</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Name"
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Email</label>
                                    <div className="controls">
                                        <input type="text" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <label className="label">Confirm Password</label>
                                    <div className="controls">
                                        <input type="password" className="input" placeholder="******" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className="field mt-5">
                                    <button className="button is-success is-fullwidth">Register</button>
                                    <Link to={'/'}>
//                  Sign in??
//                 </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                   
                </div>
            </div>
        </section>
    )
}

export default Register
