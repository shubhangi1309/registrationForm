import React, { useState } from "react";

const DynamicFormGenerator = ({ schema, onSubmit, darkMode }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const validateField = (field, value) => {
    if (field.required && !value) return `${field.label} is required.`;
    if (field.validation?.minLength && value.length < field.validation.minLength)
      return field.validation.message || `${field.label} is too short.`;
    if (field.validation?.maxLength && value.length > field.validation.maxLength)
      return field.validation.message || `${field.label} is too long.`;
    if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value))
      return field.validation.message || `Invalid ${field.label}`;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    schema.fields.forEach((field) => {
      const error = validateField(field, formData[field.id] || "");
      if (error) newErrors[field.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({});
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className={`max-w-lg mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} shadow-md rounded px-8 pt-6 pb-8 mb-4`}>
      <h1 className="text-2xl font-bold mb-4">{schema.formTitle}</h1>
      <p className="mb-6">{schema.formDescription}</p>

      {schema.fields.map((field) => (
        <div key={field.id} className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor={field.id}>{field.label}</label>

          {field.type === "textarea" && (
            <textarea
              id={field.id}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          )}

          {field.type === "select" && (
            <select
              id={field.id}
              className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
            >
              <option value="">Select an option</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {field.type === "radio" && (
            <div className="flex space-x-4">
              {field.options.map((option) => (
                <label key={option.value} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    name={field.id}
                    value={option.value}
                    checked={formData[field.id] === option.value}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                  />
                  <span className="pl-2">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === "checkbox" && (
            <div className="flex flex-wrap gap-4">
              {field.options.map((option) => (
                <label key={option.value} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    name={field.id}
                    value={option.value}
                    checked={(formData[field.id] || []).includes(option.value)}
                    onChange={(e) => {
                      const valueArray = formData[field.id] || [];
                      const newValue = e.target.checked
                        ? [...valueArray, option.value]
                        : valueArray.filter((val) => val !== option.value);
                      handleChange(field.id, newValue);
                    }}
                  />
                  <span className="pl-2">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {field.type !== "textarea" &&
            field.type !== "select" &&
            field.type !== "radio" &&
            field.type !== "checkbox" && (
              <input
                type={field.type}
                id={field.id}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}

          {errors[field.id] && <p className="text-red-500 text-xs italic mt-2">{errors[field.id]}</p>}
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
        <button type="button" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
};

export default DynamicFormGenerator;