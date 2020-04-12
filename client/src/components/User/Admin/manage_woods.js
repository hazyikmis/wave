import React, { Component } from "react";

import { FormField } from "../../utils/Form/formField";
import {
  update,
  generateData,
  isFormValid,
  resetFields,
} from "../../utils/Form/formActions";

import { connect } from "react-redux";
import { getWoods, addWood } from "../../../actions/products_actions";
import { ManageCategories } from "./manage_categories";

class ManageWoods extends Component {
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
          placeholder: "Wood name",
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

  showCategoryItems = () =>
    this.props.products.woods
      ? this.props.products.woods.map((item, i) => (
          <div className="category_item" key={item._id}>
            {item.name}
          </div>
        ))
      : null;

  componentDidMount() {
    this.props.dispatch(getWoods());
  }

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, "woods");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };

  resetFieldsHandler = () => {
    const newFormData = resetFields(this.state.formdata, "woods");
    this.setState({
      formError: false,
      formSuccess: true,
      formdata: newFormData,
    });
    //to show 3 seconds success message and to remove it
    setTimeout(() => {
      this.setState({
        formSuccess: false,
      });
    }, 3000);
  };

  submitForm = (event) => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formdata, "woods");

    if (formIsValid) {
      let dataToSubmit = generateData(this.state.formdata, "woods");
      let existingWoods = this.props.products.woods;
      console.log(dataToSubmit);
      this.props
        .dispatch(addWood(dataToSubmit, existingWoods))
        .then((response) => {
          if (response.payload.success) {
            this.resetFieldsHandler();
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
      <div className="admin_category_wrapper">
        <h1>Woods</h1>
        <div className="admin_two_column">
          <div className="left">
            <div className="brands_container">{this.showCategoryItems()}</div>
          </div>
          <div className="right">
            <form onSubmit={(event) => this.submitForm(event)}>
              <FormField
                id={"name"}
                formFieldData={this.state.formdata.name}
                change={(element) => this.updateForm(element)}
              />
              {this.state.formSuccess ? (
                <div className="form_success">
                  New wood category successfully added...
                </div>
              ) : null}

              {this.state.formError ? (
                <div className="error_label">Please check your data</div>
              ) : null}

              <button type="submit">Add wood</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

export default connect(mapStateToProps)(ManageWoods);
