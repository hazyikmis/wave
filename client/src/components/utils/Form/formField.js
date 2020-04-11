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
            {formFieldData.showLabel ? (
              <div className="label_inputs">{formFieldData.config.label}</div>
            ) : null}

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
      case "textarea":
        formTemplate = (
          <div className="formBlock">
            {formFieldData.showLabel ? (
              <div className="label_inputs">{formFieldData.config.label}</div>
            ) : null}

            <textarea
              {...formFieldData.config}
              value={formFieldData.value}
              onBlur={(event) => change({ event, id, blur: true })}
              onChange={(event) => change({ event, id })}
            />
            {showError()}
          </div>
        );
        break;
      case "select":
        formTemplate = (
          <div className="formBlock">
            {formFieldData.showLabel ? (
              <div className="label_inputs">{formFieldData.config.label}</div>
            ) : null}

            <select
              value={formFieldData.value}
              onBlur={(event) => change({ event, id, blur: true })}
              onChange={(event) => change({ event, id })}
            >
              <option value="">Select one</option>
              {formFieldData.config.options.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value}
                </option>
              ))}
            </select>
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
