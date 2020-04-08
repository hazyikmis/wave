import React, { Component } from "react";
import { connect } from "react-redux";

import { FormField } from "../utils/Form/formField";
import { update, generateData, isFormValid } from "../utils/Form/formActions";

class Login extends Component {
  state = {
    formError: false,
    formSuccess: "",
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
      password: {
        element: "input",
        value: "",
        config: {
          name: "password_input",
          type: "password",
          placeholder: "Enter your password",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
    },
  };

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, "login");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };

  submitForm = (event) => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formdata, "login");

    if (formIsValid) {
      let dataToSubmit = generateData(this.state.formdata, "login");
      console.log(dataToSubmit);
    } else {
      this.setState({
        formError: true,
      });
    }
  };

  render() {
    return (
      <div className="signin_wrapper">
        <form onSubmit={(event) => this.submitForm(event)}>
          <FormField
            id={"email"}
            formFieldData={this.state.formdata.email}
            change={(element) => this.updateForm(element)}
          />

          <FormField
            id={"password"}
            formFieldData={this.state.formdata.password}
            change={(element) => this.updateForm(element)}
          />

          {this.state.formError ? (
            <div className="error_label">Please check your data</div>
          ) : null}

          <button type="submit">Log in</button>
        </form>
      </div>
    );
  }
}

export default connect()(Login);
