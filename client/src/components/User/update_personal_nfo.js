import React, { Component } from "react";
import { connect } from "react-redux";

import {
  updateUserProfile,
  updateUserProfileClear,
} from "../../actions/user_actions";

import { FormField } from "../utils/Form/formField";

import {
  update,
  generateData,
  isFormValid,
  populateFields,
} from "../utils/Form/formActions";

class UpdatePersonalNfo extends Component {
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
    },
  };

  componentDidMount() {
    const newFormData = populateFields(
      this.state.formdata,
      this.props.user.userData
    );

    this.setState({
      formdata: newFormData,
    });
  }

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, "update_user");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };

  submitForm = (event) => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formdata, "update_user");

    if (formIsValid) {
      let dataToSubmit = generateData(this.state.formdata, "update_user");
      //console.log(dataToSubmit);
      this.props
        .dispatch(updateUserProfile(dataToSubmit))
        .then((response) => {
          //console.log(response.payload);
          if (this.props.user.updateUser.success) {
            //if (response.payload.success) {  //this also works
            this.setState(
              {
                formError: false,
                formSuccess: true,
              },
              () => {
                setTimeout(() => {
                  this.props.dispatch(updateUserProfileClear());
                  this.setState({ formSuccess: false });
                }, 2000);
              }
            );
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
      <div>
        <form onSubmit={(event) => this.submitForm(event)}>
          <h2>Personal account information</h2>
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

          {this.state.formSuccess ? (
            <div className="form_success">Success...</div>
          ) : null}

          {this.state.formError ? (
            <div className="error_label">Please check your data</div>
          ) : null}
          <button type="submit">Update account</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(UpdatePersonalNfo);
