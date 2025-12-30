export interface PasswordStrength {
  score: number; // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
  meetsRequirements: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function validatePassword(password: string): PasswordStrength {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const feedback: string[] = [];
  let score = 0;

  // Length scoring
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  else if (password.length < 8) {
    feedback.push('Use at least 8 characters');
  }

  // Character variety scoring
  if (requirements.hasUppercase) score += 15;
  else feedback.push('Add uppercase letters');

  if (requirements.hasLowercase) score += 15;
  else feedback.push('Add lowercase letters');

  if (requirements.hasNumber) score += 15;
  else feedback.push('Add numbers');

  if (requirements.hasSpecialChar) score += 15;
  else feedback.push('Add special characters (!@#$%^&*)');

  // Complexity checks
  if (hasRepeatingCharacters(password)) {
    score -= 10;
    feedback.push('Avoid repeating characters');
  }

  if (hasSequentialCharacters(password)) {
    score -= 10;
    feedback.push('Avoid sequential characters');
  }

  if (isCommonPassword(password)) {
    score -= 20;
    feedback.push('This is a common password');
  }

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine level
  let level: PasswordStrength['level'];
  if (score < 40) level = 'weak';
  else if (score < 60) level = 'fair';
  else if (score < 75) level = 'good';
  else if (score < 90) level = 'strong';
  else level = 'very-strong';

  // Good feedback messages
  if (feedback.length === 0) {
    if (level === 'very-strong') {
      feedback.push('Excellent password!');
    } else if (level === 'strong') {
      feedback.push('Strong password!');
    } else {
      feedback.push('Good password');
    }
  }

  const meetsRequirements =
    requirements.minLength &&
    requirements.hasUppercase &&
    requirements.hasLowercase &&
    requirements.hasNumber;

  return {
    score,
    level,
    feedback,
    meetsRequirements,
    requirements,
  };
}

function hasRepeatingCharacters(password: string): boolean {
  return /(.)\1{2,}/.test(password);
}

function hasSequentialCharacters(password: string): boolean {
  const sequences = [
    'abc',
    '123',
    'qwerty',
    'asdf',
    'zxcv',
    'password',
    '!@#$',
  ];

  const lowerPassword = password.toLowerCase();

  return sequences.some(seq => lowerPassword.includes(seq));
}

function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    'password',
    '12345678',
    'qwerty',
    'abc123',
    'letmein',
    'welcome',
    'monkey',
    'dragon',
    'master',
    'sunshine',
    'princess',
    'football',
    'baseball',
    'superman',
    'iloveyou',
    'trustno1',
  ];

  return commonPasswords.includes(password.toLowerCase());
}

export function getPasswordStrengthColor(level: PasswordStrength['level']): string {
  const colors = {
    weak: '#ef4444', // red-500
    fair: '#f59e0b', // amber-500
    good: '#eab308', // yellow-500
    strong: '#22c55e', // green-500
    'very-strong': '#10b981', // emerald-500
  };

  return colors[level];
}

export function getPasswordStrengthLabel(level: PasswordStrength['level']): string {
  const labels = {
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
    'very-strong': 'Very Strong',
  };

  return labels[level];
}

export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = uppercase + lowercase + numbers + special;
  let password = '';

  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
