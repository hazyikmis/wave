import React, { Component } from "react";
import UserLayout from "../../../hoc/user_layout";

import { FormField } from "../../utils/Form/formField";
import {
  update,
  generateData,
  isFormValid,
  populateOptionFields,
  resetFields,
} from "../../utils/Form/formActions";

import { connect } from "react-redux";
import {
  getBrands,
  getWoods,
  addProduct,
  clearProduct,
} from "../../../actions/products_actions";

class AddProduct extends Component {
  state = {
    formError: false,
    formSuccess: false,
    formdata: {
      name: {
        element: "input",
        value: "",
        config: {
          label: "Product name",
          name: "name_input",
          type: "text",
          placeholder: "Product name",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      description: {
        element: "textarea",
        value: "",
        config: {
          label: "Product description",
          name: "description_input",
          type: "text",
          placeholder: "Enter product description",
          rows: "4",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      price: {
        element: "input",
        value: "",
        config: {
          label: "Product price",
          name: "price_input",
          type: "number",
          placeholder: "Product price",
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      brand: {
        element: "select",
        value: "",
        config: {
          label: "Product brand",
          name: "brand_input",
          options: [],
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      shipping: {
        element: "select",
        value: "",
        config: {
          label: "Shipping options",
          name: "shipping_input",
          options: [
            { key: true, value: "Yes" },
            { key: false, value: "No" },
          ],
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      available: {
        element: "select",
        value: "",
        config: {
          label: "Available in stock",
          name: "available_input",
          options: [
            { key: true, value: "Yes" },
            { key: false, value: "No" },
          ],
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      wood: {
        element: "select",
        value: "",
        config: {
          label: "Wood material",
          name: "wood_input",
          options: [],
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      frets: {
        element: "select",
        value: "",
        config: {
          label: "Frets",
          name: "frets_input",
          options: [
            { key: 20, value: 20 },
            { key: 21, value: 21 },
            { key: 22, value: 22 },
            { key: 24, value: 24 },
          ],
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
      publish: {
        element: "select",
        value: "",
        config: {
          label: "Publish",
          name: "publish_input",
          options: [
            { key: true, value: "Public" },
            { key: false, value: "Hidden" },
          ],
        },
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
        validationMessage: "",
        showLabel: true,
      },
    },
  };

  updateFields = (newFormdatoom) => {
    this.setState({
      formdata: newFormdatoom,
    });
  };

  componentDidMount() {
    const formData = this.state.formdata;

    this.props.dispatch(getBrands()).then((response) => {
      //console.log(response.payload);
      //console.log(this.props.products.brands);
      const newFormData = populateOptionFields(
        formData,
        this.props.products.brands,
        "brand"
      );
      //console.log(newFormData);
      //below method used for updating state (because we gonna use this process a couple of times!)
      this.updateFields(newFormData);
    });

    this.props.dispatch(getWoods()).then((response) => {
      const newFormData = populateOptionFields(
        formData,
        this.props.products.woods,
        "wood"
      );
      this.updateFields(newFormData);
    });
  }

  updateForm = (element) => {
    const newFormData = update(element, this.state.formdata, "products");
    this.setState({
      formError: false,
      formdata: newFormData,
    });
  };

  resetFieldsHandler = () => {
    const newFormData = resetFields(this.state.formdata, "products");
    this.setState({
      formError: false,
      formSuccess: true,
      formdata: newFormData,
    });
    //to show 3 seconds success message and to remove it
    setTimeout(() => {
      this.setState(
        {
          formSuccess: false,
        },
        () => {
          //no need to keep newly added product info into the state
          //so we are removing this info from redux state
          this.props.dispatch(clearProduct());
        }
      );
    }, 3000);
  };

  submitForm = (event) => {
    event.preventDefault();

    let formIsValid = isFormValid(this.state.formdata, "products");

    if (formIsValid) {
      let dataToSubmit = generateData(this.state.formdata, "products");
      //console.log(dataToSubmit);
      this.props
        .dispatch(addProduct(dataToSubmit))
        .then(() => {
          if (this.props.products.addProduct.success) {
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
      <UserLayout>
        <div>
          <h1>Add product</h1>
          <form onSubmit={(event) => this.submitForm(event)}>
            <FormField
              id={"name"}
              formFieldData={this.state.formdata.name}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={"description"}
              formFieldData={this.state.formdata.description}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={"price"}
              formFieldData={this.state.formdata.price}
              change={(element) => this.updateForm(element)}
            />
            <div className="form_devider"></div>
            <FormField
              id={"brand"}
              formFieldData={this.state.formdata.brand}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={"shipping"}
              formFieldData={this.state.formdata.shipping}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={"available"}
              formFieldData={this.state.formdata.available}
              change={(element) => this.updateForm(element)}
            />
            <div className="form_devider"></div>
            <FormField
              id={"wood"}
              formFieldData={this.state.formdata.wood}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={"frets"}
              formFieldData={this.state.formdata.frets}
              change={(element) => this.updateForm(element)}
            />
            <div className="form_devider"></div>
            <FormField
              id={"publish"}
              formFieldData={this.state.formdata.publish}
              change={(element) => this.updateForm(element)}
            />
            {this.state.formSuccess ? (
              <div className="form_success">Success...</div>
            ) : null}

            {this.state.formError ? (
              <div className="error_label">Please check your data</div>
            ) : null}

            <button type="submit">Add product</button>
          </form>
        </div>
      </UserLayout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

export default connect(mapStateToProps)(AddProduct);
