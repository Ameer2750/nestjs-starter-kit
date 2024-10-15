import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsIndianPhoneNumberConstraint implements ValidatorConstraintInterface {
    validate(phone: string) {
        // Regular expression for validating Indian phone numbers
        const phoneRegex = /^(?:\+91|91|0)?[6789]\d{9}$/;
        return typeof phone === 'string' && phoneRegex.test(phone);
    }

    defaultMessage() {
        return 'Phone number must be a valid Indian number'; // Error message when validation fails
    }
}

export function IsIndianPhoneNumber(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isIndianPhoneNumber',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsIndianPhoneNumberConstraint,
        });
    };
}
