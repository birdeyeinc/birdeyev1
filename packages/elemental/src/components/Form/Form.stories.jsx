import React from "react"
import Form from "./"
import FormInput from "atoms/FormInput"

export default {
    title: "Component/Form",
    component: Form,
    parameters: {
        layout: "centered",
    },
}

const Template = (args) => (



    <Form {...args}>
        <div style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
        }}>
            <div>
                <label
                    htmlFor="username"
                    style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "0.25rem",
                    }}
                >
                    Username
                </label>
                <FormInput
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                    validations={{
                        minLength: 3,
                        maxLength: 20,
                    }}
                    errorMessages={{
                        minLength: "Username must be at least 3 characters long",
                        maxLength: "Username must not exceed 20 characters",
                    }}
                    style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                />
            </div>
            <div>
                <label
                    htmlFor="email"
                    style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "0.25rem",
                    }}
                >
                    Email
                </label>
                <FormInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    validations={{
                        isEmail: true,
                    }}
                    errorMessages={{
                        isEmail: "Please enter a valid email address",
                    }}
                    style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                />
            </div>
            <div>
                <label
                    htmlFor="password"
                    style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "0.25rem",
                    }}
                >
                    Password
                </label>
                <FormInput
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    validations={{
                        minLength: 8,
                    }}
                    errorMessages={{
                        minLength: "Password must be at least 8 characters long",
                    }}
                    style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                />
            </div>
            <div>
                <label
                    htmlFor="age"
                    style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "0.25rem",
                    }}
                >
                    Age
                </label>
                <FormInput
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    required
                    validations={{
                        min: 18,
                        max: 120,
                    }}
                    errorMessages={{
                        min: "You must be at least 18 years old",
                        max: "Please enter a valid age",
                    }}
                    style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                />
            </div>
            <div>
                <label
                    htmlFor="birthdate"
                    style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#374151",
                        marginBottom: "0.25rem",
                    }}
                >
                    Date of Birth
                </label>
                <FormInput
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    required
                    validations={{
                        isDate: true,
                        dateRange: {
                            min: "1900-01-01",
                            max: new Date().toISOString().split("T")[0],
                        },
                    }}
                    errorMessages={{
                        isDate: "Please enter a valid date",
                        dateRange: "Please enter a valid date of birth",
                    }}
                    style={{
                        width: "100%",
                        padding: "0.5rem 0.75rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    }}
                />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <FormInput
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    style={{
                        width: "1rem",
                        height: "1rem",
                        borderColor: "#d1d5db",
                        borderRadius: "0.25rem",
                    }}
                />
                <label
                    htmlFor="terms"
                    style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#111827",
                    }}
                >
                    I agree to the terms and conditions
                </label>
            </div>
            <div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        padding: "0.5rem 1rem",
                        border: "none",
                        borderRadius: "0.375rem",
                        backgroundColor: "rgb(1 156 253)",
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        cursor: "pointer",
                    }}
                >
                    Create account
                </button>
            </div>
        </div>
    </Form>

)

export const Default = Template.bind({})
Default.args = {
    onSubmit: (model, isValid, validationErrors) => {
    },
    validations: {
        customValidation: (formModel) => {
            // Example of a custom form-level validation
            return formModel.password !== formModel.username
        },
    },
    errorMessages: {
        customValidation: "Password cannot be the same as the username",
    },
    showErrorsAtFormlevel: true,
    validateAllInputs: true,
    errorsInline: false,
}

