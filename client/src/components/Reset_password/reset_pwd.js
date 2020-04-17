import React, { Component } from "react";
//import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";

import { FormField } from "../utils/Form/formField";
import { update, generateData, isFormValid } from "../utils/Form/formActions";
import axios from "axios";

class ResetPwd extends Component {
  state = {
    resetToken: "",
    formError: false,
    formErrorMessage: "",
    formSuccess: "",
    formdata: {
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
      confirmPassword: {
        element: "input",
        value: "",
        config: {
          name: "confirm_password_input",
          type: "password",
          placeholder: "Confirm your password",
        },
        validation: {
          required: true,
          confirm: "password",
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
    },
  };

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, "reset_pwd_ok");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };

  submitForm = (event) => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formdata, "reset_pwd_ok");

    if (formIsValid) {
      let dataToSubmit = generateData(this.state.formdata, "reset_pwd_ok");
      console.log(dataToSubmit);

      //NO REDUX USED
      // this.props
      //   .dispatch(...(dataToSubmit))
      //   .then((response) => {
      axios
        .post("/api/users/reset_pwd_confirm", {
          ...dataToSubmit,
          resetToken: this.state.resetToken,
        })
        .then((response) => {
          if (!response.data.success) {
            this.setState({
              formError: true,
              formErrorMessage: response.data.message,
            });
          } else {
            this.setState({
              formError: false,
              formSuccess: true,
            });
            setTimeout(() => {
              this.props.history.push("/register_login");
            }, 3000);
          }
        });
    } else {
      this.setState({
        formError: true,
      });
    }
  };

  componentDidMount() {
    const resetToken = this.props.match.params.token;
    this.setState({
      resetToken,
    });
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={(event) => this.submitForm(event)}>
          <h2>Verify password</h2>
          <div className="form_block_two">
            <div className="block">
              <FormField
                id={"password"}
                formFieldData={this.state.formdata.password}
                change={(element) => this.updateForm(element)}
              />
            </div>
            <div className="block">
              <FormField
                id={"confirmPassword"}
                formFieldData={this.state.formdata.confirmPassword}
                change={(element) => this.updateForm(element)}
              />
            </div>
          </div>

          {this.state.formError ? (
            <div className="error_label">{this.state.formErrorMessage}</div>
          ) : null}

          <button type="submit">Reset Password</button>
        </form>

        <Dialog open={this.state.formSuccess}>
          <div className="dialog_alert">
            <div>Password was resetted!</div>
            <div>
              You will be redirected to the Login Page in a couple of seconds...
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default ResetPwd;
