import React from "react";
import {useState, useEffect} from "react"
import * as yup from "yup";
import axios from "axios";






let schema = yup.object().shape({
    username: yup.string().required("Please Enter Name").min(6, "User Name must be at least 6 characters"),
    email: yup.string().required("Please Enter an email Address").email(),
    password: yup.string().required("Please Enter a password").min(8, "Enter at least 8 Characters"),
    //passwordConfirmation: yup.string().required("Please Enter a password").min(8, "Enter at least 8 Characters").oneOf([yup.ref('password')], 'Passwords must match'),
    isOwner: yup.bool().oneOf([true, false])


})

export default function SignUp() {
    const [users, setUsers] = useState([]);
    let grabGreeting = "";
    const initialFormValues =
        {

            username: "",
            email: "",
            password: "",
            isOwner:false
        }
    const [form, setForm] = useState(initialFormValues);
    const [disabled, setDisabled] = useState(true);
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        isOwner:false
    });
    const setFormErrors = (name, value) => {
        //console.log(name)
        yup
            .reach(schema, name)
            .validate(value)
            .then(() => setErrors({...errors, [name]: ""}))
            .catch((err) => setErrors({...errors, [name]: err.errors[0]}))
    }
    const onChange = (e) =>
    {
        const { name, type, value, checked } = e.target;

        const realValue = type === "checkbox" ? checked : value;

        setFormErrors(name, realValue);
        setForm({...form, [name]: realValue });
        //console.log(`${name} of type ${type} has changed to ${realValue}`)
    };

    const submit = (e) => {
        e.preventDefault();

        const newUser =
            {
            username: form.username.trim(),
            email: form.email.trim(),
            password: form.password.trim(),
            isOwner:form.isOwner,
        };

       /* const requestOptions =
            {
            method: 'POST',
            headers: {    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type',
                             'Access-Control-Max-Age': '86400'},
            body: JSON.stringify(newUser)
        };*/
        console.log('New User Breakpoint')
        axios
            .post("https://sauti-market-bw.herokuapp.com/api/auth/login", newUser)


            .then((res) => {
                setForm(initialFormValues);
                //console.log(res)
                console.log('newUser', newUser);
                console.log(res)
                setUsers([...users, res.data]);
                console.log(res.data.message);
                grabGreeting = res.data.message
                /*const Center = () => (
                    <div>
                        {Object.keys(res.data).map(obj => <div>{res.data[obj].name}</div>)}
                        <h1>4</h1>
                    </div>
                );*/

                //users.map(user => console.log('all users',user) )
                //const map1 = array1.map(x => x * 2);
            })
            .catch((error) => {
                //console.log( error.response.request.response )
                console.log(error);
                //console.log(error.response);
                //console.log( error.response.request._response );
            } );
    };

    useEffect(() => {
        schema.isValid(form).then((valid) => setDisabled(!valid));
    }, [form]);

    useEffect(() => {

    })
    return (
        
            <div className="sigup-form">
                <h1>
                    Create a Market Place Account
                </h1>
                <form onSubmit={submit}>
                    <div>
                        <label>
                            User:
                            <input type = "text" name = "username" value = {form.username} onChange={onChange}/>
                        </label>
                        <div style={{ color: "black" }}>
                            <div>{errors.user}</div>
                        </div>
                        <label>
                            Email:
                            <input type = "text" name = "email" value = {form.email} onChange={onChange}/>
                        </label>
                        <div style={{ color: "black" }}>
                            <div>{errors.email}</div>
                        </div>
                        <label>
                            Password:
                            <input type = "text" name = "password" value = {form.password} onChange={onChange}/>
                        </label>
                        <div style={{ color: "black" }}>
                            <div>{errors.password}</div>
                        </div>

                        <label>
                            Owner Account
                            <input type = "checkbox" name = "isOwner" value = {form.isOwner} onChange={onChange}/>
                        </label>
                        <div className="submitButton">
                            <button onSubmit={submit} disabled={disabled}>Submit</button>
                        </div>
                    </div>
                </form>

            </div>
    );
}
