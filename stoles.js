$(function() {
  $("#custom_tabs").tabs();

  window.custom_texts = [];
  window.custom_items = {
    "texts" : {},
    "greek_right" : '', 
    "greek_left" : '',
    "art" : ''
  };
  let font_sizes = ['small', 'medium', 'large', 'xl', 'xxl'];
  // Custom Text 
  
  $("#addText").click(function(e) {
    e.preventDefault();
    //Scroll up the text editor
    $('.textOptions').slideUp();
    $('#customText').val('');
    $('select#font').val('');
    //Slider for text size
    var p = $('.value');
    $('#slider').slider({
        max: 24,
        min: 12,
        value: 12,
        step: 1,
        stop: function(event, ui) {
          console.log(ui.value);
          var font_size = font_sizes[ui.value] + '-size';
          var currentText = $('#current_text_id').val();
          $(`#${ currentText }`).removeClass('small-size medium-size large-size xl-size xxl-size');
          $(`#${ currentText }`).attr('data-size', ui.value);
          $(`#${ currentText }`).addClass(font_size);
          var currentTextID = currentText.replace('_text', '');
          $(`.editTextItem[data-attr="${ currentTextID }"]`).attr('data-size', ui.value);
          custom_items['texts'][$('#current_text_id').val()]['size'] = font_sizes[ui.value];
        }
    });

    $("#slider").slider("value", 12);
    $('#makeHorizontal').attr('checked', true);
    var textItems = $('#custom_text .item').length;
    if (textItems < 6) {
      //come up with a random number
      textID = Math.floor(Math.random()*9000) + 1000;
      //Append a UL Item to the textList
      $('ul#main').append('<li><span id="add' + textID + '_text">Enter Text</span> +$5.00 <br /><span data-attr="' + textID + '" class="btn editTextItem">Edit</span> <span class="btn deleteTextItem" data-attr="' + textID + '">Delete</span><div></div></li>');
      $('div#custom_text').append('<div class="item" data-text="Enter Text" id="' + textID + '_text">Enter Text</div>');
      $('#current_text_id').val(textID + '_text');

      
      $('div#custom_text div.item').draggable({
    containment: 'div.imageBox', // Limit the drag within the div with class 'imageBox'
    stop: function(event, ui) {
        console.log('TEXT Drag', ui);

        // Get the mouse position relative to the div.imageBox
        var imageBoxOffset = $('div.imageBox').offset();
        var leftPosition = event.pageX - imageBoxOffset.left;
        var topPosition = event.pageY - imageBoxOffset.top;

        // Update the position in the custom_items array
        // custom_items['texts'][$('#current_text_id').val()]['position'] = {
        //     left: leftPosition,
        //     top: topPosition
        // };
    }
});


    } else {
      alert('you can have a maximum of 6 textual inputs!');
    }
    $('.textOptions').slideDown();
    console.log('test',$('#current_text_id').val())
    custom_items['texts'][$('#current_text_id').val()] = { 'text' : 'Enter Text' };
    custom_texts.push($('#current_text_id').val());
  });
  
  function printCustomText() {
    let directionValue = $('input[name="textDirection"][type="radio"]:checked').val();
    let currentText = $('#current_text_id').val();
    let customText = $('input#customText').val();
    console.log(directionValue, customText);
    if( customText == '' ) {
      customText = 'Enter Text';
    }
    if( directionValue == 'vertical' ) {
        verticalText = customText.trim().split('').join('<br>');
        $(`#custom_text div#${ currentText }`).html(verticalText);
    } 
    else if( directionValue == 'horizontal' ) {
        $(`#custom_text div#${ currentText }`).html(customText.trim());
    }
  }


  // Change text 
  $(document).on('keyup', '#customText', function(e) {
    var textValue = $(this).val().trim();
    console.log(textValue);
    var currentText = $('#current_text_id').val();
    $(`#${ currentText }`).html(textValue);
    $(`#${ currentText }`).attr('data-text', textValue);
    $(`#${ currentText }`).draggable({});
    $(`#add${ currentText }`).html(textValue);
    printCustomText();
    custom_items['texts'][$('#current_text_id').val()]['text'] = textValue;
  });

  // Change font\
  $('select#font').change(function (e) {
    var fontFamily = $(this).val();
    var currentText = $('#current_text_id').val();
    $(`#${ currentText }`).attr('data-font', fontFamily);
    $(`#${ currentText }`).removeClass('arialText fullBlock monotype timesText');
    $(`#${ currentText }`).addClass(fontFamily);
    var currentTextID = currentText.replace('_text', '');
    $(`.editTextItem[data-attr="${ currentTextID }"]`).attr('data-font', fontFamily);
    custom_items['texts'][$('#current_text_id').val()]['font'] = fontFamily;
  });

  // Change Direction
  $('input[name="textDirection"][type="radio"]').change(function(e) {
    var textDirection = $(this).val(); 
    var currentText = $('#current_text_id').val();
    $(`#${ currentText }`).removeClass('vertical horizontal');
    $(`#${ currentText }`).attr('data-direction', textDirection);
    $(`#${ currentText }`).addClass(textDirection);
    var currentTextID = currentText.replace('_text', '');
    $(`.editTextItem[data-attr="${ currentTextID }"]`).attr('data-direction', textDirection);
    custom_items['texts'][$('#current_text_id').val()]['direction'] = textDirection;
  });

  
  // Edit Text 
  $(document).on('click', 'ul#main .editTextItem', function(e) {
    $('.textOptions').slideUp();
    var currentTextId = $(this).attr('data-attr');
    console.log(currentTextId)
    var textString = $(`span#add${ currentTextId }_text`).html();
    $('#customText').val(textString);
    $('input[name="type"][value="text"]').attr('checked', true);
    
    if( $(this).attr('data-size') ) {
      $("#slider").slider("value", $(this).attr('data-size'));
    } else {
      $("#slider").slider("value", 0);
    }
    
    if( $(this).attr('data-direction') ) {
      var direction = $(this).attr('data-direction');
      $(`input[name="textDirection"][type="radio"][value="${ direction }"]`).prop('checked', true);
    } else {
      $('input[name="textDirection"][type="radio"][value="horizontal"]').prop('checked', true);
    }
    
    if( $(this).attr('data-font') ) {
      $('select#font').val($(this).attr('data-font'));
    } else {
      $('select#font').val('');
    }
    $('.textOptions').slideDown();
    $('#current_text_id').val(currentTextId+'_text');
  });

  // Delete Text 
  $(document).on('click', 'ul#main .deleteTextItem ', function(e) {
    $('.textOptions').slideUp();
    var currentTextId = $(this).attr('data-attr');
    $(`ul#main #add${ currentTextId }_text`).closest('li').remove();
    $(`#custom_text div#${ currentTextId }_text`).remove();
    $('#customText').val('');
    $("#slider").slider("value", 0);
    $('input[name="textDirection"][type="radio"][value="horizontal"]').prop('checked', true);
    $('select#font').val('');
    delete custom_items['texts'][`${ currentTextId }_text`];
    custom_texts = custom_texts.filter(function (text) { return text !== `${ currentTextId }_text`; });
  });

  // Change Text Direction
  $('input[name="textDirection"][type="radio"]').change(function(e) {
    printCustomText();
  });

  ///// Custom Art change
  $('#custom_tabs #file_upload').change(function (e) {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
    
      reader.onload = function (e) {
        $('#custom_art_uploaded').val(e.target.result);
        if( $('#custom_art img').length > 0 ) {
          $('#custom_art img').attr('src', e.target.result);
        } else {
          img_html = `<img src="${ e.target.result }" loading="lazy" height="100%" width="auto">`
          $('#custom_art').html(img_html);
        }
        if( !$('#custom_art').hasClass('ui-draggable') ){
          $('#custom_art').draggable();
        }
        if( !$('#custom_art').hasClass('ui-resizable') ){
          $('#custom_art').resizable();
        }
      }
      reader.readAsDataURL(this.files[0])
    }
  });

 var custom_items = {
  'greek_right': {
    'position': { top: 165, left: 178 } // Initial position values
  },
  'greek_left': {
    'position': { top: 165, left: 308 } // Initial position values
  }
};

// Create draggable elements and set initial positions
$(document).ready(function () {
  $('#greek_right').draggable({
    containment: 'div.imageBox',
    stop: function (event, ui) {
      console.log('position', ui.position);
      custom_items['greek_right']['position'] = ui.position;
    }
  }).css(custom_items['greek_right']['position']);

  $('#greek_left').draggable({
    containment: 'div.imageBox',
    stop: function (event, ui) {
      console.log('position', ui.position);
      custom_items['greek_left']['position'] = ui.position;
    }
  }).css(custom_items['greek_left']['position']);
});



  
  // $('#greek_right').draggable({
  //     containment: 'div.imageBox', // Limit the drag within the div with class 'imageBox'
  //     stop: function(event, ui) {
  //       console.log('position', ui.position);
  //       custom_items['greek_right']['position'] = ui.position
  //     }
  // });
  // $('#greek_left').draggable({
  //     containment: 'div.imageBox', // Limit the drag within the div with class 'imageBox'
  //     stop: function(event, ui) {
  //       console.log('position', ui.position);
  //       custom_items['greek_left']['position'] = ui.position
  //     }
  // });

  // Greek Right
  $('#addGreek').on('click', function(event) {
    var greek1 = $('#greek1').val();
    var greek2 = $('#greek2').val();
    var greek3 = $('#greek3').val();
    var greek4 = $('#greek4').val();
    if (greek1 != '' || greek2 != '' || greek3 != '' || greek4 != '') {
      $('#greek_right').html(greek1 + '<br />' + greek2 + '<br />' + greek3 + '<br />' + greek4);
      custom_items['greek_right']['text'] = `${ greek1 } | ${ greek2 } | ${ greek3 } | ${ greek4 }`;
    }
  });

  $('#removeGreek').on('click', function(event) {
    $('#greek_right').html("");
    custom_items['greek_right'] = '';
  });
  
  // Greek Left
  $('#addGreekLeft').on('click', function(event) {
    event.preventDefault();
    var greek1 = $('#greek1Left').val();
    var greek2 = $('#greek2Left').val();
    var greek3 = $('#greek3Left').val();
    var greek4 = $('#greek4Left').val();
    if (greek1 != '' || greek2 != '' || greek3 != '' || greek4 != '') {
      $('#greek_left').html(greek1 + '<br />' + greek2 + '<br />' + greek3 + '<br />' + greek4);
      custom_items['greek_left']['text'] = `${ greek1 } | ${ greek2 } | ${ greek3 } | ${ greek4 }`;
    }
  });
  
  $('#removeGreekLeft').on('click', function(event) {
    $('#greek_left').html("");
    custom_items['greek_left'] = '';
  });
  
});

