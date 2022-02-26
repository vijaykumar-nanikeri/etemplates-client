export enum LABELS {
  GreetHi = 'Hi',
  GreetWelcome = 'Welcome to',
  GreetMessage = 'As you are first time logging in, it is recommended to change the password!',
}

export enum PASSWORD_FORM_CONTROL_LABELS {
  MinLength = 6,
  MaxLength = 16,
  Pattern = '^[A-Za-z0-9!#$+-@^_~]+$',
  RequiredValidationFeedback = 'Field is required.',
  MinLengthValidationFeedback = 'Minimum length of the field is 6.',
  MaxLengthValidationFeedback = 'Maximum length of the field is 16.',
  PatternValidationFeedback = 'Invalid pattern.',
  MinLengthInstruction = `Minimum length of the password is <code>6</code>.`,
  MaxLengthInstruction = `Maximum length of the password is <code>16</code>.`,
  PatternInstruction = `
    Characters Allowed:
    Case-insensitive,
    Numbers,
    Special (
      <code>!</code>,
      <code>#</code>,
      <code>$</code>,
      <code>+</code>,
      <code>-</code>,
      <code>@</code>,
      <code>^</code>,
      <code>_</code>,
      <code>~</code>
      only
    )`,
  PasswordsMismatchValidationFeedback = 'Passwords do not match.',
}

export enum CHANGE_DEFAULT_PASSWORD_MODAL_LABELS {
  Title = 'Change Default Password',
  NewPassword = 'New Password',
  NewPasswordPlaceholder = 'New Password',
  ConfirmPassword = 'Confirm Password',
  ConfirmPasswordPlaceholder = 'Confirm Password',
  Cancel = 'Cancel',
  ChangeDefaultPassword = 'Change Default Password',
}
