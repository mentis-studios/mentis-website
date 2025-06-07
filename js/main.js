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

    // --- Generic form submission function ---
    async function submitForm(formData, endpoint) {
        try {
            // Use localhost for API endpoints
            const apiUrl = `http://localhost:3000${endpoint}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return { success: false, message: 'Network error' };
        }
    }
    // ----------------------------------------

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

                const $button = $("#contact-form button[type='submit']");
                $button.text("Sending...").attr("disabled", "");

                $("#contact-form").addClass("hidden");
                $(".contact-popup h2.tracking-tight").addClass("hidden");
                $(".contact-popup #thanks-message").removeClass("hidden");

                // Gather form data
                const formData = {
                    fullName: form.fullName.value,
                    enquiry: form.enquiry.value,
                    email: form.email.value,
                    phoneNumber: form.phoneNumber.value,
                    company: form.company.value,
                    jobTitle: form.jobTitle.value,
                    country: form.country.value,
                    newsletter_opt_in: form.newsletter_opt_in ? form.newsletter_opt_in.checked : false
                };

                const result = await submitForm(formData, '/api/contact');

                setTimeout(() => {
                    $(".contact-popup").addClass("hidden");
                    $("#contact-form").removeClass("hidden");
                    $(".contact-popup h2.tracking-tight").removeClass("hidden");
                    $(".contact-popup #thanks-message").addClass("hidden");
                    $button.text("SUBMIT").removeAttr("disabled");
                    if(result.success){
                        form.reset();
                    } else {
                        alert(result.message || "Message failed to send");
                    }
                }, 2000);
            }
        });
    }

    if(document.querySelector("#checkout-form")) {
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
            submitHandler: function (form, event) {
                event.preventDefault();

                $("#checkout-form button[type='submit']").text("Payment in progress...").attr("disabled","")

                setTimeout(() => {
                    window.location.href = `thank-you.html`;
                }, 1500)
            }
        });
    }

    if (document.querySelector("#newsletter-form")) {
        $('#newsletter-form input').on('input', function () {
            if ($(this).val().trim() !== '') {
                $("#newsletter-form button[type='submit']").prop('disabled', false);
            } else {
                $("#newsletter-form button[type='submit']").prop('disabled', true);
            }
        });

        $('#newsletter-form').on('submit', async function (e) {
            e.preventDefault();

            const email = $('#newsletter-form input').val().trim();
            const $button = $("#newsletter-form button[type='submit']");

            if (isValidEmail(email)) {
                $button.text("Subscribing...").attr("disabled", "");
                const result = await submitForm({ email }, '/api/newsletter');
                if(result.success){
                    $("#newsletter-form").addClass("hidden").next().removeClass("hidden");
                    this.reset();
                } else {
                    alert(result.message || "Subscription failed");
                }
                $button.text("Subscribe").removeAttr("disabled");
            } else {
                alert('Please enter a valid email address.');
            }
        });

        function isValidEmail(email) {
            if (email === '') {
                return false;  
            }
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            return emailPattern.test(email);
        }

        $("#return-newsletter").on("click", function () {
            $("#newsletter-form button[type='submit']").html("Subscribe")
            $("#newsletter-form input").val("");
            $("#newsletter-form").removeClass("hidden").next().addClass("hidden")
        })
    }
})