$(document).ready(function () {





    // Smooth scroll to top on click
    $('#bottom-scroll-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
        return false;
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            if (!document.querySelector('#main-menu').classList.contains("hidden")) {
                !document.querySelector('#main-menu').classList.add("hidden");
                !document.querySelector('#main-menu').classList.remove("flex");
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target && target !== "#contact") {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });




    $("#menu-btn").click(function () {
        $("#main-menu").toggleClass("hidden flex");
    });


    $('a[href="contact"]').click(function (e) {
        e.preventDefault();
        $(".contact-popup").removeClass("hidden");
    });


    $('#popup-btn-close,#popup-overlay').click(function () {
        $(".contact-popup").addClass("hidden");
    });

    // Handler for the custom newsletter checkbox
    $('#newsletter').on('click', function() {
        const $button = $(this);
        // The hidden input is the next sibling in the current HTML structure.
        const $hiddenCheckbox = $button.next('input[type="checkbox"]'); 

        const isCurrentlyChecked = $button.attr('aria-checked') === 'true';

        if (isCurrentlyChecked) {
            $button.attr('aria-checked', 'false');
            $button.attr('data-state', 'unchecked');
            $hiddenCheckbox.prop('checked', false);
        } else {
            $button.attr('aria-checked', 'true');
            $button.attr('data-state', 'checked');
            $hiddenCheckbox.prop('checked', true);
        }
    });

    if(document.querySelector("#contact-form")){
        $('#contact-form').validate({


        errorElement: "p",
        errorClass: "text-sm font-medium text-destructive",
        rules: {
            fullName: { required: true, minlength: 3, maxlength: 35 },
            enquiry: { required: true, minlength: 3, maxlength: 300 },
            email: { required: true, email: true, minlength: 8, maxlength: 40 },
            phoneNumber: { required: true, minlength: 10, maxlength: 12 },
            company: { required: true, minlength: 2, maxlength: 40 },
            jobTitle: { required: true, minlength: 2, maxlength: 40 },
            country: { required: true },




        },
        messages: {
            fullName: { required: "Name must be at least 2 characters." },
            enquiry: { required: "Message must be at least 10 characters." },
            email: { required: "Please enter a valid email address." },
            phoneNumber: { required: "Please enter a valid phone number." },
            company: { required: "Please enter your company name." },
            jobTitle: { required: "Please enter your job title." },
            country: { required: "Please select your country." },



        },

        errorPlacement: function (error, element) {
            if (element.attr('name') == "phoneNumber") {
                element.parent().after(error);
            } else {
                element.after(error);
            }

        },
                    
            submitHandler: async function (form, event) {
                event.preventDefault();

                $("#contact-form button[type='submit']").text("Sending...").prop("disabled", true);
                // Clear previous error messages
                $("#contact-form .form-submission-error").remove();

                // Generate reCAPTCHA token
                let token = "";
                if (window.generateRecaptchaToken) {
                    try {
                        token = await window.generateRecaptchaToken();
                    } catch (err) {
                        alert("reCAPTCHA failed to load.");
                        $("#contact-form button[type='submit']").text("SUBMIT").prop("disabled", false);
                        return;
                    }
                }
                if (!token) {
                    alert("reCAPTCHA token not generated!");
                    $("#contact-form button[type='submit']").text("SUBMIT").prop("disabled", false);
                    return;
                }

                const formData = $(form).serializeArray();
                const jsonData = {};
                $.each(formData, function(index, field) {
                    jsonData[field.name] = field.value;
                });

                // Explicitly set newsletterOptIn based on the aria-checked state of the #newsletter div
                jsonData.newsletterOptIn = $('#newsletter').attr('aria-checked') === 'true';
                // Add reCAPTCHA token to payload
                jsonData.recaptcha_token = token;

                fetch("https://payments.mentis-studios.com/api/email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(jsonData),
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().catch(() => ({
                            error: true,
                            status: response.status,
                            statusText: response.statusText
                        })).then(errorData => {
                            throw errorData;
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Contact form success:", data);

                    $("#contact-form button[type='submit']").text("Sending...");
                    $("#contact-form").addClass("hidden");
                    $(".contact-popup h2.tracking-tight").addClass("hidden");
                    $(".contact-popup #thanks-message").removeClass("hidden");

                    setTimeout(() => {
                        $(".contact-popup").addClass("hidden");
                        $("#contact-form").removeClass("hidden");
                        $(".contact-popup h2.tracking-tight").removeClass("hidden");
                        $(".contact-popup #thanks-message").addClass("hidden");
                        $("#contact-form button[type='submit']").text("SUBMIT").prop("disabled", false);
                        form.reset();
                        $('#newsletter').attr('aria-checked', 'false').attr('data-state', 'unchecked');
                        $('#newsletter').next('input[type="checkbox"]').prop('checked', false);
                    }, 2000);
                })
                .catch((error) => {
                    console.error("Error submitting form:", error);

                    $("#contact-form button[type='submit']").text("Sending...");
                    $("#contact-form").addClass("hidden");
                    $(".contact-popup h2.tracking-tight").addClass("hidden");
                    $(".contact-popup #thanks-message").removeClass("hidden");

                    setTimeout(() => {
                        $(".contact-popup").addClass("hidden");
                        $("#contact-form").removeClass("hidden");
                        $(".contact-popup h2.tracking-tight").removeClass("hidden");
                        $(".contact-popup #thanks-message").addClass("hidden");
                        $("#contact-form button[type='submit']").text("SUBMIT").prop("disabled", false);
                        form.reset();
                        $('#newsletter').attr('aria-checked', 'false').attr('data-state', 'unchecked');
                        $('#newsletter').next('input[type="checkbox"]').prop('checked', false);
                    }, 2000);
                });
            }
    });
    }

    

   if (document.querySelector("#checkout-form")) {
    $('#checkout-form').validate({
        errorElement: "p",
        errorClass: "text-sm font-medium text-destructive",
        rules: {
            firstName: { required: true, minlength: 2, maxlength: 35 },
            lastName: { required: true, minlength: 2, maxlength: 35 },
            email: { required: true, email: true, minlength: 8, maxlength: 40 },
        },
        messages: {
            firstName: { required: "First Name must be at least 2 characters" },
            lastName: { required: "Last Name must be at least 2 characters" },
            email: { required: "Please enter a valid email address" },
        },
        errorPlacement: function (error, element) {
            element.after(error);
        },
        submitHandler: async function (form, event) {
            event.preventDefault();
            const urlParams = new URLSearchParams(window.location.search);
    const amountInUSD = urlParams.get('price');

            // Get form data
            const formData = {
                firstName: $("#checkout-form [name='firstName']").val(),
                lastName: $("#checkout-form [name='lastName']").val(),
                email: $("#checkout-form [name='email']").val(),
                amountInUSD: amountInUSD
             
            };

            // Update button state
            $("#checkout-form button[type='submit']")
                .text("Processing payment...")
                .attr("disabled", "");

            const paymentEndpoint = `https://payments.mentis-studios.com/payment-link`;

            try {
                const response = await fetch(paymentEndpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.paymentLink) {
                    // Redirect to payment link
                    window.open(result.paymentLink, '_self');
                } else {
                    // Show error if no link
                    $("#checkout-error")
                        .text("Payment processing failed. Please try again.")
                        .removeClass("hidden");
                    $("#checkout-form button[type='submit']")
                        .text("Proceed to Payment")
                        .removeAttr("disabled");
                }
            } catch (error) {
                console.error("Payment request failed:", error);
                $("#checkout-error")
                    .text("Payment processing failed. Please try again.")
                    .removeClass("hidden");
                $("#checkout-form button[type='submit']")
                    .text("Proceed to Payment")
                    .removeAttr("disabled");
            }
        }
    });
}




     if (document.querySelector("#newsletter-form")) {
        const $newsletterForm = $('#newsletter-form');
        const $newsletterFormParent = $newsletterForm.parent(); // Static parent for event delegation
        // More robust selection of the thank you container using the button ID within it
        const $thankYouContainer = $("#return-newsletter").closest('.bg-neutral-900.border.border-neutral-800.rounded-lg.p-6');
        // Fallback if the above is too specific or classes change, assuming it's a div parent of the button:
        // const $thankYouContainer = $("#return-newsletter").parent('div'); 

        $newsletterForm.find('input[type="email"]').on('input', function () {
            if ($(this).val().trim() !== '') {
                $newsletterForm.find("button[type='submit']").prop('disabled', false);
            } else {
                $newsletterForm.find("button[type='submit']").prop('disabled', true);
            }
        });

        $newsletterForm.on('submit', function (e) {
            e.preventDefault();

            const email = $newsletterForm.find('input[type="email"]').val().trim();
            const $submitButton = $newsletterForm.find("button[type='submit']");

            if (isValidEmail(email)) {
                $submitButton.text("Subscribing...").prop("disabled", true);
                $newsletterForm.find(".newsletter-form-error").remove();

                const jsonData = {
                    email: email,
                    newsletterSubscription: true
                };

                fetch("https://payments.mentis-studios.com/api/email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(jsonData),
                })
                .then(data => {
                    console.log("Newsletter subscription success:", data);
                    $newsletterForm.addClass("hidden");
                    $thankYouContainer.removeClass("hidden"); // Show the static thank you message
                })
                .catch(error => {
                    console.error("Error subscribing to newsletter (UI shows success):", error);
                    $newsletterForm.addClass("hidden");
                    $thankYouContainer.removeClass("hidden"); // Show the static thank you message
                });

            } else {
                $newsletterForm.find(".newsletter-form-error").remove();
                $newsletterForm.append('<p class="text-xs text-destructive newsletter-form-error">Please enter a valid email address.</p>');
            }
        });

        // Delegated click handler for the "#return-newsletter" button within the static thank you component
        $newsletterFormParent.on("click", "#return-newsletter", function () {
            $newsletterForm.find("button[type='submit']").html("Subscribe").prop('disabled', true);
            $newsletterForm.find("input[type='email']").val("");
            $newsletterForm.find(".newsletter-form-error").remove();
            $newsletterForm.removeClass("hidden");
            $thankYouContainer.addClass("hidden"); // Hide the static thank you message
        });

        function isValidEmail(email) {
            if (email === '') {
                return false;  
            }
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            return emailPattern.test(email);
        }

    }



})
