/**
 * reCAPTCHA v3 token generation
 * This module provides functionality to generate reCAPTCHA v3 tokens
 */

// Function to generate reCAPTCHA token
function generateRecaptchaToken() {
    return new Promise((resolve, reject) => {
        if (typeof grecaptcha === 'undefined') {
            reject(new Error('reCAPTCHA not loaded. Please check your internet connection and try again.'));
            return;
        }

        grecaptcha.ready(function() {
            try {
                grecaptcha.execute('6LftOXYrAAAAAJJrWSMSd8vfvgm-n8euRTpGA_qq', {action: 'submit'})
                    .then(function(token) {
                        if (!token) {
                            reject(new Error('Failed to generate reCAPTCHA token'));
                            return;
                        }
                        resolve(token);
                    })
                    .catch(function(error) {
                        console.error('reCAPTCHA error:', error);
                        reject(new Error('Failed to generate reCAPTCHA token. Please try again.'));
                    });
            } catch (error) {
                console.error('reCAPTCHA execution error:', error);
                reject(new Error('Failed to execute reCAPTCHA. Please try again.'));
            }
        });
    });
}

// Export the function to be used by other scripts
window.generateRecaptchaToken = generateRecaptchaToken; 