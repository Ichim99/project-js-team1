$(document).ready(function() {
    // Call MicroModal.init() to initialize MicroModal
    MicroModal.init();

  // Function to display event modal with additional details fetched
function displayEventModal(event) {
    // Display basic event details
    $('.modal__top_image').html('<img src="' + event.images[0].url + '">');
    $('#modal-1-content .event__image').html('<img src="' + event.images[0].url + '">');
    $('.event__info_tilte').text(event.name);
    $('.event__info').text(event.info);
    $('.event__start_date').text(event.dates.start.localDate);
    $('.event__place').text(event._embedded.venues[0].name);
    
    // Display event who if available
    if (event._embedded && event._embedded.attractions && event._embedded.attractions.length > 0) {
        let who = event._embedded.attractions.map(attraction => attraction.name).join(', ');
        $('.event__who').text(who);
    } else {
        $('.event__who').text('Information not available');
    }
    
    // Display event prices if available
    if (event.priceRanges && event.priceRanges.length > 0) {
        let prices = '';
        event.priceRanges.forEach(function(priceRange) {
            prices += `${priceRange.type}: ${priceRange.min} - ${priceRange.max} ${priceRange.currency}, `;
        });
        $('.event__prices').text(prices.slice(0, -2)); // Remove trailing comma and space
    } else {
        $('.event__prices').text('Prices information not available');
    }
    
    // Fetch additional details for the event
    fetchAdditionalEventDetails(event.id)
        .then(function(details) {
            // Update HTML elements with additional details
            $('.event__additional_details').html('<p>' + details.additionalDetails + '</p>');
        })
        .catch(function(error) {
            console.error('Error fetching additional event details:', error);
        });
    
    // Open the modal
    MicroModal.show('modal-1');
}

    // Function to fetch additional details for the event
    function fetchAdditionalEventDetails(eventId) {
        return new Promise(function(resolve, reject) {
            // Perform fetch request to retrieve additional details
            fetch(`https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=N7FCeNuTwKBillrRlUtN6okNTN2WqI0N`)
                .then(function(response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch additional details');
                    }
                })
                .then(function(data) {
                    // Resolve the promise with additional details
                    resolve(data);
                })
                .catch(function(error) {
                    // Reject the promise with the error
                    reject(error);
                });
        });
    }

    // Event handler to open modal for each event
    $(document).on('click', '.event', function() {
        // Extract the event ID from the clicked event element
        const eventId = $(this).data('event-id');

        // Fetch additional event details and then display the modal
        fetchAdditionalEventDetails(eventId)
            .then(function(eventDetails) {
                // Pass the fetched event details to displayEventModal function
                displayEventModal(eventDetails);
            })
            .catch(function(error) {
                console.error('Error fetching event details:', error);
            });
    });
});