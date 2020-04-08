import React from "react";

export const FormField = ({ formFieldData, change, id }) => {
  const showError = () => {
    let errorMessage = null;

    if (formFieldData.validation && !formFieldData.valid) {
      errorMessage = (
        <div className="error_label">{formFieldData.validationMessage}</div>
      );
    }

    return errorMessage;
  };

  const renderTemplate = () => {
    let formTemplate = null;

    switch (formFieldData.element) {
      case "input":
        formTemplate = (
          <div className="formBlock">
            <input
              {...formFieldData.config}
              value={formFieldData.value}
              onBlur={(event) => change({ event, id, blur: true })}
              onChange={(event) => change({ event, id })}
            />
            {showError()}
          </div>
        );
        break;
      default:
        formTemplate = null;
    }

    return formTemplate;
  };

  return <div>{renderTemplate()}</div>;
};
