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
        submitHandler: function (form, event) {
            event.preventDefault();

            $("#contact-form button[type='submit']").text("Sending...");
            $("#contact-form").addClass("hidden");
            $(".contact-popup h2.tracking-tight").addClass("hidden");

            $(".contact-popup #thanks-message").removeClass("hidden");

            setTimeout(() => {
                $(".contact-popup").addClass("hidden");
                $("#contact-form").removeClass("hidden");
                $(".contact-popup h2.tracking-tight").removeClass("hidden");
                $(".contact-popup #thanks-message").addClass("hidden");
                $("#contact-form button[type='submit']").text("SUBMIT");
                form.reset();
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





})