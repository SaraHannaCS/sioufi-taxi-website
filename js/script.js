$(document).ready(function () {


    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
        $('#darkModeToggle').text('☀️ Light');
    }

    $('#darkModeToggle').on('click', function () {
        $('body').toggleClass('dark-mode');
        const isDark = $('body').hasClass('dark-mode');
        localStorage.setItem('darkMode', isDark);
        $(this).text(isDark ? '☀️ Light' : '🌙 Dark');
    });

    if ($('#servicesContainer').length) {

        $.getJSON('data/services.json', function (services) {

            let output = '';

            services.forEach(function (service) {
                output += `
                    <div class="col-md-4">
                        <div class="service-card" data-category="${service.category}">
                            <img src="${service.image}" alt="${service.name} - Sioufi Taxi service">
                            <div class="service-card-body">
                                <span class="service-badge">${service.category}</span>
                                <h4>${service.name}</h4>
                                <p>${service.description}</p>
                                <p class="service-price">From $${service.price}</p>
                                <a href="contact.html" class="btn btn-warning btn-sm">Book Now</a>
                            </div>
                        </div>
                    </div>
                `;
            });

            $('#servicesContainer').html(output);

        }).fail(function () {
            $('#servicesContainer').html(
                '<p class="loading-msg">Could not load services. Please try again later.</p>'
            );
        });
    }

    $('#searchInput').on('keyup', function () {
        const value = $(this).val().toLowerCase();

        $('.service-card').each(function () {
            const text = $(this).text().toLowerCase();
            $(this).closest('.col-md-4').toggle(text.indexOf(value) > -1);
        });

        // Show "no results" message if all cards are hidden
        const visible = $('.service-card:visible').length;
        if (visible === 0) {
            if ($('#noResults').length === 0) {
                $('#servicesContainer').append('<p id="noResults" class="loading-msg">No services found matching your search.</p>');
            }
        } else {
            $('#noResults').remove();
        }
    });

    $('#categoryFilter').on('change', function () {
        const category = $(this).val();
        $('#noResults').remove();

        $('.service-card').each(function () {
            const cardCategory = $(this).attr('data-category');
            if (category === 'all' || cardCategory === category) {
                $(this).closest('.col-md-4').show();
            } else {
                $(this).closest('.col-md-4').hide();
            }
        });

        const visible = $('.service-card:visible').length;
        if (visible === 0) {
            $('#servicesContainer').append('<p id="noResults" class="loading-msg">No services found in this category.</p>');
        }
    });

    $('.filter-btn').on('click', function () {
        const filter = $(this).data('filter');

        $('.filter-btn').removeClass('active-btn');
        $(this).addClass('active-btn');

        if (filter === 'all') {
            $('.gallery-item').fadeIn(300);
        } else {
            $('.gallery-item').hide();
            $('.' + filter).fadeIn(300);
        }
    });


    $(document).on('click', '.gallery-item', function () {
        const src = $(this).attr('src');
        const alt = $(this).attr('alt');
        $('#lightboxImg').attr('src', src).attr('alt', alt);
        $('#lightbox').fadeIn(300);
    });

    $('#lightboxClose').on('click', function () {
        $('#lightbox').fadeOut(300);
    });

    $('#lightbox').on('click', function (e) {
        if ($(e.target).is('#lightbox')) {
            $('#lightbox').fadeOut(300);
        }
    });

    // Close lightbox on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('#lightbox').fadeOut(300);
        }
    });



    $(document).on('mouseenter', '.gallery-item', function () {
        $(this).css('opacity', '0.75');
    }).on('mouseleave', '.gallery-item', function () {
        $(this).css('opacity', '1');
    });


    $('#tripRange').on('input', function () {
        $('#rangeValue').text($(this).val());
    });


    $('#bookPhone, #regPhone').on('keyup', function () {
        const val = $(this).val();
        if (val !== '' && !/^[0-9]+$/.test(val)) {
            $(this).css('border-color', '#ef4444');
            $('#phoneWarning').text('Phone number must contain numbers only.');
        } else {
            $(this).css('border-color', '');
            $('#phoneWarning').text('');
        }
    });

    $('#contactMessage').on('input', function () {
        const len = $(this).val().length;
        const counter = $('#messageCounter');
        counter.text(len + ' / 20 characters minimum');
        if (len >= 20) {
            counter.css('color', '#22c55e');
        } else {
            counter.css('color', '#ef4444');
        }
    });

    $('#contactForm').on('submit', function (event) {
        event.preventDefault();

        const name    = $('#contactName').val().trim();
        const email   = $('#contactEmail').val().trim();
        const phone   = $('#contactPhone').val().trim();
        const message = $('#contactMessage').val().trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0-9]+$/;

        if (name === '') {
            alert('Full name cannot be empty.');
            return;
        }

        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address (e.g. name@example.com).');
            return;
        }

        if (!phonePattern.test(phone) || phone.length < 7) {
            alert('Phone number must contain numbers only and be at least 7 digits.');
            return;
        }

        if (message.length < 20) {
            alert('Your message must be at least 20 characters long.');
            return;
        }

        alert(
            'Thank you, ' + name + '.\n\n' +
            'Your submitted data:\n' +
            '• Email: '   + email   + '\n' +
            '• Phone: '   + phone   + '\n' +
            '• Message: ' + message + '\n\n' +
            'We will get back to you within 24 hours.'
        );

        $('#contactForm')[0].reset();
        $('#messageCounter').text('');
    });


    $('#bookingForm').on('submit', function (event) {
        event.preventDefault();

        const name        = $('#bookName').val().trim();
        const phone       = $('#bookPhone').val().trim();
        const pickup      = $('#bookPickup').val().trim();
        const destination = $('#bookDestination').val().trim();
        const date        = $('#bookDate').val();
        const time        = $('#bookTime').val();
        const range       = $('#tripRange').val();

        const phonePattern = /^[0-9]+$/;

        if (name === '') {
            alert('Full name cannot be empty.');
            return;
        }

        if (!phonePattern.test(phone) || phone.length < 7) {
            alert('Phone number must contain numbers only and be at least 7 digits.');
            return;
        }

        if (pickup === '') {
            alert('Please enter a pick-up location.');
            return;
        }

        if (destination === '') {
            alert('Please enter a destination.');
            return;
        }

        if (date === '') {
            alert('Please select a date for your trip.');
            return;
        }

        if (time === '') {
            alert('Please select a time for your trip.');
            return;
        }

        alert(
            'Booking Confirmed! Thank you, ' + name + '.\n\n' +
            'Your booking details:\n' +
            '• Phone: '         + phone       + '\n' +
            '• Pick-up: '       + pickup      + '\n' +
            '• Destination: '   + destination + '\n' +
            '• Date: '          + date        + '\n' +
            '• Time: '          + time        + '\n' +
            '• Est. Distance: ' + range       + ' km\n\n' +
            'We will contact you shortly to confirm your ride.'
        );

        $('#bookingForm')[0].reset();
        $('#rangeValue').text('50');
        $('#phoneWarning').text('');
    });



    $('#registerForm').on('submit', function (event) {
        event.preventDefault();

        const username = $('#regUsername').val().trim();
        const email    = $('#regEmail').val().trim();
        const phone    = $('#regPhone').val().trim();
        const password = $('#regPassword').val();
        const confirm  = $('#regConfirm').val();
        const rideType = $('#rideType').val();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^[0-9]+$/;

        if (username === '') {
            alert('Username cannot be empty.');
            return;
        }

        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!phonePattern.test(phone) || phone.length < 7) {
            alert('Phone number must contain numbers only and be at least 7 digits.');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirm) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        if (rideType === '') {
            alert('Please select a preferred ride type.');
            return;
        }

        alert(
            'Registration Successful!\n\n' +
            'Welcome, ' + username + '!\n' +
            'Preferred Ride: ' + rideType + '\n\n' +
            'You can now book rides faster with your account.'
        );

        $('#registerForm')[0].reset();
        $('#strengthMessage').text('').removeClass('weak medium strong');
    });


    
    $('#regPassword').on('keyup', function () {
        const password = $(this).val();
        const msg = $('#strengthMessage');

        if (password.length === 0) {
            msg.text('').removeClass('weak medium strong');
        } else if (password.length < 5) {
            msg.text('Weak Password — too short').removeClass('medium strong').addClass('weak');
        } else if (password.length < 8 || !/[0-9]/.test(password)) {
            msg.text('Medium Password — add numbers or symbols').removeClass('weak strong').addClass('medium');
        } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 8) {
            msg.text('Strong Password ✓').removeClass('weak medium').addClass('strong');
        } else {
            msg.text('Medium Password — try adding uppercase letters').removeClass('weak strong').addClass('medium');
        }
    });


    
    $(document).on('mouseenter', '.service-card', function () {
        $(this).css('border-color', '#ffc107');
    }).on('mouseleave', '.service-card', function () {
        $(this).css('border-color', 'rgba(255,255,255,0.08)');
    });

});
