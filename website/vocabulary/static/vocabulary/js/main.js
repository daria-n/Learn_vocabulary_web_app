var word_index = 0;
var total = -1;
var score = 0;
var index_array;
var shuffled_index_array;
var obj;
var given_lang;
var to_translate_lang;
var category = "";

$(document).ready(function () {

    if (window.location.pathname == '/test1/' || window.location.pathname == '/test2/' || window.location.pathname == '/test3/' || window.location.pathname == '/test4/') {
        setGivenLanguage();
    }

    if (window.location.pathname.indexOf('test_translate') > 0 || window.location.pathname.indexOf('test_listen') > 0 || window.location.pathname.indexOf('test_description') > 0) {
        getGivenLanguage();
        $('form').get(0).reset();
    }

    $("#start_test_button").click(function () {
        startTheTest();
    });

    $("#check_word_button").click(function () {
        checkUserInput();
    });

    $('.modal button').click(function () {
        showNextWord();
    });

    $('.modal').keypress(function (e) {
        if (e.which == 13) {
            $(this).modal('hide');
            showNextWord();
        }
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

});

function startTheTest() {
    $('#start_test_button').hide();
    $('#testing_form').show();
    if (window.location.pathname.indexOf('test_description') > 0) {
        $('#imageHint').show();
    }
    loadWords();
}

function setGivenLanguage() {
    if ($('#given_language').text() == 'polish' || window.location.pathname == '/test3/' || window.location.pathname == '/test4/') {
        given_lang = 'pol';
        to_translate_lang = 'eng';
    }
    else if ($('#given_language').text() == 'english') {
        given_lang = 'eng';
        to_translate_lang = 'pol';
    }
    localStorage.setItem("given_lang", given_lang);
    localStorage.setItem("to_translate_lang", to_translate_lang);
}

function getGivenLanguage() {
    given_lang = localStorage.getItem("given_lang");
    to_translate_lang = localStorage.getItem("to_translate_lang");
    if (window.location.pathname.indexOf('test_listen') > 0) {
        $('#set_to_translate_lang').text('english');
        $('.dropdown-menu li').filter('.listen').addClass('active');
        //$('.dropdown-menu li').filter('.eng_pol').remove('active');
        //$('.dropdown-menu li').filter('.pol_eng').remove('active');
    }
    else if (window.location.pathname.indexOf('test_description') > 0) {
        $('.dropdown-menu li').filter('.desc').addClass('active');
    }
    else if (given_lang == 'eng') {
        $('#set_given_lang').text('english');
        $('#set_to_translate_lang').text('polish');
        $('.dropdown-menu li').filter('.eng_pol').addClass('active');
        //$('.dropdown-menu li').filter('.pol_eng').remove('active');
    }
    else {
        $('#set_given_lang').text('polish');
        $('#set_to_translate_lang').text('english');
        $('.dropdown-menu li').filter('.pol_eng').addClass('active');
        //$('.dropdown-menu li').filter('.eng_pol').remove('active');
    }
}

function loadWords() {
    var command = $('#chosen_category').text();
    category = command;
    $.ajax({
        type: "GET",
        url: "/json/words/",
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
            showWord();
        },
        error: function (error) {
            console.log("Error:");
            console.log(error);
        }
    });
}

function saveResult() {
    var test_type;
    if (window.location.pathname.indexOf('test_translate') > 0)
        test_type = "translating";
    else if (window.location.pathname.indexOf('test_listen') > 0)
        test_type = "listening";
    else if (window.location.pathname.indexOf('test_description') > 0)
        test_type = "understanding description";
    else
        test_type = "unknown";
    $.ajax({
        type: 'POST',
        url: '/json/results/',
        data: {score: score, max_possible: total, category: category, test_type: test_type},
        error: function () {
            alert('ERROR!');
        }
    });
}

function showWord() {
    var word_to_translate = obj['words'][shuffled_index_array[word_index]][given_lang];
    var word_in_english = obj['words'][shuffled_index_array[word_index]]['eng'];
    var word_description = obj['words'][shuffled_index_array[word_index]]['desc'];
    if (window.location.pathname.indexOf('test_translate') > 0) {
        $('#word_to_translate').text(word_to_translate);
    }
    else if (window.location.pathname.indexOf('test_listen') > 0) {
        $("#playAudioButton").show();
        $("#word_to_translate_audio").attr('src', '/static/vocabulary/audios/' + word_in_english + '.mp3');
        $("#word_to_translate_audio").trigger('play');
    }
    else if (window.location.pathname.indexOf('test_description') > 0) {
        $('#word_to_translate').text(word_description);
        $("#wordImage").attr('src', '/static/vocabulary/pictures/words/' + word_in_english + '.png');
    }
    $("#user_translation").val("");
    $('#check_word_button').attr('disabled', true);
    $('#user_translation').focus();
}

function showNextWord() {
    if (word_index < total - 1) {
        word_index += 1;
        showWord();
    }
    else {
        $("#playAudioButton").hide();
        $('#check_word_button').hide();
        $("#testing_form").hide();
        $('#word_to_translate').hide();
        $('#repeat_test_button').show();
        if (window.location.pathname.indexOf('test_description') > 0) {
            $('#imageHint').hide();
        }
        saveResult();
    }
}

function checkUserInput() {
    var correct = obj['words'][shuffled_index_array[word_index]][to_translate_lang];
    var input = $("#user_translation").val();
    //if (correct.indexOf(input) != -1) {
    if (correct == input) {
        $('#wrong_modal_title').hide();
        $('#wrong_cross').hide();
        $('#correct_modal_title').show();
        $('#correct_tick').show();
        score += 1;
    }
    else {
        $('#correct_answer').text(correct);
        $('#correct_modal_title').hide();
        $('#correct_tick').hide();
        $('#wrong_modal_title').show();
        $('#wrong_cross').show();
    }
    if (word_index >= total - 1) {
        $('#test_finished').show();
        $('#score').text(score + "/" + total);
    }
}

function repeatTheTest() {
    $('#test_finished').hide();
    word_index = 0;
    score = 0;
    shuffled_index_array = shuffle(index_array);
    $('#repeat_test_button').hide();
    $("#testing_form").show();
    showWord();
    $('#word_to_translate').show();
    $("#check_word_button").show();
    if (window.location.pathname.indexOf('test_description') > 0) {
        $('#imageHint').show();
    }
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

function playAudio() {
    document.getElementById('word_to_translate_audio').play();
}
