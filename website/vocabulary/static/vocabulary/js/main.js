var word_index = 0;
var total = -1;
var score = 0;
var index_array;
var shuffled_index_array;
var obj;
var given_lang;
var to_translate_lang;

$(document).ready(function () {

    if (window.location.pathname == '/test1/' || window.location.pathname == '/test2/')
        setGivenLanguage();

    if ((window.location.pathname).indexOf('test_translate') > 0) {
        getGivenLanguage();
        $('form').get(0).reset();
    }

    $("#start_test_button").click(function () {
        startTheTest();
    });

    $("#check_word_button").click(function () {
        checkUserInput();
    });

    $("#repeat_test_button").click(function () {
        repeatTheTest();
    });

    $("#testing_form").submit(function (e) {
        e.preventDefault();
    });

    $('.form-group input').keyup(function () {
        var empty = false;
        $('.form-group input').each(function () {
            if ($(this).val().length == 0) {
                empty = true;
            }
        });
        if (empty) {
            $('.actions button').attr('disabled', 'disabled');
        } else {
            $('.actions button').attr('disabled', false);
        }
    });

    /*
     $("#next_button").click(function() {
     if(word_index < total) {
     word_index += 1;
     //$('#prev_button').show();
     }
     if(word_index >= total-1)
     $('#next_button').hide();
     //$('#word_to_translate').text(word_index + ": " + obj['words'][word_index]['eng'] + " - " + obj['words'][word_index]['pol']);
     $('#word_to_translate').text(word_index + ": " + obj['words'][word_index]['eng']);
     });

     $("#prev_button").click(function() {
     if(word_index > 0) {
     word_index -= 1;
     $('#next_button').show();
     }
     if(word_index <= 0)
     $('#prev_button').hide();
     $('#word_to_translate').text(word_index + ": " + obj['words'][word_index]['eng'] + " - " + obj['words'][word_index]['pol']);
     document.getElementById("word_index").innerHTML = word_index;
     });
     */
});

function startTheTest() {
    // $('#next_button').show();
    $('#start_test_button').hide();
    $('#testing_form').show();
    loadWords();
}

function setGivenLanguage() {
    if ($('#given_language').text() == 'english') {
        given_lang = 'eng';
        to_translate_lang = 'pol';
    }
    else if ($('#given_language').text() == 'polish') {
        given_lang = 'pol';
        to_translate_lang = 'eng';
    }
    localStorage.setItem("given_lang", given_lang);
    localStorage.setItem("to_translate_lang", to_translate_lang);
}

function getGivenLanguage() {
    given_lang = localStorage.getItem("given_lang");
    to_translate_lang = localStorage.getItem("to_translate_lang");
    if (given_lang == 'eng') {
        $('#set_given_lang').text('english');
        $('#set_to_translate_lang').text('polish');
        $('.dropdown-menu li').filter('.eng_pol').addClass('active');
        $('.dropdown-menu li').filter('.pol_eng').remove('active');
    }
    else {
        $('#set_given_lang').text('polish');
        $('#set_to_translate_lang').text('english');
        $('.dropdown-menu li').filter('.pol_eng').addClass('active');
        $('.dropdown-menu li').filter('.eng_pol').remove('active');
    }
}

function loadWords() {
    var command = $('#chosen_category').text();
    $.ajax({
        type: "GET",
        url: "/tralala/json/",
        data: {Command: command},
        cache: false,
        dataType: "json",
        success: function (data) {
            obj = JSON.parse(data['all_data']);
            total = data['counter'];
            index_array = Array.apply(null, Array(total)).map(function (_, i) {
                return i;
            });
            shuffled_index_array = shuffle(index_array);
            showNextWord();
        },
        error: function (error) {
            console.log("Error:");
            console.log(error);
        }
    });
}

function showNextWord() {
    $('#word_to_translate').text(shuffled_index_array[word_index] + ": " + obj['words'][shuffled_index_array[word_index]][given_lang]);
}

function checkUserInput() {
    var correct = obj['words'][shuffled_index_array[word_index]][to_translate_lang];
    var input = $("#user_translation").val();
    if (correct == input) {
        alert("Correct! :)");
        score += 1;
    }
    else
        alert("Wrong :(");
    if (word_index < total - 1)
        word_index += 1;
    else {
        alert("Your score is: " + score + "/" + total);
        $('#check_word_button').hide();
        $("#testing_form").hide();
        $('#word_to_translate').hide();
        $('#repeat_test_button').show();
    }
    showNextWord();
    $("#user_translation").val('');
}

function repeatTheTest() {
    word_index = 0;
    score = 0;
    shuffled_index_array = shuffle(index_array);
    $('#repeat_test_button').hide();
    $("#testing_form").show();
    showNextWord();
    $('#word_to_translate').show();
    $("#check_word_button").show();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
