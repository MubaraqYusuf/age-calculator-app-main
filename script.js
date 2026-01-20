// Class responsible for handling age calculation logic and UI interactions
class AgeCalculator {
  constructor() {
    // Cache form and input elements
    this.form = document.getElementById('ageForm');
    this.dayInput = document.getElementById('day');
    this.monthInput = document.getElementById('month');
    this.yearInput = document.getElementById('year');
    
    // Cache result display elements
    this.yearsResult = document.getElementById('yearsResult');
    this.monthsResult = document.getElementById('monthsResult');
    this.daysResult = document.getElementById('daysResult');
    
    // Cache error message elements
    this.dayError = document.getElementById('dayError');
    this.monthError = document.getElementById('monthError');
    this.yearError = document.getElementById('yearError');
    
    // Initialize event listeners
    this.init();
  }
  
  // Set up event listeners
  init() {
    // Handle form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Clear validation errors on input or focus
    [this.dayInput, this.monthInput, this.yearInput].forEach(input => {
      input.addEventListener('input', () => this.clearFieldError(input));
      input.addEventListener('focus', () => this.clearFieldError(input));
    });
  }
  
  // Handle form submission
  handleSubmit(e) {
    e.preventDefault(); // Prevent page reload
    
    // Parse input values as integers
    const day = parseInt(this.dayInput.value);
    const month = parseInt(this.monthInput.value);
    const year = parseInt(this.yearInput.value);
    
    // Clear any existing errors
    this.clearAllErrors();
    
    // Validate user input
    const validation = this.validateInputs(day, month, year);
    
    // If validation fails, display errors and stop
    if (!validation.isValid) {
      this.displayErrors(validation.errors);
      return;
    }
    
    // Create birth date object
    const birthDate = new Date(year, month - 1, day);
    
    // Calculate age
    const age = this.calculateAge(birthDate);
    
    // Handle calculation error (e.g., future date)
    if (age.error) {
      this.displayErrors({ general: age.error });
      return;
    }
    
    // Animate the result display
    this.animateResults(age);
  }
  
  // Validate input values
  validateInputs(day, month, year) {
    const errors = {};
    let isValid = true;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Check for empty or invalid fields
    if (!day || isNaN(day)) {
      errors.day = 'This field is required';
      isValid = false;
    }
    
    if (!month || isNaN(month)) {
      errors.month = 'This field is required';
      isValid = false;
    }
    
    if (!year || isNaN(year)) {
      errors.year = 'This field is required';
      isValid = false;
    }
    
    // Stop further validation if required fields are missing
    if (!isValid) {
      return { isValid, errors };
    }
    
    // Validate acceptable ranges
    if (day < 1 || day > 31) {
      errors.day = 'Must be a valid day';
      isValid = false;
    }
    
    if (month < 1 || month > 12) {
      errors.month = 'Must be a valid month';
      isValid = false;
    }
    
    if (year > currentYear) {
      errors.year = 'Must be in the past';
      isValid = false;
    }
    
    // Validate actual date existence (e.g., Feb 30)
    if (isValid) {
      const testDate = new Date(year, month - 1, day);
      
      // Ensure constructed date matches input
      if (
        testDate.getDate() !== day ||
        testDate.getMonth() !== month - 1 ||
        testDate.getFullYear() !== year
      ) {
        errors.day = 'Must be a valid date';
        isValid = false;
      }
      
      // Ensure date is not in the future
      if (testDate > currentDate) {
        errors.year = 'Must be in the past';
        isValid = false;
      }
    }
    
    return { isValid, errors };
  }
  
  // Calculate age based on birth date
  calculateAge(birthDate) {
    const today = new Date();
    
    // Guard against future dates
    if (birthDate > today) {
      return { error: 'Birth date cannot be in the future' };
    }
    
    // Initial difference calculation
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    // Adjust if days are negative
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    // Adjust if months are negative
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  }
  
  // Animate the display of results
  animateResults(age) {
    const resultsSection = document.querySelector('.results-section');
    
    // Indicate calculation state
    resultsSection.classList.add('calculating');
    
    setTimeout(() => {
      // Animate each value with different durations
      this.animateNumber(this.yearsResult, 0, age.years, 1000);
      this.animateNumber(this.monthsResult, 0, age.months, 1200);
      this.animateNumber(this.daysResult, 0, age.days, 1400);
      
      // Remove loading state
      resultsSection.classList.remove('calculating');
      
      // Trigger entrance animation
      resultsSection.classList.add('animate-in');
      setTimeout(() => {
        resultsSection.classList.remove('animate-in');
      }, 600);
    }, 200);
  }
  
  // Animate a number counting up
  animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;
    
    // Animation loop
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out animation curve
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + range * easeOutQuart);
      
      // Update UI
      element.textContent = current;
      element.classList.add('counter-animation');
      
      // Remove pulse class shortly after
      setTimeout(() => {
        element.classList.remove('counter-animation');
      }, 100);
      
      // Continue animation until complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  // Display validation errors
  displayErrors(errors) {
    if (errors.day) {
      this.showFieldError(this.dayInput, this.dayError, errors.day);
    }
    
    if (errors.month) {
      this.showFieldError(this.monthInput, this.monthError, errors.month);
    }
    
    if (errors.year) {
      this.showFieldError(this.yearInput, this.yearError, errors.year);
    }
  }
  
  // Show error message for a specific field
  showFieldError(inputField, errorElement, message) {
    inputField.classList.add('error');
    inputField.closest('.input-group').classList.add('error');
    errorElement.textContent = message;
  }
  
  // Clear error for a specific input field
  clearFieldError(inputField) {
    inputField.classList.remove('error');
    inputField.closest('.input-group').classList.remove('error');
    
    const errorElement = inputField
      .closest('.input-group')
      .querySelector('.error-message');
    
    errorElement.textContent = '';
  }
  
  // Clear all input errors
  clearAllErrors() {
    [this.dayInput, this.monthInput, this.yearInput].forEach(input => {
      this.clearFieldError(input);
    });
  }
}

// Initialize AgeCalculator once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new AgeCalculator();
});

// Add subtle focus animation for inputs
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.input-field');
  
  inputs.forEach(input => {
    // Slight scale-up on focus
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.02)';
    });
    
    // Reset scale on blur
    input.addEventListener('blur', () => {
      input.style.transform = 'scale(1)';
    });
  });
});
