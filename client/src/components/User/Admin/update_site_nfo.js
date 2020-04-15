import React, { Component } from "react";
import { connect } from "react-redux";

import { FormField } from "../../utils/Form/formField";

import {
  update,
  generateData,
  isFormValid,
  populateFields,
} from "../../utils/Form/formActions";

import { getSiteData, updateSiteData } from "../../../actions/site_actions";

class UpdateSiteNfo extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      sitename: {
        element: "input",
        value: "",
        config: {
          label: "Site name",
          name: "sitename_input",
          type: "text",
          placeholder: "Please enter the site name",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      address: {
        element: "input",
        value: "",
        config: {
          label: "Address",
          name: "address_input",
          type: "text",
          placeholder: "Please enter the site address",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      hours: {
        element: "input",
        value: "",
        config: {
          label: "Working hours",
          name: "hours_input",
          type: "text",
          placeholder: "Enter the site working hours",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      phone: {
        element: "input",
        value: "",
        config: {
          label: "Phone number",
          name: "phone_input",
          type: "text",
          placeholder: "Enter the phone number",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      email: {
        element: "input",
        value: "",
        config: {
          label: "Email",
          name: "email_input",
          type: "email",
          placeholder: "Enter company email",
        },
        validation: {
          required: true,
          email: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
    },
  };

  componentDidMount() {
    this.props.dispatch(getSiteData()).then(() => {
      console.log(this.props.site.siteData[0]);
      const newFormData = populateFields(
        this.state.formdata,
        this.props.site.siteData[0]
      );
      this.setState({
        formdata: newFormData,
      });
    });
  }

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, "site_nfo");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };

  submitForm = (event) => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formdata, "site_nfo");

    if (formIsValid) {
      let dataToSubmit = generateData(this.state.formdata, "site_nfo");
      console.log(dataToSubmit);
      this.props
        .dispatch(updateSiteData(dataToSubmit))
        .then((response) => {
          //console.log(response.payload);
          this.setState({ formSuccess: true }, () => {
            setTimeout(() => {
              this.setState({ formSuccess: false });
            }, 2000);
          });
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
          <h2>Company Site information</h2>
          <FormField
            id={"sitename"}
            formFieldData={this.state.formdata.sitename}
            change={(element) => this.updateForm(element)}
          />
          <FormField
            id={"address"}
            formFieldData={this.state.formdata.address}
            change={(element) => this.updateForm(element)}
          />
          <FormField
            id={"hours"}
            formFieldData={this.state.formdata.hours}
            change={(element) => this.updateForm(element)}
          />
          <FormField
            id={"phone"}
            formFieldData={this.state.formdata.phone}
            change={(element) => this.updateForm(element)}
          />
          <FormField
            id={"email"}
            formFieldData={this.state.formdata.email}
            change={(element) => this.updateForm(element)}
          />
          <div>
            {this.state.formSuccess ? (
              <div className="form_success">Success...</div>
            ) : null}

            {this.state.formError ? (
              <div className="error_label">Please check your data</div>
            ) : null}
            <button type="submit">Update Site info</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    site: state.site,
  };
};

export default connect(mapStateToProps)(UpdateSiteNfo);
