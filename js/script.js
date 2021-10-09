// CONSTANTS
const difficulty_thematic = document.getElementsByClassName("difficulty-thematic-main-container");
const button_send_form1 = document.getElementById('id-submit-button-form1');
const main_form = document.getElementById('id-main-form-header');
const secondary_form = document.getElementById('id-difficulty-thematic-main-container')


button_send_form1.addEventListener('click', (e) => {
    e.preventDefault();
    main_form.style.display = 'flex'
    secondary_form.style.display= 'none'
})


