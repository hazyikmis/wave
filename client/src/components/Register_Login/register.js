import React, { Component } from "react";
import { connect } from "react-redux";
import Dialog from "@material-ui/core/Dialog";

import { FormField } from "../utils/Form/formField";
import { update, generateData, isFormValid } from "../utils/Form/formActions";
import { registerUser } from "../../actions/user_actions";

class Register extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      name: {
        element: "input",
        value: "",
        config: {
          name: "name_input",
          type: "text",
          placeholder: "Enter your name",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
      lastname: {
        element: "input",
        value: "",
        config: {
          name: "lastname_input",
          type: "text",
          placeholder: "Enter your lastname",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
      },
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
    const newFormData = update(element, this.state.formdata, "register");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };

  submitForm = (event) => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formdata, "register");

    if (formIsValid) {
      let dataToSubmit = generateData(this.state.formdata, "register");
      //console.log(dataToSubmit);
      this.props
        .dispatch(registerUser(dataToSubmit))
        .then((response) => {
          //console.log(response.payload);
          if (response.payload.registerSuccess) {
            //console.log(response.payload);
            this.setState({
              formError: false,
              formSuccess: true,
            });

            setTimeout(() => {
              this.props.history.push("/register_login");
            }, 3000);
          } else {
            this.setState({
              formError: true,
            });
          }
        })
        .catch((err) => {
          this.setState({
            formError: true,
          });
        });
    } else {
      this.setState({
        formError: true,
      });
    }
  };

  render() {
    return (
      <div className="page_wrapper">
        <div className="container">
          <div className="register_login_container">
            <div className="left">
              <form onSubmit={(event) => this.submitForm(event)}>
                <h2>Personal information</h2>
                <div className="form_block_two">
                  <div className="block">
                    <FormField
                      id={"name"}
                      formFieldData={this.state.formdata.name}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                  <div className="block">
                    <FormField
                      id={"lastname"}
                      formFieldData={this.state.formdata.lastname}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                </div>
                <div>
                  <FormField
                    id={"email"}
                    formFieldData={this.state.formdata.email}
                    change={(element) => this.updateForm(element)}
                  />
                </div>
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
                  <div className="error_label">Please check your data</div>
                ) : null}

                <button type="submit">Create an account</button>
              </form>
            </div>
          </div>
        </div>

        <Dialog open={this.state.formSuccess}>
          <div className="dialog_alert">
            <div>Conguratulations</div>
            <div>
              You will be redirected to the Login Page in a couple of seconds...
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

//BE CAREFUL! WE ARE CONNECTING THIS COMPONENT WITH REDUX, BUT JUST ONLY TO USE ACTIONS
//SINCE WE DO NOT NEED ANYTHING FROM STATE/STORE, WE DO NOT NEED TO DEFINE mapStateToProps
export default connect()(Register);
