import React from "react";
import {useState, useEffect} from "react"
import * as yup from "yup";
import axios from "axios";
import styled from "styled-components";

const LabelDisplay = styled.div`
  color:whitesmoke;
  font-family: "Arial Black";
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  align-items: flex-start;
  padding: 10px 0px;
  text-align: left;
  padding: 10rem;
  float: left;
`
  const ButtonDisplay = styled.button` 
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
  &:disabled {
    color: grey;
    opacity: 0.7;
    cursor: default;`


let schema = yup.object().shape({
    user: yup.string().required("Please Enter Name").min(6, "User Name must be at least 6 characters"),
    email: yup.string().required("Please Enter an email Address").email(),
    password: yup.string().required("Please Enter a password").min(8, "Enter at least 8 Characters"),
    //passwordConfirmation: yup.string().required("Please Enter a password").min(8, "Enter at least 8 Characters").oneOf([yup.ref('password')], 'Passwords must match'),
    ownerAccount: yup.bool().oneOf([true, false])


})

export default function SignUp() {
    const [users, setUsers] = useState([]);
    const initialFormValues =
        {
            id : "",
            user: "",
            email: "",
            password: "",
            //passwordConfirmation: "",
            ownerAccount: false
        }
    const [form, setForm] = useState(initialFormValues);
    const [disabled, setDisabled] = useState(true);
    const [errors, setErrors] = useState({
        id: "",
        user: "",
        email: "",
        password: "",
        //passwordConfirmation: "",
        ownerAccount: false
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
        console.log(`${name} of type ${type} has changed to ${realValue}`)
    };

    const submit = (e) => {
        e.preventDefault();

        const newUser = {
            user: form.user.trim(),
            email: form.email.trim(),
            password: form.password.trim(),
            //passwordConfirmation: form.passwordConfirmation.trim(),
            ownerAccount: form.ownerAccount,
        };

        axios
            .post("https://team-amazing.herokuapp.com/api/auth/register", newUser)
            .then((res) => {
                setForm(initialFormValues);
                console.log(res.data)
                setUsers([...users, res.data]);
                console.log(users)
            })
            .catch((err) => {
                debugger;
            });
    };

    useEffect(() => {
        schema.isValid(form).then((valid) => setDisabled(!valid));
    }, [form]);
    return (
        <React.Fragment>
            <div
                className={
                    "form-container bg-black w-screen text-center flex flex-col justify-center align-center leading-5"
                }
            >
                {" "}
                <h1 className={"text-white mt-20 mx-auto text-5xl"} style={{textShadow: '0 0 1rem black'}}>
                    Create a Market Place Account
                </h1>
                <form onSubmit={submit}>
                    <LabelDisplay>
                        <label>
                            User:
                            <input type = "text" name = "user" value = {form.user} onChange={onChange}/>
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
                            <input type = "checkbox" name = "ownerAccount" value = {form.ownerAccount} onChange={onChange}/>
                        </label>
                        <div className="submitButton">
                            <ButtonDisplay disabled={disabled}>Submit</ButtonDisplay>
                        </div>
                    </LabelDisplay>


                </form>

            </div>
            <div
                className={
                    "bg-white h-96 w-screen flex flex-col justify-center text-center align-center"
                }
            ></div>

        </React.Fragment>
    );
}
