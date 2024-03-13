$(document).ready(function() {
    let eventsPerPage = 20;
    let currentPage = 1;
    let debounceTimer;

    // Function to debounce search input
    function debounce(func, wait) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, wait);
    }

// Function to display events
function displayEvents(events) {
    let eventsContainer = $('#events-container');
    eventsContainer.empty();

    if (!events || events.length === 0) {
        eventsContainer.html('<p>No events found</p>');
        return;
    }

    let eventCount = 0;
    let row;
    events.forEach(function(event) {
        if (eventCount % 20 === 0) {
            row = $('<div class="row"></div>');
            eventsContainer.append(row);
        }
        let eventDiv = $('<div class="event"></div>');
        let eventImage = $('<img class="img-card">');
        if (event.images && event.images.length > 0) {
            eventImage.attr('src', event.images[0].url);
            eventImage.attr('alt', event.name);
            eventImage.attr('width', '267');
            eventImage.attr('height', '220');
        } else {
            // Placeholder image or handle no image case
            eventImage.attr('src', 'placeholder.jpg');
            eventImage.attr('alt', 'No Image Available');
            eventImage.attr('width', '267');
            eventImage.attr('height', '220');
        }
        eventDiv.append(eventImage);

        eventDiv.append('<h2 class="title-event"> ' + event.name + '</h2 > ');
        eventDiv.append('<p class="data-event">' + event.dates.start.localDate + '</p>');
        if (event._embedded && event._embedded.venues && event._embedded.venues.length > 0) {
            eventDiv.append('<p class="location-event" >' + event._embedded.venues[0].name + '</p>');
        } else {
            eventDiv.append('<p>Venue information not available</p>');
        }
        row.append(eventDiv);
        eventCount++;
    });
}

// Function to display pagination
function displayPagination(totalPages) {
    let paginationContainer = $('#pagination-container');
    paginationContainer.empty();
    let numPagesToDisplay = Math.min(totalPages, 13); // Limit to 13 pages
    for (let i = 1; i <= numPagesToDisplay; i++) {
        let pageButton = $('<button class="page-number">' + i + '</button>');
        pageButton.click(function() {
            currentPage = i; // Update currentPage when a pagination button is clicked
            fetchDataAndDisplayEvents();
        }.bind(null, i)); // Pass page number as parameter
        paginationContainer.append(pageButton);

       
    }
    
}

    // Function to fetch events from API
    function fetchDataAndDisplayEvents(searchTerm) {
        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v2/events.json",
            async: true,
            data: {
                apikey: "N7FCeNuTwKBillrRlUtN6okNTN2WqI0N",
                keyword: searchTerm,
                page: currentPage,
                size: eventsPerPage
            },
            dataType: "json",
            success: function(json) {
                if (json._embedded && json._embedded.events) {
                    let events = json._embedded.events;
                    let totalPages = Math.ceil(json.page.totalElements / eventsPerPage);
                    displayEvents(events);
                    displayPagination(totalPages);
                } else {
                    $('#events-container').html('<p>No events found</p>');
                }
            },
            error: function(xhr, status, err) {
                console.error("Error fetching events:", err);
                $('#events-container').html('<p>Error fetching events. Please try again later.</p>');
            }
        });
    }

    // Search input event handler
    $('#header-search').on('input', function() {
        let searchTerm = $(this).val().toLowerCase(); // Convert search term to lowercase
        debounce(function() {
            fetchDataAndDisplayEvents(searchTerm);
        }, 300); // Debounce time set to 300 milliseconds
    });

    // Initial data load
    fetchDataAndDisplayEvents('');
});