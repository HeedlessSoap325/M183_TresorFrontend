export function evaluatePasswordStrength(password: string) {
    const rules = [
        /[0-9]/,             // digit
        /[a-z]/,             // small letter
        /[A-Z]/,             // capital letter
        /[@#$%^&+=*!]/,        // special character
        /^\S+$/,             // no whitespace
        /^.{8,20}$/,         // length between 4 and 20
    ];

    let passed = 0;
    for (const rule of rules) {
        if (rule.test(password)) {
            passed++;
        }
    }
    const percentage = Math.round((passed / rules.length) * 100);
    return percentage;
}
