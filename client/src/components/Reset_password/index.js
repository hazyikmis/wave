import React, { Component } from "react";
import axios from "axios";

import { FormField } from "../utils/Form/formField";
import { update, generateData, isFormValid } from "../utils/Form/formActions";

//import { registerUser } from "../../actions/user_actions";

export default class ResetPassword extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      email: {
        element: "input",
        value: "",
        config: {
          name: "email_input",
          type: "email",
          placeholder: "Enter your email",
        },
        validation: {
          required: true,
          email: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
    },
  };

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, "reset_pwd");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };

  submitForm = (event) => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formdata, "reset_pwd");

    if (formIsValid) {
      let dataToSubmit = generateData(this.state.formdata, "reset_pwd");
      //console.log(dataToSubmit);

      //SINCE NO REDUX USED HERE, WE ARE NOT DISPATCHING, we are directly calling server route via axios from here
      //this.props
      //  .dispatch(registerUser(dataToSubmit))
      //   .then((response) => {
      axios.post("/api/users/reset_pwd", dataToSubmit).then((response) => {
        if (response.data.success) {
          this.setState({
            formSuccess: true,
          });
        } else {
          this.setState({
            formSuccess: false,
            formError: true,
          });
        }
      });
    } else {
      this.setState({
        formSuccess: false,
        formError: true,
      });
    }
  };

  render() {
    return (
      <div className="container">
        <h1>Reset password</h1>
        <h2>Enter your email address below</h2>
        <form onSubmit={(event) => this.submitForm(event)}>
          <div>
            <FormField
              id={"email"}
              formFieldData={this.state.formdata.email}
              change={(element) => this.updateForm(element)}
            />
          </div>

          {this.state.formSuccess ? (
            <div className="form_success">Email sent, check your inbox...</div>
          ) : null}

          {this.state.formError ? (
            <div className="error_label">Please check your data</div>
          ) : null}

          <button type="submit">Send email to reset password</button>
        </form>
      </div>
    );
  }
}
