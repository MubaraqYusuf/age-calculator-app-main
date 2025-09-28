class AgeCalculator {
  constructor() {
    this.form = document.getElementById('ageForm');
    this.dayInput = document.getElementById('day');
    this.monthInput = document.getElementById('month');
    this.yearInput = document.getElementById('year');
    
    this.yearsResult = document.getElementById('yearsResult');
    this.monthsResult = document.getElementById('monthsResult');
    this.daysResult = document.getElementById('daysResult');
    
    this.dayError = document.getElementById('dayError');
    this.monthError = document.getElementById('monthError');
    this.yearError = document.getElementById('yearError');
    
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Add input event listeners for real-time validation clearing
    [this.dayInput, this.monthInput, this.yearInput].forEach(input => {
      input.addEventListener('input', () => this.clearFieldError(input));
      input.addEventListener('focus', () => this.clearFieldError(input));
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    const day = parseInt(this.dayInput.value);
    const month = parseInt(this.monthInput.value);
    const year = parseInt(this.yearInput.value);
    
    // Reset all errors
    this.clearAllErrors();
    
    // Validate inputs
    const validation = this.validateInputs(day, month, year);
    
    if (!validation.isValid) {
      this.displayErrors(validation.errors);
      return;
    }
    
    // Calculate and display age
    const birthDate = new Date(year, month - 1, day);
    const age = this.calculateAge(birthDate);
    
    if (age.error) {
      this.displayErrors({ general: age.error });
      return;
    }
    
    this.animateResults(age);
  }
  
  validateInputs(day, month, year) {
    const errors = {};
    let isValid = true;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    // Check for empty fields
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
    
    // If any field is empty, return early
    if (!isValid) {
      return { isValid, errors };
    }
    
    // Validate ranges
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
    
    // Validate date existence (e.g., not 31st of February)
    if (isValid) {
      const testDate = new Date(year, month - 1, day);
      if (testDate.getDate() !== day || testDate.getMonth() !== month - 1 || testDate.getFullYear() !== year) {
        errors.day = 'Must be a valid date';
        isValid = false;
      }
      
      // Check if date is in the future
      if (testDate > currentDate) {
        errors.year = 'Must be in the past';
        isValid = false;
      }
    }
    
    return { isValid, errors };
  }
  
  calculateAge(birthDate) {
    const today = new Date();
    
    if (birthDate > today) {
      return { error: 'Birth date cannot be in the future' };
    }
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  }
  
  animateResults(age) {
    // Add calculating state
    document.querySelector('.results-section').classList.add('calculating');
    
    setTimeout(() => {
      // Animate each number counting up
      this.animateNumber(this.yearsResult, 0, age.years, 1000);
      this.animateNumber(this.monthsResult, 0, age.months, 1200);
      this.animateNumber(this.daysResult, 0, age.days, 1400);
      
      // Remove calculating state
      document.querySelector('.results-section').classList.remove('calculating');
      
      // Add slide-in animation
      document.querySelector('.results-section').classList.add('animate-in');
      setTimeout(() => {
        document.querySelector('.results-section').classList.remove('animate-in');
      }, 600);
    }, 200);
  }
  
  animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const range = end - start;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (range * easeOutQuart));
      
      element.textContent = current;
      element.classList.add('counter-animation');
      
      setTimeout(() => {
        element.classList.remove('counter-animation');
      }, 100);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
  
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
  
  showFieldError(inputField, errorElement, message) {
    inputField.classList.add('error');
    inputField.closest('.input-group').classList.add('error');
    errorElement.textContent = message;
  }
  
  clearFieldError(inputField) {
    inputField.classList.remove('error');
    inputField.closest('.input-group').classList.remove('error');
    
    const errorElement = inputField.closest('.input-group').querySelector('.error-message');
    errorElement.textContent = '';
  }
  
  clearAllErrors() {
    [this.dayInput, this.monthInput, this.yearInput].forEach(input => {
      this.clearFieldError(input);
    });
  }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AgeCalculator();
});

// Add some interactive feedback
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.input-field');
  
  inputs.forEach(input => {
    // Add placeholder animation on focus
    input.addEventListener('focus', () => {
      input.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
      input.style.transform = 'scale(1)';
    });
  });
});