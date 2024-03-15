// Function to display modal window with event details
function displayEventModal(event) {
    // Populate modal content with event details
    $('#modal-1-content .event__image').html('<img src="' + (event.images && event.images.length > 0 ? event.images[0].url : 'placeholder.jpg') + '">');
    $('#modal-1-content .event__info_tilte').text(event.name);
    $('#modal-1-content .event__info').text(event.info);
    $('#modal-1-content .event__start_date').text(event.dates.start.localDate);
    $('#modal-1-content .event__place').text(event._embedded && event._embedded.venues && event._embedded.venues.length > 0 ? event._embedded.venues[0].name : 'Venue information not available');
    $('#modal-1-content .event__who').text(event.who);
    $('#modal-1-content .event__prices').text(event.prices);

    // Show the modal
    MicroModal.show('modal-1');

    // Close modal when close button or outside modal area is clicked
    $(document).on('click', '[data-micromodal-close]', function() {
        MicroModal.close('modal-1');
    });
}