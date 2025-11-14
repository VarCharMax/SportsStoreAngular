import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function currencyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null; // Don't validate if empty, let Validators.required handle it
    }

    // Check for a valid numeric format with optional currency symbol
    const currencyRegex = /^\$?\d+(\.\d{1,2})?$/;
    if (!currencyRegex.test(value)) {
      return { invalidCurrencyFormat: true };
    }

    // Check for minimum/maximum values
    const numericValue = parseFloat(value.replace('$', '')); // Remove symbol for numeric comparison
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 1000000) {
      return { outOfRange: true };
    }

    return null; // Validation passed
  };
}
